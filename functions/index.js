const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios')

const token = "token=3b81ec96cf9bc8e464c33a991e6fe5eca4e34214bc0020ba"

const ordersEndpoint = "https://lomi.cl/api/orders?"+token+"&q[state_cont]=complete&q[s]=id%20desc&per_page=100"
const orderEndpoint = "https://lomi.cl/api/orders/"
const HmxEndpoint = "https://api.hermex.delivery/orders/"
admin.initializeApp(functions.config().firebase);

async function getOrders(){
    const res = await axios.get(ordersEndpoint)
    const promises = res.data.orders.map(async (order)=>{
        const orderRes = await axios.get(orderEndpoint+order.order.number+"?"+token)
        const hmxData = await axios.get(HmxEndpoint+order.order.number)
        if(hmxData.data.data){
            orderRes.data.hermexOrder = hmxData.data.data
            console.log(orderRes.data.number)
        }
        const ref = admin.database().ref("orders/"+order.order.id).set(orderRes.data);
        return orderRes
    })
    await Promise.all(promises)
}

exports.scheduledFunction = functions.pubsub.schedule('every minute').onRun(async (context) => {
    await getOrders()
    return null;
  });