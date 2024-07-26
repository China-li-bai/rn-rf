import { mockService } from "service"

export const  getList =async ()=>{
  const resule = await mockService.get({url:'/list'})
  console.log({resule});
  
  return resule
}