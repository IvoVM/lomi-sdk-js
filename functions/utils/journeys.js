const { createJourney } = require('./spree/spree')("")
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
const spreeUtils = require('../utils/spree/spree')(spreeUrl, token, spreeDebugUrl);

module.exports = (admin) => {


    async function createJourney(journeyId, providerId, additionalData, order){
        const db = admin.firestore();
        const journeyRef = db.collection('deliveringJourneys').doc(journeyId);
        const orderJourneyRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number).collection("journeys").doc(journeyId);
        const orderRef = db.collection('SPREE_ORDERS_'+order.shipment_stock_location_id).doc(order.number)
        await orderRef.update({
            status: 5,
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
        cancelJourney
    }

}