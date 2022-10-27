
const axios = require('axios')

let accessToken = ""
let clientId = "0d8b6b066ded47d1acfa25eb2aa7606d"
let requesterId = "c2160c85550492493b1dbd0da7eceea0"

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
        "client_id": clientId,
        "client_secret": "GPElTQmyfrYa-qU9"
    })
    accessToken = auth.data.access_token
    return auth
}

async function estimateCabify(order){
    console.log(accessToken)
    estimateQuery.variables.estimateInput.stops = [...order.stops].reverse()
    estimateQuery.variables.estimateInput.requesterId = requesterId
    const shipEstimate = await axios.post(
    "https://cabify.com/api/v3/graphql",
    estimateQuery,
    {
        headers:{
            'Authorization' : 'Bearer ' + accessToken
        }  
    })
    if(shipEstimate.data.errors){
      console.log(shipEstimate.data.errors[0])
      console.log(estimateQuery)
    }
    return shipEstimate.data
}

async function createCabifyTrip(order, productId){
  createJourneyMutation.variables.bookingInput = {
    "stops": [order.stops[1], order.stops[0]],
    "rider": {
      "id": requesterId,
      "email": order.email,
      "name": order.name,
      "locale":"es-CL",
      "mobile": {
        "mobileCc": "+56",
        "mobileNum": order.shipment_stock_location_phone
      }
    },
    "requesterId": requesterId,
    "productId": productId
  }

  try{
    const createTrip = await axios.post(
      "https://cabify.com/api/v3/graphql",
      createJourneyMutation,
      {
          headers:{
              'Authorization' : 'Bearer ' + accessToken
          }
        })
      console.log(createTrip.data)
      return createTrip   
  } catch(e){
    console.log(e)
    return e.response
  }
}

async function getCabifyTrip(tripId){
    getJourneyQuery.variables.id = tripId
  try{
    const getTrip = await axios.post(
      "https://cabify.com/api/v3/graphql",
      getJourneyQuery,
      {
        headers:{
          'Authorization' : 'Bearer ' + accessToken
        }
      })
      return getTrip.data
  } catch(e){
    console.log(e, e.response)
    return e.response
  }
}

async function cancelCabifyTrip(tripId){
    cancelJourneyMutation.variables.journeyId = tripId
    cancelJourneyMutation.variables.requesterId = requesterId

    const cancelTrip = await axios.post(
    "https://cabify.com/api/v3/graphql",
    cancelJourneyMutation,
    {
        headers:{
            'Authorization' : 'Bearer ' + accessToken
        }
    })
    return cancelTrip.data
}

const cancelJourneyMutation = {
    "query": `mutation riderCancel ($journeyId: String!, $requesterId: String) {
      riderCancel (journeyId: $journeyId, requesterId: $requesterId) {
          driver {
              avatarUrl
              id
              name
              phoneNumber
          }
          journeyId
          loc
          name
          vehicle {
              color
              name
              plate
          }
          waypoints {
              rows {
                  loc
                  stateName
              }
              total
          }
      }
  }`,
    "variables": {
        "journeyId": "",
        "requesterId": ""
    }
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
    "requesterId": requesterId,
    "startAt":null,
    "stops": '+locations+'
  }
},
"operationName":"EstimatesQuery"
}

const createJourneyMutation = {
  "query" : `mutation createJourney ($bookingInput: BookingInput) {
    createJourney (bookingInput: $bookingInput) {
        id
        rider {
            email
            id
            locale
            mobile
            mobileCc
            mobileNum
            name
            surname
        }
        startAt
        startType
        stops {
            addr
            city
            contact {
                mobileCc
                mobileNum
                name
            }
            country
            hitAt
            instr
            loc
            name
            num
            private
        }
    }
}`,
"operationName":"createJourney",
"variables":{
  "bookingInput": {
    "labelSlug": "lomi",
    "stops": '+locations+',
    "requesterId": requesterId
  }
}
}

const getJourneyQuery = {
  "query" : `query journey ($id: String) {
    journey (id: $id) {
        createdAt
        endAt
        endState
        id
        labelSlug
        pricesSummary {
            currency
            discount {
                amount
                currency
            }
            discountFormatted
            price {
                amount
                currency
            }
            priceBase {
                amount
                currency
            }
            priceFormatted
            priceTotal {
                amount
                currency
            }
            priceTotalFormatted
        }
        productId
        publicUrl
        regionId
        rider {
            email
            id
            locale
            mobile
            mobileCc
            mobileNum
            name
            surname
        }
        sales {
            code
            currency
            invoiceDate
            priceDetails {
                discount
                taxRate
                taxType
                total
            }
        }
        startAt
        startType
        state {
            driver {
                avatarUrl
                id
                name
                phoneNumber
            }
            journeyId
            loc
            name
            vehicle {
                color
                name
                plate
            }
            waypoints {
                rows {
                    loc
                    stateName
                }
                total
            }
        }
        stops {
            addr
            city
            contact {
                mobileCc
                mobileNum
                name
            }
            country
            hitAt
            instr
            loc
            name
            num
            private
        }
        userId
    }
}`,
"operationName":"journey",
variables:{
  "id": ""
}
}

module.exports = {
    authCabify,
    estimateCabify,
    setCabifyEstimates,
    createCabifyTrip,
    getCabifyTrip,
    cancelCabifyTrip
}