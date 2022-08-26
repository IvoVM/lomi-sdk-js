import { DeliveredOrder, LineItem, Order, statusChange } from "packages/lomi-backoffice/types/orders";
import * as actions from '../actions/orders.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createFeatureSelector, createSelector, select } from "@ngrx/store";
import { EntitySelectorsFactory } from "@ngrx/data";
import { filter, pipe } from "rxjs";
import { CHANGE_STOCK_LOCATION } from "../actions/app.actions";

export function sortByCompletedAt(a: any, b: any): number {
    return -b.completed_at.seconds - -a.completed_at.seconds;
  }
export interface State extends EntityState<Order> {
    loading: boolean
}
export const orderAdapter:EntityAdapter<Order> = createEntityAdapter<Order>({
    sortComparer: sortByCompletedAt
})


const initialState:State = orderAdapter.getInitialState({
    loading: false
})

export function reducer(
    state: State =  initialState,
    action: any,
    ):State {
    switch (action.type) {
        case actions.ADDED: 
            return { ...orderAdapter.addOne(action.payload, state), loading:false }
       
        case actions.MODIFIED:
            return orderAdapter.updateOne({
                    id: action.payload.id,
                    changes: action.payload    
                }, state)
        
        case actions.REMOVED:
            return orderAdapter.removeOne(action.payload.id, state)
        
        case CHANGE_STOCK_LOCATION:
            return {...orderAdapter.removeAll(state), loading: true}
        
        default:
            return state
    }
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = orderAdapter.getSelectors();