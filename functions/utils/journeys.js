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
        })
        return journeyRef.set({
            id: journeyId,
            providerId: providerId,
            orderNumber: order.number,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
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