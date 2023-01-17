const firebaseUtils = require("../../utils/firebase/firebase");
const firebaseResourceUtils = require("../../utils/firebase/resources");
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

module.exports = (admin) => {

    const converOrderToDeliveryTime = (order) => {
        return {
            number: order.number || null,
            completed_at: order.completed_at || null,
            courier_at_store: order.courier_at_store || null,
            courier_at_dropoff: order.courier_at_dropoff || null,
            delivered_at: order.delivered_at || null,
            assignment_time: order.assignment_time || null,
            picking_time: order.picking_time || null
        }
    };

    const getStoreOrdersDeliveryTimes = async (stockLocationId) => {
        const stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollection("SPREE_ORDERS_"+stockLocationId);
        return stockLocationOrdersCollection.map(converOrderToDeliveryTime);
    };

    const getAllOrdersDeliveryTimes = async () => {
        const stockLocations = await firebaseResourceUtils(admin).getResourcesCollectionStockLocations();
        const stockLocationsIds = stockLocations.map(stockLocation => stockLocation.id);
        const stockLocationsOrders = await Promise.all(stockLocationsIds.map(stockLocationId => getStoreOrdersDeliveryTimes(stockLocationId)));
        return stockLocationsOrders.reduce((acc, orders) => acc.concat(orders), []);
    };

    const apiGetOrdersDeliveryTimes = functions.https.onRequest(async (req, res) => {
        cors(req, res, async () => {
            const ordersDeliveryTimes = await getAllOrdersDeliveryTimes();
            res.send(ordersDeliveryTimes);
        });
    });

    return {
        apiGetOrdersDeliveryTimes
    }

}