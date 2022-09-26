const axios = require('axios')


const sendNoti = async (stock_location, number) => {
    await axios.post('https://us-central1-lomi-35ab6.cloudfunctions.net/sendFcmNotificationOnNewOrder', {
        stock_location: stock_location,
        number: number
    })

    return true
}

module.exports = sendNoti