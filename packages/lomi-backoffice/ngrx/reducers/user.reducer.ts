import * as userActions from '../actions/user.actions';
import { BackofficeState } from '..';
import { User } from 'packages/lomi-backoffice/types/user';

export type Action = userActions.All;

const defaultUser = new User("0", 'GUEST');

/**
 * Define all store queries for Post(s)
 */

export namespace UsersQuery {
  export const getUser = (state: BackofficeState) => state.user;
}


/// Reducer function
export function userReducer(state: User = defaultUser, action: any) {
  switch (action.type) {

    case userActions.GET_USER:
        return { ...state, loading: true };
    
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