const functions = require("firebase-functions");
const ordersEndpoint = "https://lomi.cl/api/orders?token=3b81ec96cf9bc8e464c33a991e6fe5eca4e34214bc0020ba&per_page=100"
const axios = require('axios')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const res = axios.get(ordersEndpoint)
res.then((res)=>{
    console.log(res.data.orders)
})

exports.scheduledFunction = functions.pubsub.schedule('every minute').onRun(async (context) => {
    
    return null;
  });