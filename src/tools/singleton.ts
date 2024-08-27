
type Fn = (...args:any[])=>any
export function singleton<T extends Fn>(fn:T):(param:Parameters<T>)=>ReturnType<T>|undefined {
  let result
  return (args)=>{
    if (!result) {
      console.log({a:this})
      result = fn.apply(this,args)
    }
    return result
  }
  function r(){
    console.log({b:this});
    
  }
}