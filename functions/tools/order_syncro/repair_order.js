const axios = require('axios');
const mapOrder = require('./utils.js');

const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';
SpreeApi = require('../../utils/spree/spree.js')(spreeUrl, token, spreeDebugUrl)

const repairOrder = (orderNumber) => {
    SpreeApi.getOrder(orderNumber).then((spreeOrder)=>{
        console.log(spreeOrder.shipments)        
        console.log(mapOrder(spreeOrder, 46))
        axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/addCompletedOrder', mapOrder(spreeOrder, 46)).then((res)=>{
            console.log(res.data)
        })
    })
}

repairOrder("R851146633")