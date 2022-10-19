import { Action } from '@ngrx/store';
import { OrderByDirection } from 'firebase/firestore';
import { IUser } from 'packages/lomi-backoffice/types/user';

export const QUERY = '[Users] Query';
export const QUERY_SUCCESS = '[Users] Query Success';

export const ADDED = '[Users] User added';
export const MODIFIED = '[Users] User modified';
export const REMOVED = '[Users] User removed';

export const UPDATE = '[Users] Update';
export const UPDATE_SUCCESS = '[Users] Update Success';

export class Query implements Action {
  readonly type = QUERY;
  constructor(public payload:{
    start_at?: number,
    per_page?: number,
    orderBy? : string,
    orderBySort?: OrderByDirection,
    stock_location_id?: number,

    //Where clausules
    name?: string
    email?: string,
  }) {}
}

export class QuerySuccess implements Action {
    readonly type = QUERY_SUCCESS;
}

export class Added implements Action {
    readonly type = ADDED;
    constructor(public payload: IUser) {}
}

export class Modified implements Action {
    readonly type = MODIFIED;
    constructor(public payload: {
        uid: string,
        changes: Partial<IUser>
        }) {}
}

export class Removed implements Action {
    readonly type = REMOVED;
    constructor(public payload: IUser) {}
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public uid: string,
        public changes: Partial<IUser>
    ) {}
}

export class UpdateSuccess implements Action {
    readonly type = UPDATE_SUCCESS;
    constructor() {}
}

export type IUserActions = Query | QuerySuccess | Added | Modified | Removed | Update | UpdateSuccess;