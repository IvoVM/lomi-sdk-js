import {Injectable} from '@angular/core';
import {Effect, Actions, ofType, createEffect} from '@ngrx/effects';
import { BackofficeState } from '..';
import { collectionData, doc, Firestore, startAt } from '@angular/fire/firestore';
import { Action, Store } from '@ngrx/store';
import { collection, limit, onSnapshot, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { lastValueFrom, map, merge, mergeMap, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators'
import { ADDED, Query, QUERY, QUERY_SUCCESS } from '../actions/orders.actions';
import { snapshotChanges } from '@angular/fire/compat/database';
import { JourneyQuery } from '../actions/journey.actions';
import { OrdersService } from 'packages/lomi-backoffice/providers/lomi/orders.service';

@Injectable()
export class OrderEffects {
    
    query$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(QUERY),
        switchMap((action: Query) => {
          if(action.payload.stock_location_id){
            this.ordersService.filters.stockLocationId = action.payload.stock_location_id as number;
            localStorage.setItem('stockLocationId', action.payload.stock_location_id.toString())
          }
            const queryDefinition = query(
              collection(
                this.afs,
                (action.payload.collections_names ? action.payload.collections_names[0] : action.payload.stock_location_id ? `SPREE_ORDERS_${action.payload.stock_location_id}` : 'SPREE_ORDERS_'+this.ordersService.filters.stockLocationId),),
              ...(
                action.payload.name ? [
                  
                orderBy('name', 'asc'),
              where('name', '>=', action.payload.name ? action.payload.name : ''),
              where('name', '<=', (action.payload.name ? action.payload.name : '') + '\uf8ff')] : []),

              ...(action.payload.email? [
                orderBy('email', 'asc'),
              where('email', '>=', action.payload.email ? action.payload.email : ''),
              where('email', '<=', (action.payload.email ? action.payload.email : '') + '\uf8ff')] : []),

              ...(action.payload.number ? [
                orderBy('number', 'asc'),
              where('number', '>=', action.payload.number ? action.payload.number : ''),
              where('number', '<=', (action.payload.number ? action.payload.number : '') + '\uf8ff')] : []),
            
            //StartsAt
            ...(action.payload.startsAt ? [
              where('completed_at', '>=', action.payload.startsAt ? action.payload.startsAt : ''),
            ] : []),

            //EndsAt
            ...(action.payload.endsAt ? [
              where('completed_at', '<=', action.payload.endsAt ? action.payload.endsAt : ''),
            ] : []),
            
            //OrderBy
            action.payload.orderBy ? action.payload.orderBySort ? orderBy(action.payload.orderBy,action.payload.orderBySort) : orderBy(action.payload.orderBy) : orderBy('completed_at', 'desc'),
            //Limit
            limit(action.payload.per_page ? action.payload.per_page : 25),
            )
            const queryDefinitionPending = query(
              collection(
                this.afs,
                (action.payload.collections_names ? action.payload.collections_names[0] : action.payload.stock_location_id ? `SPREE_ORDERS_${action.payload.stock_location_id}` : 'SPREE_ORDERS_'+this.ordersService.filters.stockLocationId),),
              
              
                orderBy("status"),
              where(
                  'status', '!=', 6
                ),
              ...(
                action.payload.name ? [
                  
                orderBy('name', 'asc'),
              where('name', '>=', action.payload.name ? action.payload.name : ''),
              where('name', '<=', (action.payload.name ? action.payload.name : '') + '\uf8ff')] : []),

              ...(action.payload.email? [
                orderBy('email', 'asc'),
              where('email', '>=', action.payload.email ? action.payload.email : ''),
              where('email', '<=', (action.payload.email ? action.payload.email : '') + '\uf8ff')] : []),

              ...(action.payload.number ? [
                orderBy('number', 'asc'),
              where('number', '>=', action.payload.number ? action.payload.number : ''),
              where('number', '<=', (action.payload.number ? action.payload.number : '') + '\uf8ff')] : []),
            
            //StartsAt
            ...(action.payload.startsAt ? [
              where('completed_at', '>=', action.payload.startsAt ? action.payload.startsAt : ''),
            ] : []),

            //EndsAt
            ...(action.payload.endsAt ? [
              where('completed_at', '<=', action.payload.endsAt ? action.payload.endsAt : ''),
            ] : []),
            
            //OrderBy
            action.payload.orderBy ? action.payload.orderBySort ? orderBy(action.payload.orderBy,action.payload.orderBySort) : orderBy(action.payload.orderBy) : orderBy('completed_at', 'desc'),
            //Limit
            limit(action.payload.per_page ? action.payload.per_page : 25),
            )
            const newObs = new Observable(observer => {
                onSnapshot(queryDefinitionPending,
                  ((snapshot:QuerySnapshot) => observer.next(snapshot)),
                  (error => observer.error(error.message))
                );
              });
            return newObs
        }),
        mergeMap((actions:any) => {
            const returnedActions = actions.docChanges().map((change:any) => {
              return {
                type: change.type,
                payload: change.doc.data()
              }  
            })
            return returnedActions
        }),
        map((action:any) => {
            this.store.dispatch(new JourneyQuery({
              orderId: action.payload.number,
            }))
            return { type: `[Orders] Order ${action.type}`, payload: action.payload }
        })
    ))
    constructor(private actions$: Actions, private afs: Firestore, private store:Store<BackofficeState>, private ordersService:OrdersService) {}
}