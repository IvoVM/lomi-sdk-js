const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: 'AIzaSyD_YVEOH2VN42gPX4344yG8sOI6mJsiaIM', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

async function geocodeAddress(address){
  const geocode = await geocoder.geocode(address);
  return geocode
}

async function getOrderStops(order, forceRecalculate = false){
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

  if(order.stops && !forceRecalculate){
    return order.stops
  }
  const addressForGeocodingStart = order.shipment_stock_location_name  + ", " + order.shipment_stock_location_city + "," + order.ship_address_state + ", " +order.ship_address_country
  const endAddressForGeoCoding = order.ship_address_address1 + ", " + order.ship_address_county + ", " +order.ship_address_state + ", " +order.ship_address_country
  console.log(addressForGeocodingStart, endAddressForGeoCoding)
  const endAddressGeocode = await geocoder.geocode(endAddressForGeoCoding);
  const startAddressGeocode =  await(geocoder.geocode(addressForGeocodingStart))
  console.log("Formatted Address",startAddressGeocode, endAddressGeocode, order.shipment_stock_location_name)
  const stops = [
      {...stop},
      {...stop}
  ]
  try{
    stops[0].addr = order.shipment_stock_location_name
    stops[0].city = order.shipment_stock_location_city
    stops[0].loc = [startAddressGeocode[0].latitude, startAddressGeocode[0].longitude]
    stops[0].contact.name = "Tienda Lomi - "+ order.shipment_stock_location_name + order.shipment_stock_location_notes
    stops[0].contact.mobileCc = "+56"
    stops[0].contact.mobileNum = order.shipment_stock_location_phone.replace("+56", "")
    stops[0].instr = order.shipment_stock_location_notes
    
    stops[1].addr = order.ship_address_address1
    stops[1].city = order.ship_address_city
    stops[1].loc = [endAddressGeocode[0].latitude, endAddressGeocode[0].longitude]
    stops[1].contact.name = order.name
    stops[1].contact.mobileCc = "+56"
    stops[1].contact.mobileNum = order.ship_address_phone.replace("+56", "")
    stops[1].instr = order.ship_address_note
  } catch(e){
    console.log(e)
  }
  order.stops = stops
  return stops
}

module.exports = {
    getOrderStops,
    geocodeAddress
}