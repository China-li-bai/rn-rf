import * as VFS from "wa-sqlite/src/VFS.js";

const DBFILE_MAGIC = "SQLite format 3\x00";
/**
 * @param {IDBBatchAtomicVFS} vfs
 * @param {string} path
 * @param {ReadableStream} stream
 */
export async function importDatabase(vfs, path, stream) {
  // This generator converts arbitrary sized chunks from the stream
  // into SQLite pages.
  async function* pagify() {
    /** @type {Uint8Array[]} */ const chunks = [];
    const reader = stream.getReader();

    // Read at least the file header fields we need.
    log("Reading file header...");
    while (chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0) < 32) {
      const { done, value } = await reader.read();
      if (done) throw new Error("Unexpected end of file");
      chunks.push(value);
    }

    // Consolidate the header into a single DataView.
    let copyOffset = 0;
    const header = new DataView(new ArrayBuffer(32));
    for (const chunk of chunks) {
      const src = chunk.subarray(0, header.byteLength - copyOffset);
      const dst = new Uint8Array(header.buffer, copyOffset);
      dst.set(src);
      copyOffset += src.byteLength;
    }

    if (new TextDecoder().decode(header.buffer.slice(0, 16)) !== DBFILE_MAGIC) {
      throw new Error("Not a SQLite database file");
    }

    // Extract page fields.
    const pageSize = ((field) => (field === 1 ? 65536 : field))(
      header.getUint16(16)
    );
    const pageCount = header.getUint32(28);
    log(
      `${pageCount} pages, ${pageSize} bytes each, ${
        pageCount * pageSize
      } bytes total`
    );

    // Yield each page in sequence.
    log("Copying pages...");
    for (let i = 0; i < pageCount; ++i) {
      // Read enough chunks to produce the next page.
      while (
        chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0) < pageSize
      ) {
        const { done, value } = await reader.read();
        if (done) throw new Error("Unexpected end of file");
        chunks.push(value);
      }

      // Assemble the page into a single Uint8Array.
      let page;
      if (chunks[0]?.byteLength >= pageSize) {
        // The first chunk contains the entire page.
        page = chunks[0].subarray(0, pageSize);
        chunks[0] = chunks[0].subarray(pageSize);
        if (!chunks[0].byteLength) {
          chunks.shift();
        }
      } else {
        // Multiple chunks are needed for the page.
        let copyOffset = 0;
        page = new Uint8Array(pageSize);
        while (copyOffset < pageSize) {
          // Copy bytes into the page.
          const src = chunks[0].subarray(0, pageSize - copyOffset);
          const dst = new Uint8Array(page.buffer, copyOffset);
          dst.set(src);
          copyOffset += src.byteLength;

          chunks[0] = chunks[0].subarray(src.byteLength);
          if (!chunks[0].byteLength) {
            chunks.shift();
          }
        }
      }

      yield page;
    }

    const { done } = await reader.read();
    if (!done) throw new Error("Unexpected data after last page");
  }

  const onFinally = [];
  try {
    // Create the file.
    log(`Creating ${path}...`);
    const fileId = 1234;
    const flags =
      VFS.SQLITE_OPEN_MAIN_DB |
      VFS.SQLITE_OPEN_CREATE |
      VFS.SQLITE_OPEN_READWRITE;
    await check(
      vfs.jOpen(path, fileId, flags, new DataView(new ArrayBuffer(4)))
    );
    onFinally.push(() => vfs.jClose(fileId));

    // Open a "transaction".
    await check(vfs.jLock(fileId, VFS.SQLITE_LOCK_SHARED));
    onFinally.push(() => vfs.jUnlock(fileId, VFS.SQLITE_LOCK_NONE));
    await check(vfs.jLock(fileId, VFS.SQLITE_LOCK_RESERVED));
    onFinally.push(() => vfs.jUnlock(fileId, VFS.SQLITE_LOCK_SHARED));
    await check(vfs.jLock(fileId, VFS.SQLITE_LOCK_EXCLUSIVE));

    const ignored = new DataView(new ArrayBuffer(4));
    await vfs.jFileControl(
      fileId,
      VFS.SQLITE_FCNTL_BEGIN_ATOMIC_WRITE,
      ignored
    );

    // Truncate file.
    await check(vfs.jTruncate(fileId, 0));

    // Write pages.
    let iOffset = 0;
    for await (const page of pagify()) {
      await check(vfs.jWrite(fileId, page, iOffset));
      iOffset += page.byteLength;
    }

    await vfs.jFileControl(
      fileId,
      VFS.SQLITE_FCNTL_COMMIT_ATOMIC_WRITE,
      ignored
    );
    await vfs.jFileControl(fileId, VFS.SQLITE_FCNTL_SYNC, ignored);
    await vfs.jSync(fileId, VFS.SQLITE_SYNC_NORMAL);
  } finally {
    while (onFinally.length) {
      await onFinally.pop()();
    }
  }
}

export async function verify() {
  const verifierURL = new URL("./verifier.js", location.href);
  verifierURL.searchParams.set("idb", IDB_NAME);
  verifierURL.searchParams.set("db", DB_NAME);
  const worker = new Worker(verifierURL, { type: "module" });
  await new Promise((resolve) => {
    worker.addEventListener("message", ({ data }) => {
      resolve();
      for (const row of data) {
        log(`integrity result: ${row}`);
      }
      worker.terminate();
    });
  });
}

function log(...args) {
  const timestamp = new Date().toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  const element = document.createElement("pre");
  element.textContent = `${timestamp} ${args.join(" ")}`;
  document.body.append(element);
}

async function check(code) {
  if ((await code) !== VFS.SQLITE_OK) {
    throw new Error(`Error code: ${code}`);
  }
}
