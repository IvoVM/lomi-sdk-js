const firebaseUtils = require("../../utils/firebase/firebase");
const firebaseResourceUtils = require("../../utils/firebase/resources");
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '4GB'
  }
  

module.exports = (admin) => {

    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371000; // Radio de la Tierra en metros
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c; // Distancia en metros
        return distance;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

    const timestampToDate = (timestamp) => {
        return timestamp ? new Date(timestamp.seconds * 1000 ) : timestamp
    }

    const convertOrderToDeliveryTime = (order) => {
        return {
            number: order.number || null,
            distance: order.stops?.length ? getDistanceFromLatLonInMeters(order.stops[0].loc[0], order.stops[0].loc[1], order.stops[1].loc[0], order.stops[1].loc[1]) || null : null,
            completed_at: timestampToDate(order.completed_at) || null,
            courier_at_store: timestampToDate(order.store_rider_picked_at) || null,
            courier_at_dropoff: timestampToDate(order.courier_at_dropoff) || null,
            delivered_at: timestampToDate(order.store_rider_delivered_at) || null,
            assignment_time: timestampToDate(order.request_deliver_at) || null,
            picking_time: timestampToDate(order.picked_at) || null
        }
    };
    
    const getStoreOrdersDeliveryTimes = async (stockLocationId, limit = 0) => {
        let stockLocationOrdersCollection
        if(limit){
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollectionOrderedBy("SPREE_ORDERS_"+stockLocationId, "completed_at", limit);
        } else {
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollectionOrderedBy("SPREE_ORDERS_"+stockLocationId, "completed_at" , 5000);
        }
        return stockLocationOrdersCollection.map(convertOrderToDeliveryTime);
    };
    
    const getAllOrdersDeliveryTimes = async (limit = 0) => {
        const stockLocations = await firebaseResourceUtils(admin).getResourcesCollectionStockLocations();
        const stockLocationsIds = stockLocations.map(stockLocation => stockLocation.stockLocationId);
        const stockLocationsOrders = await Promise.all(stockLocationsIds.map(stockLocationId => getStoreOrdersDeliveryTimes(stockLocationId, limit)));
        return stockLocationsOrders.reduce((acc, orders) => acc.concat(orders), []);
    };

    const apiGetOrdersDeliveryTimes = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
        cors(req, res, async () => {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined
            const ordersDeliveryTimes = await getAllOrdersDeliveryTimes(limit);
            res.send(ordersDeliveryTimes);
        });
    });

    return {
        apiGetOrdersDeliveryTimes
    }

}