const geocoder = require('./geocoder')

test('It should geocode', async() => {
    const geocode = await geocoder.geocodeAddress("Avenida Vicuña Mackenna Poniente 6690, La Florida")
    console.log(geocode)
})