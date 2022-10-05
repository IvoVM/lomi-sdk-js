module.exports = () => {

    const STORE_PICKING_STATE = 0
    const SCHEDULED_STATE = 1
    const PENDING_STATE = 2
    const ON_PICKING_STATE = 3
    const WAITING_AT_DRIVER_STATE = 4
    const DELIVERING_ORDER_STATE = 5
    const FINISHED_STATE = 6
    const FAILED = 7
    
    return {
        STORE_PICKING_STATE,
        SCHEDULED_STATE,
        PENDING_STATE,
        ON_PICKING_STATE,
        WAITING_AT_DRIVER_STATE,
        DELIVERING_ORDER_STATE,
        FINISHED_STATE,
        FAILED
    }
    
}