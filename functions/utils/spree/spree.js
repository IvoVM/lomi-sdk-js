const axios = require('axios');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const logisticProvidersUtils = require('../logisticProviders.js');


module.exports = ( spreeUrl, spreeToken, spreeDebugUrl ) => {
    
    function axiosErrorHandling(error){
        const response = error.response;
        if(!response){
            console.log("Axios error: "+ error);
            return {
                error: {
                    status: 500,
                    statusText: error,
                }
            }
        }
        console.log("Axios error: "+ response.status + " " + response.statusText);
        return {
            error: {
                status: response.status,
                statusText: response.statusText,
            }
        }
    }
 
    function getShipments(orderId, DEBUG = false){
        return new Promise(async (resolve, reject) => {
                const url = `${DEBUG ? spreeDebugUrl : spreeUrl}/api/v1/orders/${orderId}?token=${spreeToken}`;
                const headers = {
                    'Authorization': `Bearer ${spreeToken}`,
                    'Content-Type': 'application/json',
                    
                }
                console.log("searching for shipments for", orderId, "IS_DEBUG=", DEBUG)
                const response = await axios.get(url, { headers }).then(shipments=>{
                    resolve({
                        shipments: shipments.data.shipments,
                        xSpreeOrderToken: shipments.data.token
                    })
                }).catch(axiosErrorHandling);
                if(response?.error){
                    console.log(response.error.status)
                    response.error ? resolve('broken') : reject(response.error)
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
                console.log("searching for journeys ", shipmentId)
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

    function getOrders(){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/orders?q[state_cont]=complete&q[s]=completed_at%20desc&token=${spreeToken}`;
            console.log("Requesting orders from spree", url)
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.get(url, { headers }).catch(axiosErrorHandling);
            response.error ? 
                reject(response.error) :
                resolve(response.data);
        })
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
                    console.log("Requesting order from spree number: ", orderId)
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
            }, { headers }).catch(axiosErrorHandling);
            response.error ? 
                reject(response.error) :
                resolve(response.data);
        })
    }

    function markShipmentAsShipped(shipmentId){
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v1/shipments/${shipmentId}/ship?send_shipped_email=false&token=${spreeToken}`;
            const headers = {
                'Authorization': `Bearer ${spreeToken}`,
                'Content-Type': 'application/json',
                
            }
            const response = await axios.put(url, {
                "tracking":"https://lomi.hermex.delivery/"+shipmentId,
            }, { headers }).catch(axiosErrorHandling);
            reject(response.error)
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

    function createJourney(journey, shipmentId , xSpreeOrderToken){
        const spreeProviderId = logisticProvidersUtils.normalProviderIdToSpreeProviderId(journey.providerId)
        console.log("Creating journey in spree for shipment: ", shipmentId, " with provider: ", spreeProviderId)
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v2/storefront/journeys`;
            const headers = {
                "X-Spree-Order-Token": `${xSpreeOrderToken}`,
            }

            const response = await axios.post(url, {
                "shipment_id": shipmentId,
                "logistic_operator_id": spreeProviderId,
                "tracking_url": journey.trackingUrl,
                "journey_id": journey.id
            }, { headers }).catch(axiosErrorHandling);
            resolve(response.data);
        })
    }

    function updateJourney(updatePayload, journeyId, xSpreeOrderToken){
        console.log("Updating journey in spree for journey: ", journeyId)
        return new Promise(async (resolve, reject) => {
            const url = `${spreeUrl}/api/v2/storefront/journeys/${journeyId}`;
            const headers = {
                "X-Spree-Order-Token": `${xSpreeOrderToken}`,
            }

            const response = await axios.patch(url, updatePayload, { headers }).catch((error) => {
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
        getOrders,
        getDebugOrder,
        getJourneys,
        createJourney,
        updateJourney
    }
}