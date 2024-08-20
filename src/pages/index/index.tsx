import { memo, PropsWithChildren, PureComponent, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import "./index.scss";
import { SQLiteManage } from "../../sql/SQLiteManage";
import { fileImport } from "../../sql/vfs";
import { IndexedDB } from "../../store/indexedDB";
    // Use a service worker for downloading. This is currently the only
// cross-browser way to stream to a local file.
// navigator.serviceWorker.register('service-worker.js', { type: 'module' });
export default memo(()=>{
const sm = new  SQLiteManage({DBname:"sqlite"})
const IDB = new IndexedDB("idb_name")
const init = async()=>{
  await sm.create()
  
}
useEffect(()=>{
  init()
},[])
  return (
    <View className="index">
      <Text>words!</Text>
      <Button onClick={()=>{
        sm.select()
      }}>SELECT</Button>
      <Button onClick={async()=>{
        const db =await IDB.init()
        IDB.persistContact(db,{a:'11111'})
      }}>INDEXEDDB</Button>

      <input
        type="file"
        onChange={async(e) => {
          fileImport(e)
        }}
      />
    </View>
  );
})