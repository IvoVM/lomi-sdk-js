const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  apiKey: 'AIzaSyD_YVEOH2VN42gPX4344yG8sOI6mJsiaIM', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

const axios = require('axios')

let accessToken = ""

async function setCabifyEstimates(order){
    try{
        await authCabify()
        order.cabifyEstimates = await estimateCabify(order)
    } catch(e){
        return null
    }
}

async function authCabify(){
    const auth = await axios.post("https://cabify.com/auth/api/authorization",{
        "grant_type" : "client_credentials",
        "client_id": "0d8b6b066ded47d1acfa25eb2aa7606d",
        "client_secret": "GPElTQmyfrYa-qU9"
    })
    accessToken = auth.data.access_token
    return auth
}

async function estimateCabify(order){
    const endAddressGeocode = await geocoder.geocode(order.ship_address_address1 + ", " + order.ship_address_city, ", " +order.ship_address_country);
    const startAddressGeocode =  await(geocoder.geocode(order.shipment_stock_location_name))
    console.log(startAddressGeocode, order.shipment_stock_location_name)
    const stops = [
        {...stop},
        {...stop}
    ]
    stops[0].loc = order.shipment_stock_location_name.includes("Sewell") ? [-34.1741044,-70.689768] : [startAddressGeocode[0].latitude, startAddressGeocode[0].longitude]
    stops[1].loc = [endAddressGeocode[0].latitude, endAddressGeocode[0].longitude]
    
    estimateQuery.variables.estimateInput.stops = stops

    const shipEstimate = await axios.post(
    "https://cabify.com/api/v3/graphql",
    estimateQuery,
    {
        headers:{
            'Authorization' : 'Bearer ' + accessToken
        }  
    })
    return shipEstimate.data.data.estimates
}

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

const estimateQuery = { 
    "query": `query EstimatesQuery($estimateInput: EstimatesInput){
  estimates(estimateInput: $estimateInput) {
    eta {
      formatted,
      min,
      max,
      lowAvailability
    }
    total {
      amount
      currency
    }
    priceBase {
      amount
      currency
    }
    supplements {
      description
      kind
      name
      payToDriver
      price {
        amount,
        currency,
        currencySymbol
      }
      taxCode
    }
    product {
      id
      icon
      name {
        es
      }
      description {
        es
      }
    }
    distance
    duration
    route
  }
}`,
"variables":{
  "estimateInput":{
    "startType":"ASAP",
    "requesterId":"c2160c85550492493b1dbd0da7eceea0",
    "startAt":null,
    "stops": '+locations+'
  }
},
"operationName":"EstimatesQuery"
}

module.exports = {
    setCabifyEstimates
}