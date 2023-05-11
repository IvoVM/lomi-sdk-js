const firebaseUtils = require("../../utils/firebase/firebase");
const firebaseResourceUtils = require("../../utils/firebase/resources");
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '4GB'
  }
  

module.exports = (admin) => {

    const metrics = {

    }

    function detectVehicleType(journey){
        if(journey.cabifyLogisticsTrip){
            return journey.cabifyLogisticsTrip[0].product?.asset_kind
        } else if(journey.uberFourWheelsTrip){
            return "car"
        } else if(journey.uberTrip){
            return journey.uberTrip.courier?.vehicle_type || "2wheels"
        } else{
            return "notFound"
        }
    }

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

    const getOrderJourneys = async (order) => {
        const orderJourneys = await firebaseUtils(admin).getFirebaseCollection("SPREE_ORDERS_"+order.shipment_stock_location_id+"/"+order.number+"/journeys");
        return orderJourneys.map(journey => {
            return {
                ...journey,
                created_at: timestampToDate(journey.created_at) || null,
                updated_at: timestampToDate(journey.updated_at) || null
            }
        });
    };

    const countMetrics = (journey, distance) => {
        if(journey.cabifyLogisticsTrip && journey.providerId != 3){
            metrics.logisticWithoutProviderIdExample = journey
        }
        else if(journey.providerId == 3 && !journey.cabifyLogisticsTrip){
            console.log("No cabifyLogisticsTrip", journey)
        }
        else if(journey.providerId == 3 && journey.cabifyLogisticsTrip[0].product?.asset_kind?.includes('car')){
            if(distance < 3000){
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].cars["0KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].cars["0KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].cars["0KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].cars["0KM"].other++
                }
            } else if(distance < 6000){
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].cars["3KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].cars["3KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].cars["3KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].cars["3KM"].other++
                }
            } else {
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].cars["6KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].cars["6KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].cars["6KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].cars["6KM"].other++
                }
            }
        } else if(journey.providerId == 3 && journey.cabifyLogisticsTrip) {
            if(distance < 2000){
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].bikes["0KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].bikes["0KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].bikes["0KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].bikes["0KM"].other++
                }
            } else if(distance < 4000){
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].bikes["2KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].bikes["2KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].bikes["2KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].bikes["2KM"].other++
                }
            } else {
                if(journey.status == "delivered"){
                    metrics[journey.stock_location_id].bikes["4KM"].delivered++
                } else if (journey.status == "returned"){
                    metrics[journey.stock_location_id].bikes["4KM"].returned++
                } else if (journey.status == "canceled"){
                    metrics[journey.stock_location_id].bikes["4KM"].canceled++
                } else {
                    metrics[journey.stock_location_id].bikes["4KM"].other++
                }
            }
        }
    }
    
    const getStoreOrdersDeliveryTimes = async (stockLocationId, limit = 0) => {
        let stockLocationOrdersCollection
        if(limit){
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollectionOrderedBy("SPREE_ORDERS_"+stockLocationId, "completed_at", limit);
        } else {
            stockLocationOrdersCollection = await firebaseUtils(admin).getFirebaseCollectionOrderedBy("SPREE_ORDERS_"+stockLocationId, "completed_at" , 10000);
        }
        const ordersWithJourneysPromise = stockLocationOrdersCollection.map(order => {
            return new Promise(async (resolve, reject) => {
                try {
                    const journeys = await getOrderJourneys(order);
                    if(!order.stops || !order.stops.length){
                        console.log(order.number, "no stops")
                        
                        resolve({
                            id: order.id,
                            number: order.number,
                            fromCoords: null,
                            fromAddress: null,
                            toCoords: null,
                            toAddress: null,
                            journeys: [],
                            distance: null,
                            stockLocationId: order.shipment_stock_location_id,
                            stockLocationName: order.shipment_stock_location_name,
                        })
                        return
                    }
                    const distance = getDistanceFromLatLonInMeters(order.stops[0].loc[0], order.stops[0].loc[1], order.stops[1].loc[0], order.stops[1].loc[1]) * 1.15
                    resolve({
                        id: order.id,
                        number: order.number,
                        fromCoords: order.stops[0].loc,
                        fromAddress: order.stops[0].addr,
                        toCoords: order.stops[1].loc,
                        toAddress: order.stops[1].addr,
                        distance,
                        stockLocationId: order.shipment_stock_location_id,
                        journeys: journeys.map(journey => {
                            return {
                                providerId: journey.providerId,
                                vehicleType: detectVehicleType(journey),
                                status: journey.status,
                            }
                        })
                    })
                } catch (error) {
                    console.log(error, "error")
                }
            })
        });
        const orders = await Promise.all(ordersWithJourneysPromise)
        console.log(orders)
        return orders
    };
    
    const getAllOrdersDeliveryTimes = async (limit = 0) => {
        const stockLocations = await firebaseResourceUtils(admin).getResourcesCollectionStockLocations();
        const stockLocationsIds = stockLocations.map(stockLocation => stockLocation.stockLocationId);
        const stockLocationsOrders = await Promise.all(stockLocationsIds.map(stockLocationId => getStoreOrdersDeliveryTimes(stockLocationId, limit)));
        return stockLocationsOrders.reduce((acc, orders) => acc.concat(orders), []);
    };

    const apiGetOrdersDistance = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
        cors(req, res, async () => {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined
            const ordersDeliveryTimes = await getAllOrdersDeliveryTimes(limit);
            res.send(ordersDeliveryTimes);
        });
    });

    return {
        apiGetOrdersDistance
    }

}