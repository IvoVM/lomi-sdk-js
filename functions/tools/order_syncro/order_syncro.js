
const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
SpreeApi = require('../../utils/spree/spree.js')(spreeUrl, token, spreeDebugUrl)

function checkIfOrderIsReady(order){
    console.log(order.number, order.state)
    if(order.state == 'complete'){
        return true
    } else {
        return false
    }
}

const getSpreeLastOrders = SpreeApi.getOrders().then((spreeLastOrders)=>{
    spreeLastOrders.orders.forEach((spreeOrder)=>{
        checkIfOrderIsReady(spreeOrder.order)
    })    
})


