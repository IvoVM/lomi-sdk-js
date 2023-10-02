export interface Order {
  channel: string;
  completed_at: At;
  email: string;
  id: number;
  number: string;
  item_total: string;
  lack_of_stock: boolean;
  miles_latam: number | null;
  name: string;
  payment_state: string;
  scheduled_at: null;
  ship_address_address1: string;
  ship_address_address2: string;
  ship_address_city: string;
  ship_address_country: string;
  ship_address_county: string;
  ship_address_note: null | string;
  ship_address_phone: string;
  ship_address_state: string;
  shipment_stock_location_id: number;
  shipment_stock_location_name: string;
  shipment_total: string;
  special_instructions: string;
  total: string;
  status: number | string;
  return_reason: string;
  return_resolution: string;
  ready_to_pick_at: Date;
  picked_at: At | Date;
  waiting_at_driver_time: Date;
  delivered_at: Date;
  total_delivery_time: Date;
  picker: Picker | null;
  journeys: any[];
  start_at_coordinates: string;
  end_at_coordinates: string;
  line_items: number[];
  reintegratedItems: any[];
  stock_location_id: number;
  ship_address_new_user: boolean;
  shipments: Shipment[];
  isStorePicking: boolean;
  DEBUG: boolean;
  token: string;
  shipment_id: number;
  shipment_number: string;
  deliveredAt?: At;
  shipment_state: string;
  state: string;
  stops?: Stop[];
  uberFourWheelsEstimated?: UberFourWheelsEstimated;
  cabifyEstimated4W?: CabifyEstimated4W;
  store_rider_searching_at?: At;
  store_rider_picked_at?: At;
  store_rider_delivered_at?: At;
  request_deliver_at?: At;
}

export interface CabifyEstimated4W {
  parcel_ids: string[];
  eta_to_pick_up: number;
  eta_to_delivery: number;
  price_total: PriceTotal;
}

export interface PriceTotal {
  amount: number;
  currency: string;
}

export interface At {
  _seconds: number;
  _nanoseconds: number;
}

export interface Picker {
  id: string;
  name: string;
}

export interface Shipment {
  number: string;
  stock_location_name: string;
  shipping_method_id: number;
  stock_location_id: number;
  scheduled_at: Date | null;
  id: number;
  line_items: LineItem[];
  is_pickup: boolean | null;
}

export interface LineItem {
  quantity: number;
  options_text: OptionsText;
  img_url: string;
  price: string;
  producer_name: string;
  name: string;
  final_amount: string;
  id: number;
  sku: string;
}

export enum OptionsText {
  Unidades1Unidad = 'Unidades: 1 Unidad',
}

export interface Stop {
  country: string;
  loc: number[];
  city: string;
  contact: Contact;
  num: string;
  instr: null | string;
  name: string;
  addr: string;
}

export interface Contact {
  mobileNum: string;
  name: string;
  mobileCc: string;
}

export interface UberFourWheelsEstimated {
  duration?: number;
  expires?: Date;
  currency_type?: string;
  dropoff_eta?: Date;
  pickup_duration?: number;
  kind: string;
  created?: Date;
  fee?: number;
  dropoff_deadline?: Date;
  currency?: string;
  id?: string;
  code?: string;
  message?: string;
}
