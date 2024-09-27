import { memo, PropsWithChildren, PureComponent, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import "./index.scss";
import { fileImport } from "../../sql/vfs";
import { IndexedDBClient } from "store/indexedDB";
import { json2idb } from "tools/json2idb";
import { helloWaSQL } from "sql/wa-sql";
const idb = new IndexedDBClient("IndexedDBClient");
export default memo(() => {
  useEffect(() => {}, []);
  return (
    <View className="index">
      <Text>words!</Text>
      <Button
        onClick={() => {

          idb.createStore("words");
        }}
      >
        createStore
      </Button>
      <Button
        onClick={() => {
          const  s=  idb.getStore("words");
          console.log({s});
          
        }}
      >
        getStore
      </Button>
      <Button onClick={json2idb}>json2idb</Button>
      <Button onClick={helloWaSQL}>helloWaSQL</Button>
      <input
        type="file"
        onChange={async (e) => {
          fileImport(e);
        }}
      />
    </View>
  );
});
