import { socketIoClient } from "../lomi-sdk";

export const catalogue = (() => {
    
    const getStockItems = (stockLocationId:string) => {
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("spree:stock_item:getStockItems", {
                "stock_location_id": stockLocationId,
            },(data:any)=>{
                resolve(data)
            });
        })
    }

    const searchProduct = (stock_location_id:string, name:string, sku:string) => {
        return new Promise((resolve,reject)=>{
            socketIoClient.emit("spree:stock_item:searchProduct", 
            {
                stock_location_id,
                name,
                sku
            },
            (data:any)=>{
                resolve(data)
            })
        })
    }
    
    return {
        getStockItems,
        searchProduct
    }    

})()
