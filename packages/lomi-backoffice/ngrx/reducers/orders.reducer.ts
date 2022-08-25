import { DeliveredOrder, LineItem, Order, statusChange } from "packages/lomi-backoffice/types/orders";
import * as actions from '../actions/orders.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createFeatureSelector, createSelector, select } from "@ngrx/store";
import { EntitySelectorsFactory } from "@ngrx/data";
import { filter, pipe } from "rxjs";


export interface State extends EntityState<Order> {}
export const orderAdapter:EntityAdapter<Order> = createEntityAdapter<Order>()


const initialState:State = orderAdapter.getInitialState({
    selectedOrderId: null,
})

export function reducer(
    state: State =  initialState,
    action: any,
    ):State {
    switch (action.type) {
        case actions.ADDED: 
            return orderAdapter.addOne(action.payload, state)
       
        case actions.MODIFIED:
            return orderAdapter.updateOne({
                    id: action.payload.id,
                    changes: action.payload    
                }, state)
        
        case actions.REMOVED:
            return orderAdapter.removeOne(action.payload.id, state)
        
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