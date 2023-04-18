import { socketIoClient } from "../lomi-sdk";
export const ripley = (() => {

    const events = {
    }

   async function getRipleyAttributes(params = {

   }) {
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("mirakl:attributes:list", params, (data:any)=>{
                resolve(data)
            })
        })
   }

   async function getRipleyHierarchies(params = {}){
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("mirakl:hierarchy:list", params, (data:any)=>{
                resolve(data)
            })
        })
   }

   async function getRipleyOrders(params = {}){
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("mirakl:orders:list", params, (data:any)=>{
                resolve(data)
            })
        })
   }
    
    return {
        getRipleyAttributes,
        getRipleyHierarchies,
        getRipleyOrders,
        events
    }    

})()
