import { createIndex, createStore, get, set } from "store/indexedDB/idb-function";
import GaoZhongluan from "./GaoZhongluan_2_output.json"

export const json2idb = async()=>{
  console.log({aa:GaoZhongluan[0]});
 const store = createStore("GaoZhongluan","GaoKao")
  set(GaoZhongluan[0].headWord,GaoZhongluan[0],store)
  get(GaoZhongluan[0].headWord,store).then((val) => console.log(val));
  createIndex("GaoZhongluan","GaoKao",GaoZhongluan[0].headWord)
}