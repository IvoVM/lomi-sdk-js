const { createJourney } = require('./spree/spree')("")
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
const spreeUtils = require('../utils/spree/spree')(spreeUrl, token, spreeDebugUrl);
const statusUtils = require('../utils/status');

module.exports = (admin) => {

    async function setStatusInDocWithTimestamp(status, orderDoc){
        console.log("Setting status in doc with timestamp", "status: "+status, "doc: "+orderDoc.id)
        const statusText = getStatusText(status);
        await orderDoc.update({
            status: status,
            [statusUtils[statusText]+"_at"]: new Date()
        });
    }

    async function syncroJourney(journey){
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

    async function updateJourney(status, journey){
        const orderDoc = admin.firestore().collection('SPREE_ORDERS_'+journey.stock_location_id).doc(journey.orderNumber);
        if(status){
            await setStatusInDocWithTimestamp(status, orderDoc);
        }
        await syncroJourney(journey);
    }


    async function createJourney(journeyId, providerId, additionalData, order){
        const db = admin.firestore();
        const journeyRef = db.collection('deliveringJourneys').doc(journeyId);
        const orderJourneyRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number).collection("journeys").doc(journeyId);
        const orderRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number)
        await orderRef.update({
            status: 5,
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
        await spreeUtils.createJourney(order.shipment_id, "4", order.token);
        return journeyRef.set({
            id: journeyId,
            providerId: providerId,
            orderNumber: order.number,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            stock_location_id: order.shipment_stock_location_id,
            ...additionalData
        })
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

    async function finishJourney(journeyId, order){
        const db = admin.firestore();
        const journeyRef = db.collection('deliveringJourneys').doc(journeyId);
        const orderJourneyRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number).collection("journeys").doc(journeyId);
        const orderRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number)
        await orderRef.update({
            status: 8,
        })
        await orderJourneyRef.update({
            status: "shipped",
            updatedAt: new Date(),
        })
        return journeyRef.delete();
    }

    return {
        finishJourney,
        createJourney,
        cancelJourney,
        updateJourney
    }

}