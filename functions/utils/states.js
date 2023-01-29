module.exports = (() => {
    const statusDicc = {
        0: {
            text: 'store_pickup_pending',
            value: "Pendiente de retiro",
        },
        1: {
            text: 'pending_delivery_schedule',
            value: "Pedido programado para entrega",
        },
        2: {
            text: 'pending_delivery',
            value: "Pendiente de entrega",
        },
        3: {
            text: 'preparing',
            value: "Preparando pedido",
        },
        4: {
            text: 'store_rider_searching',
            value: "Esperando al repartidor",
            uber_status: "pending"
        },
        5: {
            text: 'store_rider_assigned',
            value: "El repartidor va camino a la direccion del cliente",
            uber_status: "dropoff"
        },
        6: {
            text: 'store_rider_delivered',
            value: "El repartidor entrego el pedido",
            uber_status: "delivered"
        },
        7: {
            text: 'store_rider_canceled',
            value: "El repartidor cancelo el pedido",
            uber_status: "canceled"
        }

    }

    function getStatusText(status){
        return statusDicc[status].text;
    }

    function getStatusValue(status){
        return statusDicc[status].value;
    }

    function decodeUberStatus(status){
        return statusDicc[status].uber_status;
    }

    return {
        getStatusText,
        getStatusValue,
        decodeUberStatus
    }
})()