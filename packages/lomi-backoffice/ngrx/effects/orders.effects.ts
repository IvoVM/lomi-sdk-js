import {Injectable} from '@angular/core';
import {Effect, Actions, ofType, createEffect} from '@ngrx/effects';
import { BackofficeState } from '..';
import { collectionData, Firestore, startAt } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { map, mergeMap, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { ADDED, Query, QUERY, QUERY_SUCCESS } from '../actions/orders.actions';

@Injectable()
export class OrderEffects {
    
    query$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(QUERY),
        switchMap((action: Query) => {
            return collectionData(query(collection(this.afs,`SPREE_ORDERS_${action.payload.stock_location_id}`),

            //OrderBy
            action.payload.orderBy ? action.payload.orderBySort ? orderBy(action.payload.orderBy,action.payload.orderBySort) : orderBy(action.payload.orderBy) : orderBy('completed_at', 'desc'),
            
            //Limit
            limit(action.payload.per_page ? action.payload.per_page : 25),

            ))
        }),
        mergeMap((actions:any) => actions),
        map((action:any) => {
            return { type: ADDED, payload: action }
        })
    ))
    constructor(private actions$: Actions, private afs: Firestore) {}

    /**
    //OrderBy
    action.payload.orderBy ? 
    action.payload.orderBySort ? 
        orderBy(action.payload.orderBy, action.payload.orderBySort) : 
        orderBy(action.payload.orderBy) 
    : orderBy('created_at', 'desc'),

    //Limit
    action.payload.per_page ? limit(action.payload.per_page) : limit(25),

    //Pagination
    startAt(action.payload.page ? action.payload.page * (action.payload.per_page ? action.payload.per_page : 25) : 0)
    */
}