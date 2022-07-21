const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cabifyEstimates = require('./cabify')

admin.initializeApp();

exports.addCompletedOrder = functions.https.onRequest(async (request, response) => {
  const order = request.body;
  collectionKey = 'SPREE_ORDERS_' + order.shipment_stock_location_id;

  const credentialsRef = admin.firestore().collection(collectionKey).doc(order.number);
  
  await cabifyEstimates.setCabifyEstimates(order)
  
  credentialsRef.set(order);


  return response.send("ok");
});