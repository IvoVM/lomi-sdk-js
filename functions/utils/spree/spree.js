const axios = require('axios');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');



module.exports = ( spreeUrl, spreeToken, spreeDebugUrl ) => {
 
    function getShipments(orderId, DEBUG = false){
        return new Promise(async (resolve, reject) => {
            try{
                const url = `${DEBUG ? spreeDebugUrl : spreeUrl}/api/v1/orders/${orderId}?token=${spreeToken}`;
                const headers = {
                    'Authorization': `Bearer ${spreeToken}`,
                    'Content-Type': 'application/json',
                    
                }
                console.log("searching for order", orderId, "IS_DEBUG=", DEBUG)
                const response = await axios.get(url, { headers }).then(shipments=>{
                    resolve(shipments.data.shipments)
                }).catch((error) => {
                    if(error.response.status == 404){
                        console.log(error)
                        resolve('broken')
                    } else {
                        error('Error getting shipments', error.response )
                    }
                });
            } catch(e){
                console.log(e)
            }
        })
    }

    function getDebugOrder(orderId){
        return this.getOrder(orderId, spreeDebugUrl)
    }

    function getOrder(orderId, spreeOrderUrl = spreeUrl){
        return new Promise(async (resolve, reject) => {
            try{
                const url = `${spreeOrderUrl}/api/v1/orders/${orderId}?token=${spreeToken}`;
                const headers = {
                    'Authorization': `Bearer ${spreeToken}`,
                    'Content-Type': 'application/json',
                    
                }
                const response = await axios.get(url, { headers }).then(shipments=>{
                    resolve(shipments.data)
                }).catch((error) => {
                    console.log(error)
                    if(error.response.status == 404){
                        resolve('broken')
                    } else {
                        error('Error getting shipments', error.response )
                    }
                });
            } catch(e){
                console.log(e)
            }
        })
    }


    function markShipmentAsReady(shipmentId){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/shipments/${shipmentId}/ready?token=${spreeToken}`;
            console.log(url)
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.put(url, {
                "tracking":"https://lomi.hermex.delivery/"+shipmentId,
            }, { headers });
            resolve(response.data);
        })
    }

    function markShipmentAsShipped(shipmentId){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/shipments/${shipmentId}/ship?token=${spreeToken}`;
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.put(url, {
                "tracking":"https://lomi.hermex.delivery/"+shipmentId,
            }, { headers });
            resolve(response.data);
        })
    }

    function getStockLocations(){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/stock_locations?token=${spreeToken}`;
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.get(url, { headers });
            const zones = response.data;
            resolve(zones);
        })
    }

    return {
        getShipments,
        markShipmentAsReady,
        markShipmentAsShipped,
        getStockLocations,
        getOrder,
        getDebugOrder
    }
}