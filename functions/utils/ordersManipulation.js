const splitOrderWithShipmentsByStockLocation = (order) => {
    order.shipments = order.shipments.sort((a, b) => {
      if (a.stock_location_id > b.stock_location_id) return 1;
      if (a.stock_location_id < b.stock_location_id) return -1;
      return 0;
    })
  
    return order.shipments.reduce((acc, shipment) => {
      const shipmentOrder = { ...order, stock_location_id: shipment.stock_location_id };
      if(acc.length && acc[acc.length - 1].stock_location_id != shipment.stock_location_id){
        acc.push({...shipmentOrder, ...{ shipments: [shipment] }});
        return acc;
      } else if(!acc.length){
        acc.push({...shipmentOrder, ...{ shipments: [shipment] }});
        return acc;
      } else {
        acc[acc.length - 1].shipments.push(shipment);
        return acc;
      }
    }, [])
  }

  module.exports = {
    splitOrderWithShipmentsByStockLocation
  }