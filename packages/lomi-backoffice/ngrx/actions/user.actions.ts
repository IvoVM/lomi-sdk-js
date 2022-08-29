import { Action } from '@ngrx/store';

export const GET_USER               = '[Auth] Get user';
export const AUTHENTICATED          = '[Auth] Authenticated';
export const NOT_AUTHENTICATED      = '[Auth] Not Authenticated';
export const USER_UPDATED           = '[Auth] User Updated';

export const GOOGLE_LOGIN           = '[Auth] Google login attempt';
export const LOGOUT                 = '[Auth] Logout';

export const AUTH_ERROR             = '[Auth] Error';


/// Get User AuthState

export class GetUser implements Action {
    readonly type = GET_USER;
    constructor(public payload?: any) {}
}

export class UserUpdated implements Action {
    readonly type = USER_UPDATED;
    constructor() {}
}
export class Authenticated implements Action {
    readonly type = AUTHENTICATED;
    constructor(public payload?: any) {}
}

export class NotAuthenticated implements Action {
    readonly type = NOT_AUTHENTICATED;
    constructor(public payload?: any) {}
}

export class AuthError implements Action {
    readonly type = AUTH_ERROR;
    constructor(public payload?: any) {}
}

/// Google Login Actions

export class GoogleLogin implements Action {
    readonly type = GOOGLE_LOGIN;
    constructor(public payload?: any) {}
}

/// Logout Actions

export class Logout implements Action {
    readonly type = LOGOUT;
    constructor(public payload?: any) {}
}


export type All
= GetUser 
| Authenticated
| NotAuthenticated
| GoogleLogin
| AuthError
| UserUpdated
| Logout;