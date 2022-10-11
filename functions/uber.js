const axios = require('axios')

function encode(data) {
    let str = "";
    str += data.street_address[0]+" "+data.street_address[1];
    str+= ", " + data.city 
    str+= ", " + data.state 
    str+= ", " + data.zip_code
    return str
}

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
        console.log(trip_id, this.accessToken.data.access_token, this.customerId)
        const tripResponse = await axios.get("https://api.uber.com/v1/customers/"+this.customerId+"/deliveries/"+trip_id,{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token
            }
        })
        if(tripResponse && tripResponse.data){
            return tripResponse.data
        } else {
            return null
        }
    }

    async cancelTrip(delivery_id){
        console.log(this.customerId,delivery_id, this.accessToken.data.access_token)
        const cancel = await axios.post("https://api.uber.com/v1/customers/"+this.customerId+"/deliveries/"+delivery_id+"/cancel",{
            "delivery_id": delivery_id,
            "customer_id": this.customerId
        } ,{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token
            }
        })
        return cancel.data
    }

    async createQuote(dropoff_address, pickup_address,order){
        const quote = await axios.post("https://api.uber.com/v1/customers/"+this.customerId+"/delivery_quotes",{
            dropoff_address: encode({
                street_address: [order.ship_address_address1,order.ship_address_address2],
                city: order.ship_address_city,
                state: order.ship_address_state,
                zip_code: "",
                country: order.ship_address_country,
            }),
            dropoff_latitude: parseFloat(dropoff_address.split(",")[0]),
            dropoff_longitude: parseFloat(dropoff_address.split(",")[1]),
            pickup_latitude: parseFloat(pickup_address.split(",")[0]),
            pickup_longitude: parseFloat(pickup_address.split(",")[1]),
            pickup_address: order.shipment_stock_location_name,
        },{
            headers:{
                'Authorization' : 'Bearer ' + this.accessToken.data.access_token
            }
        })
        return quote.data
    }

    async createTrip(dropoff_address, dropoff_name, dropoff_phone_number, pickup_address, pickup_name, pickup_phone_number, manifest_items, order){
        console.log({
            dropoff_address: encode({
                street_address: [order.ship_address_address1,order.ship_address_address2],
                city: order.ship_address_city,
                state: order.ship_address_state,
                zip_code: "",
                country: order.ship_address_country,
            }),
            dropoff_latitude: parseFloat(dropoff_address.split(",")[0]),
            dropoff_longitude: parseFloat(dropoff_address.split(",")[1]),
            dropoff_notes: "",
            dropoff_name: order.name,  
            dropoff_phone_number: dropoff_phone_number,
            dropoff_verification: {
                picture: true,
                signature: false
            },
            pickup_address: order.shipment_stock_location_name,   
            pickup_latitude: parseFloat(pickup_address.split(",")[0]),
            pickup_longitude: parseFloat(pickup_address.split(",")[1]),
            pickup_name: order.shipment_stock_location_name.split("-")[1],
            pickup_phone_number: pickup_phone_number,
            pickup_notes: "",
            pickup_verification: {
                picture: false,
                signature: false,
            },
            manifest_items: manifest_items,
            manifest_reference: order.number,
            manifest_total_value: parseInt(order.total) - parseInt(order.shipment_total),
            undeliverable_action: "return",
        })
        const trip = await axios.post("https://api.uber.com/v1/customers/"+this.customerId+"/deliveries",{
            dropoff_address: encode({
                street_address: [order.ship_address_address1,order.ship_address_address2],
                city: order.ship_address_city,
                state: order.ship_address_state,
                zip_code: "",
                country: order.ship_address_country,
            }),
            dropoff_latitude: parseFloat(dropoff_address.split(",")[0]),
            dropoff_longitude: parseFloat(dropoff_address.split(",")[1]),
            dropoff_notes: order.special_instructions ? order.special_instructions : '',
            dropoff_name: order.name,
            dropoff_phone_number: dropoff_phone_number,
            dropoff_verification: {
                picture: true,
                signature: false
            },
            pickup_address: order.shipment_stock_location_name,   
            pickup_latitude: parseFloat(pickup_address.split(",")[0]),
            pickup_longitude: parseFloat(pickup_address.split(",")[1]),
            pickup_name: 'Tienda LOMI' + order.shipment_stock_location_name.split("-")[1],
            pickup_phone_number: pickup_phone_number,
            pickup_notes: order.store_notes,
            pickup_verification: {
                picture: false,
                signature: false,
            },
            manifest_items: manifest_items.map(item => ({...item, price: parseInt(item.price)})),
            manifest_reference: order.number,
            manifest_total_value: parseInt(order.total) - parseInt(order.shipment_total),
            undeliverable_action: "return",
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
//const uberDispatcher = new UberDispatcher("ydQvqFF87tXeoLqlzGeFCT5LDLLzXrKl","M8AEI2Qf023-NlvXDIaZu6PUZTBRoS95c8Atdm1N", "ba030355-7cc4-4922-98a1-0c706aced46e")
module.exports = uberDispatcher
