export interface OrderInterface {
  channel: string;
  id: number;
  payment_state: string;
  total: string;
  shipments: LineItem[];
  shipments_length: number;
  email: string;
}

interface LineItem {
  quantity: number;
  options_text: string;
  img_url: string;
  price: string;
  producer_name: string;
  name: string;
  final_amount: string;
  id: number;
  sku: string;
}
