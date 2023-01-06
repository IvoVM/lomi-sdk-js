//Main Ngrx file

import { Dictionary } from '@ngrx/entity';
import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer, select } from '@ngrx/store';
import { filter, map, pipe } from 'rxjs';
import { FINISHED_STATE, PENDING_STATE, SCHEDULED_STATE, STORE_PICKING_STATE, FAILED } from '../providers/lomi/mocks/states.mock';
import { environment } from '../src/environments/environment';
import { Order } from '../types/orders';
import { IUser, User } from '../types/user';
import * as fromOrders from './reducers/orders.reducer';
import * as fromApp from './reducers/app.reducer';
import * as fromUsers from './reducers/users.reducer';
import * as fromJourneys from './reducers/journeys.reducer';
import { userReducer } from './reducers/user.reducer';
import { App } from '../types/app';

export interface BackofficeState {
    orders: fromOrders.State
    user: IUser,
    app: App,
    users: fromUsers.State,
    journeys: fromJourneys.State
}

export const reducers: ActionReducerMap<BackofficeState> = {
    orders: fromOrders.reducer,
    user: userReducer,
    app: fromApp.reducer,
    users: fromUsers.reducer,
    journeys: fromJourneys.reducer
};


export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
      console.log('state', state);
      console.log('action', action);
   
      return reducer(state, action);
    };
  }
  
  export const metaReducers: MetaReducer<BackofficeState>[] = !environment.production ? [] : [];
  
  export const selectOrderState = createFeatureSelector<fromOrders.State>('orders');

  export const selectOrders = createSelector(
    selectOrderState,
    fromOrders.selectEntities,
  );

  export const selectState0 = ((statusId:any) => pipe(
    select(selectOrders),
    map((orders) => {
      return Object.values(orders).filter((order: Order | undefined) => {
        if(statusId == undefined && !(order?.name?.includes('Retiro'))){
          return true
        }
        else if(order?.status == FINISHED_STATE){
          if(statusId == FINISHED_STATE){
            return true
          }
          return false
        }
        else if(order?.name?.includes('Retiro') || order?.isStorePicking){
          if(order?.status == FAILED){
            return statusId == FAILED
          }
          if(statusId == STORE_PICKING_STATE || !statusId){
            return order.name.includes("Retiro") || order.isStorePicking
          }
          return false
        } 
        else if(order?.scheduled_at && (!order?.status || order?.status <= 2)) {
          const scheduledTime = new Date(order.scheduled_at).getTime()
          const currentTime = new Date().getTime()
          if(scheduledTime > currentTime){
            return statusId == SCHEDULED_STATE
          } else {
            if(order?.name?.includes("Retiro")){
              return statusId == STORE_PICKING_STATE
            } else {
              return statusId == PENDING_STATE
            }
          }
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