import { Promotions } from './promotions';
import { changeClient } from '../lomi-sdk'


describe('promotions',()=>{
    it('Should fetch delivery promotions', async ()=>{
        expect(await Promotions.fetchDeliveryPromotions())
        console.log(await Promotions.fetchDeliveryPromotions("1"))
        expect((await Promotions.getPromotionsOfCart(MOCK_CART.attributes)))
    })
})



const MOCK_CART = {
    "id": "1669058",
    "type": "cart",
    "attributes": {
        "number": "R957388491",
        "item_total": "116253.0",
        "total": "27492.0",
        "ship_total": "1300.0",
        "adjustment_total": "-161.0",
        "created_at": "2022-04-19T17:54:16.540-04:00",
        "updated_at": "2022-04-19T21:14:57.062-04:00",
        "completed_at": null,
        "included_tax_total": "0.0",
        "additional_tax_total": "0.0",
        "display_additional_tax_total": "$0",
        "display_included_tax_total": "$0",
        "tax_total": "0.0",
        "currency": "CLP",
        "state": "address",
        "token": "q99TxEEQyLtbwFRB-iI3RQ1650405256534",
        "email": "marco@lomi.cl",
        "display_item_total": "$116.253",
        "display_ship_total": "$0",
        "display_adjustment_total": "-$161",
        "display_tax_total": "$0",
        "promo_total": "-161.0",
        "display_promo_total": "-$161",
        "item_count": 26,
        "special_instructions": null,
        "display_total": "$116.092",
        "pre_tax_item_amount": "116253.0",
        "display_pre_tax_item_amount": "$116.253",
        "pre_tax_total": "116253.0",
        "display_pre_tax_total": "$116.253",
        "shipment_state": null,
        "payment_state": null,
        "miles_latam": null,
        "latam_code": "195",
        "id_latam_response": null,
        "stock_locations": [
            {
                "id": 28,
                "name": "Sewell 20, Local 3 - Machalí",
                "created_at": "2021-09-16T15:32:55.854-03:00",
                "updated_at": "2021-12-27T22:40:56.103-03:00",
                "default": false,
                "address1": "Sewell 20, Local 3",
                "address2": "",
                "city": "Rancagua",
                "state_id": 3,
                "state_name": null,
                "country_id": 1,
                "zipcode": "",
                "phone": "11111111",
                "active": true,
                "backorderable_default": false,
                "propagate_all_variants": true,
                "admin_name": "MACHALI",
                "vendor_id": null,
                "county_id": 33,
                "latitude": null,
                "longitude": null,
                "email": "tiendach4@lomi.cl",
                "cabify_user_id": "b7e7866216fb11ec96cd0242ac11000f",
                "internal_code": "MA",
                "preferences": null
            }
        ]
    },
    "relationships": {
        "line_items": {
            "data": [
                {
                    "id": "720697",
                    "type": "line_item"
                },
                {
                    "id": "720705",
                    "type": "line_item"
                },
                {
                    "id": "723812",
                    "type": "line_item"
                },
                {
                    "id": "723813",
                    "type": "line_item"
                },
                {
                    "id": "723814",
                    "type": "line_item"
                },
                {
                    "id": "723828",
                    "type": "line_item"
                },
                {
                    "id": "723848",
                    "type": "line_item"
                },
                {
                    "id": "723849",
                    "type": "line_item"
                },
                {
                    "id": "723850",
                    "type": "line_item"
                },
                {
                    "id": "724134",
                    "type": "line_item"
                },
                {
                    "id": "724139",
                    "type": "line_item"
                },
                {
                    "id": "724140",
                    "type": "line_item"
                },
                {
                    "id": "724143",
                    "type": "line_item"
                },
                {
                    "id": "724144",
                    "type": "line_item"
                },
                {
                    "id": "724147",
                    "type": "line_item"
                },
                {
                    "id": "724148",
                    "type": "line_item"
                },
                {
                    "id": "724149",
                    "type": "line_item"
                },
                {
                    "id": "724150",
                    "type": "line_item"
                },
                {
                    "id": "724151",
                    "type": "line_item"
                },
                {
                    "id": "724152",
                    "type": "line_item"
                }
            ]
        },
        "variants": {
            "data": [
                {
                    "id": "6320",
                    "type": "variant"
                },
                {
                    "id": "1574",
                    "type": "variant"
                },
                {
                    "id": "2219",
                    "type": "variant"
                },
                {
                    "id": "3031",
                    "type": "variant"
                },
                {
                    "id": "3093",
                    "type": "variant"
                },
                {
                    "id": "3767",
                    "type": "variant"
                },
                {
                    "id": "4252",
                    "type": "variant"
                },
                {
                    "id": "4347",
                    "type": "variant"
                },
                {
                    "id": "774",
                    "type": "variant"
                },
                {
                    "id": "886",
                    "type": "variant"
                },
                {
                    "id": "4988",
                    "type": "variant"
                },
                {
                    "id": "5833",
                    "type": "variant"
                },
                {
                    "id": "2391",
                    "type": "variant"
                },
                {
                    "id": "5726",
                    "type": "variant"
                },
                {
                    "id": "2273",
                    "type": "variant"
                },
                {
                    "id": "2271",
                    "type": "variant"
                },
                {
                    "id": "2214",
                    "type": "variant"
                },
                {
                    "id": "3241",
                    "type": "variant"
                },
                {
                    "id": "784",
                    "type": "variant"
                },
                {
                    "id": "131",
                    "type": "variant"
                }
            ]
        },
        "promotions": {
            "data": [
                {
                    "id": "4511",
                    "type": "promotion"
                }
            ]
        },
        "payments": {
            "data": []
        },
        "shipments": {
            "data": []
        },
        "user": {
            "data": {
                "id": "20175",
                "type": "user"
            }
        },
        "billing_address": {
            "data": {
                "id": "25894",
                "type": "address"
            }
        },
        "shipping_address": {
            "data": {
                "id": "25894",
                "type": "address"
            }
        }
    }
}