
const firebase_admin = require('firebase-admin');
const serviceAccount = {
    "type": "service_account",
    "project_id": "lomi-35ab6",
    "private_key_id": "89dc30e2d01f944d97a02bc5ef3768cf91d1ad5b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTT8s2vw9z3IzS\nHPpgt4xYJ7JEiwW/RnCHzoUc8o7+8LD29veGiqUObRcN8VJG6PYbkmGSY5Rjeux6\nTeaBmEpQqVNaqqH8Uwy68KCEQI73iwHy7jEo0WbwUCw34MU9++MFNUJlwY7zQt8J\nICXGP/jl+6TJRxuKsz9+e6Vz3OJY76L2Ar2w+GrDQwt8FuDn2OPlrSJW2RF847/C\na859uUg+2h8Q1bRzZkwuCZwHMPla2VpzDmZzssuSdLQLnC03Ddsql3yZVEXVS2Ea\nUgFPA4jUAk+arhosy3uNQdMOtP3X//RE2X5qFXHRVHWyJiWMubYoo1Ra0pLFX0w7\nDYyDEcqtAgMBAAECggEAaZqwq+ELR3N7GwypYomIhYv9Lv0td5yr42smIkPki+tc\n/WeKZ75FY/LH+UtXu6F0UW4z/hVvFNJbeXoSD0U9Kpec1Sx+fNxCefCEv+OFr5fU\ndwRsJAKWx9XBa4GVAXevSqyFzNXRa6hJT8W1qyDQcptzDLZRQN15B2yi0McchaYA\nJXwz0KpSYFfL6Z32O1Mh9q411EeEnIi8J/PD1p9rwmFpnWEupBVXfzp09ZYq8BSb\nNK8b8Xe4WLI/E5Qu/38uez3SZVDn3l1mCvou9DcEYQSgvHBt8YvIR1TEa3TAd8fV\nYE4ac5PwHPY45gxuUR4SG3cO7FPeLQIwCn9PMF5jLwKBgQD7XgFI7ijfSBATFm3a\nehIr37UU7uqQoOzHN3yta01OgxQMcVxME5e7cmAh9tnuF4cJn+J9OcJPnsVDixZx\n6MHVg8iv5zXZ+NzYj/e6aeUy7oj8ySdlRcWSOFB6KfIdKG6mTexzqlo6KU5Ma3D2\narwtGqHUcaO1R7ZXy4Oo0Q8SXwKBgQDXNMy+xwnIc0Cpi0jVFTpEcFiWE4CVxGRs\napde3SEA5Amaz2Gdc7QCW0fl307aOOL2xK+G6OFXfW/vRDjo2XODejLKh5Sqz4Nv\nQYoBz/TUrsGvEpBASvOPddU8/O92PJzICm5x59xMR7jUMNzhNXUeFfsiXRVRY/Ed\nExb+aOO2cwKBgQDRvZKc4/w+ssaW5rQrBIh9C2DxYplerKhlYisqGMqcpErqRvyY\njhChW8JTFMKrI/6NTVeS3csA3J4Eyd2klm6GVjvyap5IjprYKOiwJwQUB21OYBn7\nKsi8RTkBdlaLdd097u9JY+99cFHg+hV7x3vUttApj9jlvjyr7SiiiC5nSQKBgG5t\nxIY8ohN+uHaHZ1cX7m9B6uMPnNK9FP7g702ZUJ8hZKBQu/lMbtkqt8kH/nFR8XzI\nznz+sOrxDegL7NvnATQ9FyT/z1Sa6QnE6qklaa9dATvx3Z1wGGzL/SCvdb0JOzYW\nzDecz1lBEGGptR3HDZLjmps2goLiMs5Fhm4Dqp1rAoGAWirARK1oJPATgGnw7H2d\nA/vWbUTj0I0UIB+vKB1SpYPL0eqMPqfKgfRYRXDRMHpLmjiZXh3AnOejj0w1PufU\nYiRoBAwVlWfTXi1o7FvlmTMmDBjuQ5X831fuCNwEBDnoZcUWouJzCMoG2G8Ly1qK\nEVm+eegnzrfp9e81bR9XCBk=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-uebeh@lomi-35ab6.iam.gserviceaccount.com",
    "client_id": "107619228058542995257",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uebeh%40lomi-35ab6.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  
const admin = firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount)
});
const firebaseUtils = require('../../utils/firebase/firebase')(admin);

const spreeUrl = 'https://lomi.cl/';
const token = '8b9c307dd89928cc60e8e59d2233dbafc7618f26c52fa5d3';
const spreeDebugUrl = 'https://lomi-dev.herokuapp.com/';

SpreeApi = require('../../utils/spree/spree.js')(spreeUrl, token, spreeDebugUrl)

function checkIfOrderIsReady(order){
    console.log(order.number, order.state)
    if(order.state == 'complete'){
        return true
    } else {
        return false
    }
}

const getSpreeLastOrders = SpreeApi.getOrders().then((spreeLastOrders)=>{
    spreeLastOrders.orders.forEach((spreeOrder)=>{
        SpreeApi.getOrder(spreeOrder.order.number).then((spreeOrder)=>{
            console.log(spreeOrder.number, spreeOrder.state)
            spreeOrder.shipments.forEach((shipment)=>{
                firebaseUtils.getOrderDocumentReference(spreeOrder.number, 46).get().then((orderDoc)=>{
                    console.log(orderDoc.exist)
                })
            })
        });
    })    
})


