const axios = require('axios');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');



module.exports = ( spreeUrl, spreeToken ) => {
 
    function getShipments(orderId){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/orders/${orderId}?token=${spreeToken}`;
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.get(url, { headers });
            const shipments = response.data.shipments;
            resolve(shipments);
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
        getStockLocations
    }
}