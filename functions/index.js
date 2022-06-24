const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios')

const ordersEndpoint = "https://lomi.cl/api/orders?token=3b81ec96cf9bc8e464c33a991e6fe5eca4e34214bc0020ba&q[state_cont]=complete&q[s]=id%20desc&per_page=1000"
admin.initializeApp(functions.config().firebase);

function getOrders(){
    const res = axios.get(ordersEndpoint)
    res.then((res)=>{
        var ref = admin.database().ref("orders").set({
            "orders": res.data.orders
        });
        console.log(res.data.orders)
    })
}

exports.scheduledFunction = functions.pubsub.schedule('every minute').onRun(async (context) => {
    getOrders();;
    

    return null;
  });