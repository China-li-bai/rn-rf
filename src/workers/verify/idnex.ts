const SEARCH_PARAMS = new URLSearchParams(location.search);
const IDB_NAME = SEARCH_PARAMS.get("idb") ?? "sqlite";
const DB_NAME = SEARCH_PARAMS.get("db") ?? "sqlite";
export async function verify() {
  const verifierURL = new URL('./verifier.js', location.href);
  verifierURL.searchParams.set('idb', IDB_NAME);
  verifierURL.searchParams.set('db', DB_NAME);
  const worker = new Worker(verifierURL, { type: 'module' });
  await new Promise<void>(resolve => {
    worker.addEventListener('message', ({data}) => {
      resolve();
      for (const row of data) {
        console.log(`integrity result: ${row}`);
      }
      worker.terminate();
    });
  });
}