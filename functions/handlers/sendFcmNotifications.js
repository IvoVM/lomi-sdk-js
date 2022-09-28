const axios = require('axios')


const sendNoti = async (stock_location, number, stock_location_id) => {
    await axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/sendFcmNotificationOnNewOrder', {
        stock_location: stock_location,
        number: number,
        stock_location_id: stock_location_id
    })

    return true
}

module.exports = sendNoti