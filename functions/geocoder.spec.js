const geocoder = require('./geocoder')
const order = require('./utils/mocks/order')

it('It should geocode', async() => {
    const geocode = await geocoder.geocodeAddress("Avenida Vicuña Mackenna Poniente 6690, La Florida")
    console.log(geocode)
})

it('It should get order stops', async ()=>{
    const newOrder = geocoder.getOrderStops(order,true)
})