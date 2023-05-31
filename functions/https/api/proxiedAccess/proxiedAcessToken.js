const getAccessTokenProxied = require('./signWithProxy');
const functions = require('firebase-functions');
const weakPassword = "lomi123123@161803"
const cors = require('cors')({ origin: true });

const getAccessTokenProxiedApi = functions.https.onRequest((req, res, next) => {
    cors(req, res, async () => {
        const accessTokenHeader = req.headers.authorization?.replace("Bearer ", "")
        if(accessTokenHeader !== weakPassword){
            res.status(401).send({ message: 'Unauthorized by auth: ' + accessTokenHeader });
            return
        }
        const { email, password } = req.body;
        const accessToken = await getAccessTokenProxied(email, password);
        res.send({ accessToken });
    })
});

module.exports = getAccessTokenProxiedApi;