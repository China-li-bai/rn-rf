class IndexDB {
  constructor(parameters) {
    
  }
  async init(){
    return  new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("")
      request.onerror = (event)=>{
        console.error(event)
      }
      request.onupgradeneeded = ev=>{
        
      }
    })
  }
}