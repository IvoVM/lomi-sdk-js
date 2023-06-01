const { App } = require('@slack/bolt');
require('dotenv').config()

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  });

function shipmentToSectionBlock(shipment){
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Nuevo envio #"+shipment.number+" generado para la orden "+this.orderNumber+"!"
        },
        "accessory": {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "Ir a la orden",
                "emoji": true
            },
            "value": "click_me_123",
            "url": "https://lomi.cl/admin/orders/"+this.orderNumber,
            "action_id": "button-action"
        }
    }
}

function constructShipment(shipment){
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*"+(shipment.scheduled_at ? shipment.scheduled_at : 'Envio inmediato')+"*\n"+shipment.stock_location_name
        },
        "accessory": {
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": shipment.number
            },
            "value": "click_me_123",
            "url": "https://lomi.hermex.delivery/orders/"+this.orderNumber+ "?shipment_stock_location=46",
        }
    }
}

function constructOrder(order){
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Nueva Orden!"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<https://lomi.cl/admin/orders/"+order.number+">*\n"+order.name+"\n"+order.ship_address_address1+", "+order.ship_address_address2+"\n"+order.ship_address_county
            },
            "accessory": {
                "type": "image",
                "image_url": "https://i.imgur.com/qE9zmEE.png",
                "alt_text": "calendar thumbnail"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Envios*"
            }
        },
        ...order.shipments.map(constructShipment.bind({orderNumber: order.number})),
    ]
    console.log(blocks)
    return blocks
}
  
module.exports = (() => {

    const sendOrderDetails = (order) => {
        console.log(process.env.SLACK_SIGNING_SECRET
            )
        return app.client.chat.postMessage({
            channel: "C05ARVDDA9F",
            "type": "interactive_message",
            "text": "Nuevo pedido!",
            "blocks":[
                ...constructOrder(order)
            ],
        })
    }

    return {
        app,
        sendOrderDetails
    }

})()