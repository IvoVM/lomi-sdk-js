const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const states = require('../../utils/mocks/states.js')()

module.exports = (admin) => {

    function selectOrderStatusBasedOnState(state){
        if(state == 'returned' || state == 'incident' || state == 'pickupfailed' || state == 'internalcanceled' || state == 'requestercancel'){
            return 7
        } else if(state == 'qualifiedforpickup' || state == 'onroutetopickup' || state == 'pickingup'){
            return 4
        } else if(state == 'intransit' || state == 'delivering'){
            return 5
        } else if( state == 'delivered'){
            return 6
        }
    }

    function updateOrderDocumentStatus(state, journey){
        const status = selectOrderStatusBasedOnState(state)
        if(status){
            return admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber).update({
                status: status
            })
        } else {
            return Promise.resolve()
        }
    }

    const listenToCabifyStatusWebHook = functions.https.onRequest(async (req, res) => {
        cors(req,res,async () => {
            const statusJson = req.body;
            const db = admin.firestore();
            const journeyDoc = admin.firestore().doc("deliveringJourneys/" + req.body.id)
            const journeyDocData = await journeyDoc.get()
            let journey;
            if(journeyDocData.exists){
                journey = journeyDocData.data()
            } else {
                console.log("Journey not found", req.body.id, req.body.external_id)
                const orderNumber = req.body.external_id.split("_")[0]
                const vehicleType = req.body.external_id.split("_")[1]
                const expandedOrder = 
                res.status(200).send("Event received")
                return
            }
            console.log("updating",req.body.id, journey.id, "with", req.body.state)
            const orderJourneyDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber + "/journeys/" + journey.id)
            const orderDoc = admin.firestore().doc("SPREE_ORDERS_"+ journey.stock_location_id + "/" + journey.orderNumber)
            
            await updateOrderDocumentStatus(req.body.state, journey)
            const updateJourneys = async () => {
                await orderJourneyDoc.update({
                    status: req.body.state,
                    updatedAt: new Date(),
                    cabifyTrip: req.body
                })
                await journeyDoc.update({
                    status: req.body.state,
                    updatedAt: new Date(),
                    cabifyTrip: req.body
                })
            }
            await updateJourneys()
            return res.status(200).send('Event received')
        })

    });

    return listenToCabifyStatusWebHook;
}