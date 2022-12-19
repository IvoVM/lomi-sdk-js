import { Timestamp } from "firebase/firestore"

export type placedOrder = {
	channel: string,
	completed_at?: Timestamp,
	email: string,
	id: number,
    number: string,
	item_total: number,
	lack_of_stock: boolean,
	miles_latam?: number,
	name: string,
	payment_state: string,
    scheduled_at?: string,
	ship_address_address1: string,
	ship_address_address2: string,
	ship_address_city: string,
	ship_address_country: string,
	ship_address_county: string,
	ship_address_note: string,
	ship_address_phone: string,
	ship_address_state: string,
	shipment_stock_location_id: number,
	shipment_stock_location_name: string
	shipment_total: number,
	shipment_number: string,
	special_instructions: string,
	total: number,
    status: number,
    return_reason: string,
	return_resolution: string,
	isStorePicking: boolean,

    stops: Stop[],
	statusChanges: statusChange[]
	line_items: LineItem[]
	reintegratedItems: LineItem[]
	journeys?: Journey[]

	DEBUG: boolean
} 

export type Stop = {
	addr: string
	city: string
	contact: any
	country: string
	loc: any[]
	name: string
	num: string
}

export type ScheduledOrder = placedOrder //S1
export type PendingOrder = ScheduledOrder //S2
export type OnPickingOrder = PendingOrder & { 
    pendingTime: number
    picker: Picker
} //S3
export type WaitingAtDriverOrder = OnPickingOrder & { 
    pickingTime: number
    journeys: Journey[]
} //S4
export type OnDeliveryOrder = placedOrder & {
    waitingAtDriverTime: number
} //S5
export type DeliveredOrder = OnDeliveryOrder & { //S6
    finished_at: Date
    total_delivery_time: number,
}
export type Order = DeliveredOrder | OnDeliveryOrder | WaitingAtDriverOrder | OnPickingOrder | PendingOrder | ScheduledOrder

export type LineItem = {
    final_amount: string
    id: number
    img_url: string
    name: string
    options_text: string
    price: string
    producer_name: string
    quantity: number
    sku: string
}

export type Journey = {
	providerId: number,
	duration?: number,
	distance?: number,
	estimatedTime?: number,
	returned?: boolean,
    line_items?: LineItem[]
	orderNumber?: string,
	status?: any,
	stock_location_id?: number,
	id?:	string,
	uberTrip?: any;
	uberFourWheelsTrip?: any;
	cabifyTrip?: any;
	state?: string,
}

export type Picker = {
	id: number,
	name: string
}

export type statusChange = {
	created_at: Date,
	status_id: number,
	status_name: string,
}