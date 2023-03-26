import { socketIoClient } from "../lomi-sdk";
export const catalogue = (() => {

    const events = {
        onProductAvailable: (callback:any) => socketIoClient.on("spree:products:available", (data:any)=>{callback(data)}),
        onProductUnavailable: (callback:any) => socketIoClient.on("spree:products:unavailable", (data:any)=>{callback(data)})
    }

    const getProducts = (stockLocationId:string) => {
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("spree:products:list", {
                "limit": 300,
                "stock_location_id": stockLocationId
            },(data:any)=>{
                resolve(data)
            });
        })
    }
    
    const getStockItems = (stockLocationId:string) => {
        return new Promise((resolve, reject)=>{
            socketIoClient.emit("spree:stock_item:getStockItems", {
                "stock_location_id": stockLocationId,
                "limit": 50
            },(data:any)=>{
                resolve(data)
            });
        })
    }

    const searchProduct = (stock_location_id:string, name:string, sku:string) => {
        return new Promise((resolve,reject)=>{
            socketIoClient.emit("spree:products:searchProduct", 
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

    const enableProduct = (variantId:any, stockLocationId:any) => {
        socketIoClient.emit("spree:products:available", {
            productId: variantId,
            stockLocation: stockLocationId
        }, (data:any)=>{
            console.log(data, "toggleAvaibility")
        })
    }

    const disableProduct = (variantId:any, stockLocationId:any) => {
        socketIoClient.emit("spree:products:unavailable", {
            productId: variantId,
            stockLocation: stockLocationId
        }, (data:any)=>{
            console.log(data, "toggleAvaibility")
        })
    }
    
    return {
        getStockItems,
        searchProduct,
        enableProduct,
        disableProduct,
        getProducts,
        events
    }    

})()
