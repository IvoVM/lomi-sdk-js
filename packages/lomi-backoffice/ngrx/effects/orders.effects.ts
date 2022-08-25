import {Injectable} from '@angular/core';
import {Effect, Actions, ofType, createEffect} from '@ngrx/effects';
import { BackofficeState } from '..';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { map, mergeMap, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { ADDED, QUERY, QUERY_SUCCESS } from '../actions/orders.actions';

@Injectable()
export class OrderEffects {
    
    query$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(QUERY),
        switchMap((action: any) => {
            return collectionData(query(collection(this.afs,"SPREE_ORDERS_1"),
            orderBy('completed_at', 'desc'),
            limit(25)
            ))
        }),
        mergeMap((actions:any) => actions),
        map((action:any) => {
            return { type: ADDED, payload: action }
        })
    ))
    constructor(private actions$: Actions, private afs: Firestore) {}
}

