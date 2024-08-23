import { memo, PropsWithChildren, PureComponent, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import "./index.scss";
import { SQLiteManage } from "../../sql/SQLiteManage";
import { fileImport } from "../../sql/vfs";
import { IndexedDB } from "../../store/indexedDB";
import { json2idb } from "tools/json2idb";
// Use a service worker for downloading. This is currently the only
// cross-browser way to stream to a local file.
// navigator.serviceWorker.register('service-worker.js', { type: 'module' });
export default memo(() => {
  const idb = new IndexedDB("idb_name");

  useEffect(() => {}, []);
  return (
    <View className="index">
      <Text>words!</Text>
      <Button onClick={() => {}}>SELECT</Button>
      <Button
        onClick={async () => {
          const db = await idb.init();
          idb.persistContact(db, { a: "11111" });
        }}
      >
        INDEXEDDB
      </Button>
      <Button onClick={async()=>{
        const db=  await idb.getDB()
        console.log({db});
        
      }}> get idb</Button>
      <Button onClick={json2idb}> json 2 idb</Button>
      <input
        type="file"
        onChange={async (e) => {
          fileImport(e);
        }}
      />
    </View>
  );
});
