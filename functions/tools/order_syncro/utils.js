function mapOrder(order, stockLocationId) {
    const mappedOrder = {
      id: order.id,
      number: order.number,
      lack_of_stock: false,
      completed_at: order.completed_at,
      state: order.state,
      payment_state: order.payment_state,
      email: order.email,
      total: order.total,
      scheduled_at: order.scheduled_at,
      channel: order.channel,
      shipment_total: order.ship_total,
      item_total: order.item_total,
      miles_latam: null,
      special_instructions: order.special_instructions,
      name: order.ship_address.full_name, // No está presente en el objeto order
      ship_address_address1: order.ship_address.address1,
      ship_address_address2: order.ship_address.address2,
      ship_address_city: order.ship_address.city,
      ship_address_state: order.ship_address.state ? order.ship_address.state.name : null,
      ship_address_county: order.ship_address.county ? order.ship_address.county.name : null,
      ship_address_country: order.ship_address.country ? order.ship_address.country.name : null,
      ship_address_phone: order.ship_address.phone,
      ship_address_note: "Lun a Dom - 8:30 a 21:00",
      shipment_stock_location_id: stockLocationId || -999,
      shipment_total: "1990.0",
      shipment_stock_location_name: order.shipments.length > 0 ? (order.shipments[0].stock_location_name || 'Sin despacho asignado') : 'Sin despacho asignado',
      line_items: order.line_items.map((line_item) => ({
        id: line_item.id,
        sku: line_item.variant.sku,
        price: line_item.price,
        quantity: line_item.quantity,
        final_amount: line_item.total,
        img_url: null, // No está presente en el objeto order
      })),
    };
  
    return mappedOrder;
  }
  
module.exports = mapOrder