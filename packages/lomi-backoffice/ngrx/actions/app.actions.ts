import { Action } from '@ngrx/store';
import { OrderByDirection } from 'firebase/firestore';
import { App } from 'packages/lomi-backoffice/types/app';

export const QUERY = '[App] Query';
export const QUERY_SUCCESS = '[App] Query Success';

export const ADDED = '[App] App added';
export const MODIFIED = '[App] App modified';
export const REMOVED = '[App] App removed';

export const UPDATE = '[App] Update';
export const UPDATE_SUCCESS = '[App] Update Success';

export const CHANGE_STOCK_LOCATION = '[App] Change Stock Location';

export class ChangeStockLocation {
    readonly type = CHANGE_STOCK_LOCATION;
    constructor(public stockLocationId: number) {}
}

export class Query implements Action {
  readonly type = QUERY;
  constructor() {}
}

export class QuerySuccess implements Action {
    readonly type = QUERY_SUCCESS;
}

export class Added implements Action {
    readonly type = ADDED;
    constructor(public payload: App) {}
}

export class Modified implements Action {
    readonly type = MODIFIED;
    constructor(public payload: App) {}
}

export class Removed implements Action {
    readonly type = REMOVED;
    constructor(public payload: App) {}
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public id: string,
        public changes: Partial<App>
    ) {}
}

export class UpdateSuccess implements Action {
    readonly type = UPDATE_SUCCESS;
    constructor() {}
}

export type AppActions = Query | QuerySuccess | Added | Modified | Removed | Update | UpdateSuccess;