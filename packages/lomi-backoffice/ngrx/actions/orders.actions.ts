import { Action } from '@ngrx/store';
import { Order } from 'packages/lomi-backoffice/types/orders';

export const QUERY = '[Orders] Query';
export const QUERY_SUCCESS = '[Orders] Query Success';

export const ADDED = '[Orders] Added';
export const MODIFIED = '[Orders] Modified';
export const REMOVED = '[Orders] Removed';

export const UPDATE = '[Orders] Update';
export const UPDATE_SUCCESS = '[Orders] Update Success';

export class Query implements Action {
  readonly type = QUERY;
  constructor() {}
}

export class QuerySuccess implements Action {
    readonly type = QUERY_SUCCESS;
}

export class Added implements Action {
    readonly type = ADDED;
    constructor(public payload: Order) {}
}

export class Modified implements Action {
    readonly type = MODIFIED;
    constructor(public payload: Order) {}
}

export class Removed implements Action {
    readonly type = REMOVED;
    constructor(public payload: Order) {}
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public id: string,
        public changes: Partial<Order>
    ) {}
}

export class UpdateSuccess implements Action {
    readonly type = UPDATE_SUCCESS;
    constructor() {}
}

export type OrderActions = Query | QuerySuccess | Added | Modified | Removed | Update | UpdateSuccess;