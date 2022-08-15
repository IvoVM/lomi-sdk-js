const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cabifyEstimates = require('./cabify')
const uberDispatcher = require('./uber');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.addCompletedOrder = functions.https.onRequest(async (request, response) => {
  const order = request.body;
  collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;

  const credentialsRef = admin.firestore().collection(collectionKey).doc(order.number);  
  credentialsRef.set(order);


  return response.send("ok");
});

exports.evaluateCabify = functions.https.onRequest(async (request, response)=>{
  cors(request,response, async ()=>{
      const order = request.body
      const cabifyEstimated = await cabifyEstimates.setCabifyEstimates(order)
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin.firestore().doc(collectionKey+"/"+order.number).update({
          cabifyEstimated
      });
      return response.status(200).send(cabifyEstimated)
    })
}) 

exports.evaluateUber = functions.https.onRequest(async (request, response)=>{
  cors(request,response, async ()=>{
      const order = request.body
      await uberDispatcher.auth()
      const uberEstimated = await uberDispatcher.createQuote(order.ship_address_address1 + ", " + order.ship_address_city + ", " +order.ship_address_country, order.shipment_stock_location_name)
      collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;
      const ref = await admin.firestore().doc(collectionKey+"/"+order.number).update({
          uberEstimated
      });
      return response.status(200).send(uberEstimated)
    })
})