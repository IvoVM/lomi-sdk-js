
const axios = require('axios')

let accessToken = ""
let clientId = "0d8b6b066ded47d1acfa25eb2aa7606d"
let requesterId = "c2160c85550492493b1dbd0da7eceea0"

const DebugCabify = "https://logistics.api.cabify-sandbox.com/"
const ProductionCabify = "https://logistics.api.cabify.com/"

const normalizePhone = require('./utils/functions').normalizePhone

async function catchCabifyError(error){
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    return error.response
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
    return error.request
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    return error.message
  }
  console.log(error.config);ß
}

async function setCabifyEstimates(order){
    try{
        await authCabify()
        order.cabifyEstimated = await estimateCabify(order)
        return order.cabifyEstimated
    } catch(e){
        return null
    }
}

async function subscriptionCabify(order){
  const subcription = await axios.post("https://cabify.com/api/v3/graphql",{
    "query": "subscription($requesterId: String!) {\n  riderSubscribe(requesterId: $requesterId) {\n    id\n    __typename\n  }\n}\n",
    "variables": {
      "requesterId": requesterId
    }
  },{
    headers:{
      'Authorization' : 'Bearer ' + accessToken
    }
  }) 
}

async function getUser(email){
  getUserQuery.variables.email = email
  const user = await axios.post("https://cabify.com/api/v3/graphql",getUserQuery,{
    headers:{
      'Authorization' : 'Bearer ' + accessToken
    }
  }) 
  return user.data
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

async function estimateCabifyGraphQlStrategy(order){
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

async function getLogisticsOrderInfo(order){
  try{
    await authCabify()
    const trip = await getLogisticsOrderInfoStrategy(order)
    return trip
  } catch(e){
    return null
  }
}

async function createCabifyTrip(order, productId = null){
    try{
        await authCabify()
        const trip = await createCabifyTripLogisticsStrategy(order, "cabify")
        return trip
    } catch(e){
        return null
    }
}

async function deleteParcel(parcel_id){
  const deleteParcel = await axios.post(
    ProductionCabify+"v1/parcels/delete",
    {
      "parcel_ids": [parcel_id]
    },
  {
    headers:{
      "Authorization" : "Bearer " + accessToken,
    }
  }
  ).catch(catchCabifyError)
  return deleteParcel
}

async function fetchUsers(){
  const users = await axios.get(
    ProductionCabify+"v1/users",
  {
    headers:{
      'Authorization' : 'Bearer ' + accessToken
    }
  }).catch(catchCabifyError)
  return users
}

async function createCabifyTripLogisticsStrategy(order){
  const trip = await axios.post(
    ProductionCabify+"v1/parcels/deliver",
  {
    "requester_id": order.cabify_requester_id,
    "parcel_ids": order.cabifyEstimated.parcel_ids,
    "optimize": true,
  },
  {
    headers:{
      'Authorization' : 'Bearer ' + accessToken
    }
  }).catch(catchCabifyError)
  return trip
}

async function estimateCabify(order){
    try{
        const shipEstimate = estimateCabifyTripLogisticsStrategy(order)
        return shipEstimate
    } catch(e){
        return null
    }
}

async function estimateCabifyTripLogisticsStrategy(order){
  console.log(order.cabifyEstimated, "cabifyEstimated")
  if(order.cabifyEstimated?.parcel_ids){
    console.log("Updating old parcel", order.cabifyEstimated.parcel_ids[0])
    const updatedParcel = await updateParcel(order)
    console.log("Updated", updatedParcel)
    if(updatedParcel.parcels){
      order.parcel_ids = updatedParcel.parcels.map((parcel) => (parcel.id))
    }
  }

  console.log("Creating new parcel")
  const createParcelResponse = await createParcel(order)
  console.log("Created new parcel", createParcelResponse)

  if(createParcelResponse.parcels){
    order.parcel_ids = createParcelResponse.parcels.map((parcel) => (parcel.id))
  }
  const estimateTrip = await estimateCabifyTripLogistics(order.parcel_ids)
  return { ...estimateTrip, parcel_ids: order.parcel_ids }
}

async function estimateCabifyTripLogistics(parcel_ids){
  const estimateTrip = await axios.post(
    ProductionCabify+"v1/parcels/estimate",
    {
      "parcel_ids": parcel_ids
    },{
      headers:{
          'Authorization' : 'Bearer ' + accessToken
      }
    }).catch(catchCabifyError)
    return estimateTrip.data
}

async function updateParcel(order){
  console.log("Updating parcel", accessToken, order.number, order.cabifyEstimated.parcel_ids[0])
  const updatedParcel = await axios.put(
    ProductionCabify+"v1/parcels/"+order.cabifyEstimated.parcel_ids[0],
    {
      "external_id": order.number,
      "pickup_info": {
       "addr": order.shipment_stock_location_name,
       "contact": {
        "name": order.shipment_stock_location_uber_name,
        "phone": normalizePhone(order.shipment_stock_location_phone)
       },
       "instr": order.shipment_stock_location_note,
       "loc": {
        "lat": order.stops[0].loc[0],
        "lon": order.stops[0].loc[1]
       }
      },
      "dropoff_info": {
       "addr": order.ship_address_address1,
       "contact": {
        "name": order.name,
        "phone": normalizePhone(order.ship_address_phone)
       },
       "instr": order.ship_address_note,
       "loc": {
        "lat": order.stops[1].loc[0],
        "lon": order.stops[1].loc[1]
       }
      },
      "dimensions": {
       "height": 10,
       "length": 10,
       "width": 10,
       "unit": "cm"
      },
      "weight": {
       "value": 1500,
       "unit": "g"
      }
     },
  {
    headers:{
      "Authorization" : "Bearer " + accessToken,
    }
  }).catch(catchCabifyError)
  return updatedParcel.data
}

async function createParcel(order){
  console.log("Creating parcel", accessToken, order.number)
  const parcel = await axios.post(
    ProductionCabify+"v1/parcels",
    {
      "parcels": [
       {
        "external_id": order.number,
        "pickup_info": {
         "addr": order.shipment_stock_location_name,
         "contact": {
          "name": order.shipment_stock_location_uber_name,
          "phone": normalizePhone(order.shipment_stock_location_phone)
         },
         "instr": order.shipment_stock_location_note,
         "loc": {
          "lat": order.stops[0].loc[0],
          "lon": order.stops[0].loc[1]
         }
        },
        "dropoff_info": {
         "addr": order.ship_address_address1,
         "contact": {
          "name": order.name,
          "phone": normalizePhone(order.ship_address_phone)
         },
         "instr": order.ship_address_note,
         "loc": {
          "lat": order.stops[1].loc[0],
          "lon": order.stops[1].loc[1]
         }
        },
        "dimensions": {
         "height": 10,
         "length": 10,
         "width": 10,
         "unit": "cm"
        },
        "weight": {
         "value": 1500,
         "unit": "g"
        }
       },
      ]
     },
     {
      headers:{
          'Authorization' : 'Bearer ' + accessToken
      }
    }).catch(catchCabifyError)
     return parcel.data
}

async function createCabifyTripGraphQlStrategy(order, productId){
  createJourneyMutation.variables.bookingInput = {
    "stops": [order.stops[1], order.stops[0]],
    "rider": {
      "id": requesterId,
      "email": order.email,
      "name": order.name,
      "locale":"es-CL",
      "mobile": {
        "mobileCc": "+56",
        "mobileNum": order.ship_address_phone.replace("+56","")
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
    try{
        const cancelTrip = await cancelCabifyTripLogisticsStrategy(tripId)
        return cancelTrip
    } catch(e){
        console.log(e)
        return e.response
    }
}

async function cancelCabifyTripLogisticsStrategy(parcelIds){
  console.log("Canceling, ",parcelIds)
  const cancelTrip = await axios.delete(
    ProductionCabify+"v1/parcels/deliver/cancel",
    {
      "parcel_ids": [parcelIds]
    },
    {
      headers:{
        "Authorization" : "Bearer " + accessToken
      }
    }
  ).catch(catchCabifyError)
  }

async function cancelCabifyTripGraphQlStrategy(tripId){
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

const getUserQuery = {
  "query": `query user ($email: String, $id: String) {
    user (email: $email, id: $id) {
        canManage
        canOrderForOthers
        defaultChargeCode
        disabled
        email
        emailCc
        employeeCode
        id
        locale
        mobileCc
        mobileNum
        name
        surname
    }
}`,
"operationName":"user",
"variables":{
  "email": ""
}
}

module.exports = {
    authCabify,
    estimateCabify,
    setCabifyEstimates,
    createCabifyTrip,
    getCabifyTrip,
    getUser,
    cancelCabifyTrip,
    deleteParcel
}