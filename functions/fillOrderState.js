const orderInitialState = {
    channel: "",
	completed_at: "",
	email: "",
	id: "",
    number: "",
	item_total: 0,
	lack_of_stock: false,
	miles_latam: 0,
	name: "",
	payment_state: "",
    scheduled_at: new Date(0),
	ship_address_address1: "",
	ship_address_address2: "",
	ship_address_city: "",
	ship_address_country: "",
	ship_address_county: "",
	ship_address_note: "",
	ship_address_phone: "",
	ship_address_state: "",
	shipment_stock_location_id: "",
	shipment_stock_location_name: "",
	shipment_total: 0,
	special_instructions: "",
	total: 0,
    status: "",
    return_reason: "",
	return_resolution: "",

	ready_to_pick_at: new Date(0),
    picked_at: new Date(0),
	waiting_at_driver_time: new Date(0),
	delivered_at: new Date(0),
	total_delivery_time: new Date(0),

    picker: {
        id: "",
        name: "",
    },

    journeys: [],
    start_at_coordinates: "0,0",
	end_at_coordinates: "0,0",
    line_items: [],
    reintegratedItems: [],
}

module.exports = {
    orderInitialState
}