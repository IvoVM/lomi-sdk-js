import * as userActions from '../actions/user.actions';
import { BackofficeState } from '..';
import { IUser, User } from 'packages/lomi-backoffice/types/user';
import { createSelector } from '@ngrx/store'

export type Action = userActions.All;

const defaultUser = {
    uid: '',
    email: '',
    displayName: '',
    userRol: 0,
}

/**
 * Define all store queries for Post(s)
 */

export namespace UsersQuery {
  export const getUser = (state: BackofficeState) => state.user;
}


/// Reducer function
export function userReducer(state: IUser = defaultUser, action: any) {
  switch (action.type) {

    case userActions.GET_USER:
        return { ...state, loading: true };
    case userActions.USER_UPDATED:
        console.log(action)
        return { ...state, ...action.payload, loading: false };
    
    case userActions.AUTHENTICATED:
        return { ...state, ...action.payload, loading: false };

    case userActions.NOT_AUTHENTICATED:
        return { ...state, ...defaultUser, loading: false };

    case userActions.GOOGLE_LOGIN:
      return { ...state, loading: true };

    case userActions.AUTH_ERROR:
      return { ...state, ...action.payload, loading: false };

    case userActions.LOGOUT:
      return { ...state, loading: true };
    
    default:
      return state;

  }
}

export const currentUserSelector = createSelector(
    (state: BackofficeState) => {
        const userRolDefinition = state.app.userRols.find(rol => rol.id === state.user.userRol)
        if(userRolDefinition) {
            return {
                ...state.user,
                userRol: userRolDefinition.rolName,
                stockLocationId: userRolDefinition.stockLocationId
            }
        } else {
            return state.user
        }
    },
    (user) => user
)