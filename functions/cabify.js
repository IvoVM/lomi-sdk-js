
const axios = require('axios')

let accessToken = ""

async function setCabifyEstimates(order){
    try{
        await authCabify()
        order.cabifyEstimated = await estimateCabify(order)
        return order.cabifyEstimated
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
    estimateQuery.variables.estimateInput.stops = order.stops

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