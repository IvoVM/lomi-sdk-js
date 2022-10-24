const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: 'AIzaSyD_YVEOH2VN42gPX4344yG8sOI6mJsiaIM', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

async function getOrderStops(order){
  const stop = {
    "addr": "",
    "city": "",
    "contact": {
        "mobileCc": "",
        "mobileNum": "",
        "name": ""
    },
    "country": "Chile",
    "loc": [
        -33.532699,-70.5859263
    ],
    "name": "",
    "num": ""
  }

  if(order.stops){
    return order.stops
  }
  const endAddressGeocode = await geocoder.geocode(order.ship_address_address1 + ", " + order.ship_address_city, ", " +order.ship_address_country);
  const startAddressGeocode =  await(geocoder.geocode(order.shipment_stock_location_name  + ", " + order.ship_address_city, ", " +order.ship_address_country))
  console.log(startAddressGeocode, order.shipment_stock_location_name)
  const stops = [
      {...stop},
      {...stop}
  ]
  //stops[0].loc = order.shipment_stock_location_name.includes("Sewell") ? [-34.1741044,-70.689768] : [startAddressGeocode[0].latitude, startAddressGeocode[0].longitude]
  stops[1].loc = [endAddressGeocode[0].latitude, endAddressGeocode[0].longitude]
  order.stops = stops
  return stops
}

module.exports = {
    getOrderStops
}