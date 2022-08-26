//Main Ngrx file

import { Dictionary } from '@ngrx/entity';
import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer, select } from '@ngrx/store';
import { filter, map, pipe } from 'rxjs';
import { PENDING_STATE, STORE_PICKING_STATE } from '../providers/lomi/mocks/states.mock';
import { environment } from '../src/environments/environment';
import { Order } from '../types/orders';
import * as fromOrders from './reducers/orders.reducer';

export interface BackofficeState {
    orders: fromOrders.State
}

export const reducers: ActionReducerMap<BackofficeState> = {
    orders: fromOrders.reducer
};


export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
      console.log('state', state);
      console.log('action', action);
   
      return reducer(state, action);
    };
  }
  
  export const metaReducers: MetaReducer<BackofficeState>[] = !environment.production ? [debug] : [debug];
  
  export const selectOrderState = createFeatureSelector<fromOrders.State>('orders');

  export const selectOrders = createSelector(
    selectOrderState,
    fromOrders.selectEntities,
  );

  export const selectState0 = ((statusId:any) => pipe(
    select(selectOrders),
    map((orders) => {
      return Object.values(orders).filter((order: Order | undefined) => {
        if(order?.name?.includes('Retiro')){
          if(statusId == STORE_PICKING_STATE){
            return order.name.includes("Retiro")
          }
          return false
        } 
        else if(!order?.status){
          return statusId == PENDING_STATE
        }
        else {
          return order?.status == statusId
        }
      }).sort((a: any, b: any) => {
        return b.completed_at?.seconds - a.completed_at?.seconds
      })
    })
  ))