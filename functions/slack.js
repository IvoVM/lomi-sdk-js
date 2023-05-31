const { App } = require('@slack/bolt');
require('dotenv').config()

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  });
  
module.exports = (() => {

    const sendOrderDetails = (order) => {
        app.client.chat.postMessage({
            channel: "C05ARVDDA9F",
            "type": "interactive_message",
            "text": "Nuevo pedido!",
            "attachments": [
                {
                    "text": "📦 <https://lomi.cl/orders/"+order.number + "| "+order.number+">\n"
                    + "[ " + order.shipment_stock_location_name + " ]\n" 
                    + "Nombre: " + order.name + "\n"
                    + "Correo: " + order.email + "\n"
                    + "Dirección: " + order.ship_address_address1 + "\n"
                    + "Dirección, info adicional: " + order.ship_address_address2 + "\n"
                    ,
                    "fallback": "Error al interactuar",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    /**
                    "actions": [
                        {
                            "name": "accept",
                            "text": "Tomar pedido",
                            "type": "button",
                            "value": "accept",
                            "confirm": {
                                "title": "Seguro?",
                                "text": "Esta seguro de que quiere tomar el pedido?",
                                "ok_text": "Yes",
                                "dismiss_text": "No"
                            }
                        }
                        
                    ]*/
                }
            ]
        }).then((res)=>{
            console.log(res)
        })
    }

    return {
        app,
        sendOrderDetails
    }

})()