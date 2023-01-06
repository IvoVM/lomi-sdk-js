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
                    console.log(error)
                    if(error.response?.status == 404){
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

    async function getJourneys(shipmentId, DEBUG = false){
        return new Promise(async (resolve, reject) => {
            try{
                const url = `${DEBUG ? spreeDebugUrl : spreeUrl}/api/v2/storefront/shipments/${shipmentId}/journeys`;
                const headers = {
                    'Authorization': `Bearer ${spreeToken}`,
                    'Content-Type': 'application/json',
                    
                }
                console.log("searching for journeys")
                const response = await axios.get(url, { headers }).then(journey=>{
                    resolve(journey.data.journeys)
                }).catch((error) => {
                    console.log(error)
                    if(error.response?.status == 404){
                        resolve('broken')
                    } else {
                        error('Error getting Journeys', error.response )
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

    function getStockLocationById(stockLocationId){
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

    function createJourney(shipmentId, journeyId, providerId , xSpreeOrderToken){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v2/storefront/journeys`;
            const headers = {
                "X-Spree-Order-Token": `Bearer ${xSpreeOrderToken}`,
            }

            const response = await axios.post(url, {
                "shipment_id": shipmentId,
                "journey_id": journeyId,
                "logistic_operator_id": providerId,
            }, { headers }).catch((error) => {
                console.log(error)
                return error.response
            });
            resolve(response.data);
        })
    }

    return {
        getShipments,
        markShipmentAsReady,
        markShipmentAsShipped,
        getStockLocations,
        getOrder,
        getDebugOrder,
        getJourneys,
        createJourney,
    }
}