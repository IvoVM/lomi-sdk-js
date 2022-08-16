const axios = require('axios')

class UberDispatcher{
    constructor(clientId, clientSecret, customerId){
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.customerId = customerId
    }

    async auth(){
        const authResponse = await axios.post("https://login.uber.com/oauth/v2/token","grant_type=client_credentials&client_id="+this.clientId+"&client_secret="+this.clientSecret+"&scope=eats.deliveries")
        this.accessToken = authResponse
        return this.accessToken
    }

    async getTrip(trip_id){
        const tripResponse = await axios.get("https://api.uber.com/v1/customers/"+this.customerId+"/deliveries/"+trip_id,{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token
            }
        })
        return tripResponse.data
    }

    async createQuote(dropoff_address, pickup_address){
        const quote = await axios.post("https://api.uber.com/v1/customers/"+this.customerId+"/delivery_quotes",{
            dropoff_address: dropoff_address,
            pickup_address: pickup_address
        },{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token
            }
        })
        return quote.data
    }

    async createTrip(dropoff_address, dropoff_name, dropoff_phone_number, pickup_address, pickup_name, pickup_phone_number, manifest_items){
        console.log(dropoff_address, dropoff_name, dropoff_phone_number, pickup_address, pickup_name, pickup_phone_number, manifest_items)
        const trip = await axios.post("https://api.uber.com/v1/customers/"+this.customerId+"/deliveries",{
            "dropoff_address": dropoff_address,
            "dropoff_name": dropoff_name,
            "dropoff_phone_number": dropoff_phone_number,
            "pickup_address": pickup_address,
            "pickup_name": pickup_name,
            "pickup_phone_number": pickup_phone_number,
            "manifest_items": manifest_items
        },{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token,
                "Content-Type": "application / json",
            }
        })
        return trip.data
    }

   
}

const uberDispatcher = new UberDispatcher("knJa-FrOl2QHzkcnoG3gnWsj0VqXbVme","uze9hsr1-89pgi-7zRohC0f3RIJDBReMtI5caWJn", "ba030355-7cc4-4922-98a1-0c706aced46e")
module.exports = uberDispatcher
