//Main Ngrx file

import { Dictionary } from '@ngrx/entity';
import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer, select } from '@ngrx/store';
import { filter, map, pipe } from 'rxjs';
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
      return Object.values(orders).filter((order) => {
        if(!order?.status){
          return statusId == 0
        } else {
          return order?.status == statusId
        }
      })
    })
  ))