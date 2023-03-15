const { createJourney } = require('./spree/spree')("")
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
const spreeUtils = require('../utils/spree/spree')(spreeUrl, token, spreeDebugUrl);
const statusUtils = require('../utils/states');
const algoliaUtils = require('../libraries/algolia');

module.exports = (admin) => {

    async function setStatusInDocWithTimestamp(status, orderDoc){
        console.log("Setting status in doc with timestamp", "status: "+status, "doc: "+orderDoc.id)
        const statusText = statusUtils.getStatusText(status);
        await orderDoc.update({
            status: status,
            [statusText+"_at"]: new Date()
        });
    }

    async function syncroJourneyWithFirebase(journey){
        console.log("Syncronizing journey", "id: "+journey.id, "status: "+journey.status)
        const orderJourneyDoc = admin.firestore().collection('SPREE_ORDERS_'+journey.stock_location_id).doc(journey.orderNumber).collection("journeys").doc(journey.id);
        const deliveringJourneyDoc = admin.firestore().collection('deliveringJourneys').doc(journey.id);
        await Promise.all(
            [
                orderJourneyDoc.update(journey),
                deliveringJourneyDoc.update(journey)
            ]
        )
    }

    async function syncroJourneyWithSpree(journey){
        console.log("Syncronizing journey with spree", "id: "+journey.id, "status: "+journey.status)
        const shipments = await spreeUtils.getShipments(journey.orderNumber);
        const uniqueShipment = shipments.shipments[0]
        console.log("Shipments is", uniqueShipment.number, "for order", journey.orderNumber)
        const spreeJourneys = await spreeUtils.getJourneys(uniqueShipment.id)
        const spreeJourney = spreeJourneys.find((spreeJourney) => journey.id === spreeJourney.journey_id)
        if(spreeJourney){
            console.log("Spree journey is", spreeJourney.id, "for shipment", uniqueShipment.number)
            const updatePayload = {
                state: journey.status
            }
            spreeUtils.updateJourney(updatePayload , spreeJourney.id, shipments.xSpreeOrderToken)
        } else {
            console.log("XSpreeOrderToken is", shipments.xSpreeOrderToken, "provider is: ",journey.providerId)
            spreeUtils.createJourney(journey, uniqueShipment.id, shipments.xSpreeOrderToken)
        }
    }

    async function syncroJourneyStatusWithAlgolia(journey){
        const orderId = journey.orderNumber;
        const order = await spreeUtils.getOrder(orderId);
        const orderJsonToUpdate = {
            id: order.id,
            journeyStatus: journey.status,
        }
        return await algoliaUtils.updateRecordToAlgolia(orderJsonToUpdate)
    }

    async function updateJourney(status, journey){
        const orderDoc = admin.firestore().collection('SPREE_ORDERS_'+journey.stock_location_id).doc(journey.orderNumber);
        if(status){
            await setStatusInDocWithTimestamp(status, orderDoc);
            if(status === 6 || status === 7){
                await finishJourney(journey);
            }
        }
        await Promise.all([
            await syncroJourneyWithFirebase(journey),
            await syncroJourneyWithSpree(journey)
        ])

        await syncroJourneyStatusWithAlgolia(journey)
    }

    async function finishJourney(journey){
        const deliveringJourneyDoc = admin.firestore().collection('deliveringJourneys').doc(journey.id);
        deliveringJourneyDoc.delete()
    }

    async function createJourney(journeyId, providerId, additionalData, order){
        const db = admin.firestore();
        const journeyRef = db.collection('deliveringJourneys').doc(journeyId);
        const orderJourneyRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number).collection("journeys").doc(journeyId);
        const orderRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number)
        await orderRef.update({
            status: 4,
            request_deliver_at: new Date()
        })
        await orderJourneyRef.set({
            id: journeyId,
            providerId: providerId,
            status: "pending",
            createdAt: new Date(),
            stock_location_id: order.shipment_stock_location_id,
            ...additionalData
        })
        const journey = await journeyRef.set({
            id: journeyId,
            providerId: providerId,
            orderNumber: order.number,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            stock_location_id: order.shipment_stock_location_id,
            ...additionalData
        })
        await spreeUtils.createJourney({
            providerId: providerId,
            id: journeyId,
            tracking_url: "Sin url de tracking"
        },order.shipment_id, order.token);
        return journey
    }

    async function cancelJourney(journeyId, order){
        const db = admin.firestore();
        const journeyRef = db.collection('deliveringJourneys').doc(journeyId);
        const orderJourneyRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number).collection("journeys").doc(journeyId);
        const orderRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number)
        await orderRef.update({
            status: 4,
        })
        await orderJourneyRef.update({
            status: "canceled",
            updatedAt: new Date(),
        })
        return journeyRef.delete()
    }

    return {
        finishJourney,
        createJourney,
        cancelJourney,
        updateJourney
    }

}