const axios = require('axios')

const HMXURL = "https://api.hermex.delivery"

async function placeOrder(order){


    const hmxOrderPayload = {
        customer: {
            name: order.name,
            email: order.email,
            phone: order.ship_address_phone,
            address1: order.ship_address_address1,
            address2: order.ship_address_address2,
            city: order.ship_address_city,
            state: order.ship_address_state,
            country: order.ship_address_country,
        },
        orderId: order.number,
        store:{
            address1: order.shipment_stock_location_address1,
            id: order.shipment_stock_location_id,
            phone: order.shipment_stock_location_phone,
        }
    }

    const orderPlaceResponse = await axios.post(HMXURL+"/placeOrder", hmxOrderPayload)
    return orderPlaceResponse
}

async function getOrderStatus(orderId){
    const orderStatusResponse = await axios.get(HMXURL+"/orders/"+orderId)
    return orderStatusResponse
}

async function cancelTrip(orderId){
    const changeStatusPayload = {
        statusId: 9,
    }

    const orderStatusChangeResponse = await axios.post(HMXURL+"/order/"+orderId+"/changeStatus", changeStatusPayload)
    return orderStatusChangeResponse
}

module.exports = {
    placeOrder,
    getOrderStatus,
    cancelTrip
}