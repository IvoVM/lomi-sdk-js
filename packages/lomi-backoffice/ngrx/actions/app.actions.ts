export const CHANGE_STOCK_LOCATION = '[App] Change Stock Location';

export class ChangeStockLocation {
    readonly type = CHANGE_STOCK_LOCATION;
    constructor(public stockLocationId: number) {}
}