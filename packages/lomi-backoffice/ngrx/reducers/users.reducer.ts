import * as actions from '../actions/users.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createFeatureSelector, createSelector, select } from "@ngrx/store";
import { EntitySelectorsFactory } from "@ngrx/data";
import { filter, pipe } from "rxjs";
import { IUser } from 'packages/lomi-backoffice/types/user';

export interface State extends EntityState<IUser> {
    loading: boolean
}
export const userAdapter:EntityAdapter<IUser> = createEntityAdapter<IUser>({})


const initialState:State = userAdapter.getInitialState({
    loading: false
})

export function reducer(
    state: State =  initialState,
    action: any,
    ):State {
        switch (action.type) {
            case actions.ADDED: 
            return { ...userAdapter.addOne(action.payload, state), loading:false }
            
            case actions.MODIFIED:
                return userAdapter.updateOne({
                    id: action.payload.uid,
                    changes: action.payload    
                }, state)
                
                case actions.REMOVED:
                    return userAdapter.removeOne(action.payload.id, state)
            case actions.QUERY:
            return {...userAdapter.removeAll(state), loading: true}
        
        default:
            return state
    }
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = userAdapter.getSelectors();