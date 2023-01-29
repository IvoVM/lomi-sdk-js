const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const { default: axios } = require('axios');

module.exports = (admin) => {
    
    async function reverseGeocoding(req, res, next){
        cors(req, res, async () => {
            const { lat, lng } = req.body;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const response = await axios.get(url);
            console.log(response.data)
            const address = response.data.results[0].formatted_address;
            res.send({address: address});
        })
    }

    return {
        reverseGeocoding : functions.https.onRequest(reverseGeocoding)
    }
}