import {Injectable} from '@angular/core';
import {Effect, Actions, ofType, createEffect} from '@ngrx/effects';
import { BackofficeState } from '..';
import { collectionData, doc, Firestore, startAt } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { collection, limit, onSnapshot, orderBy, query, QuerySnapshot, setDoc, updateDoc, where } from 'firebase/firestore';
import { map, mergeMap, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { ADDED, Query, QUERY, QUERY_SUCCESS } from '../actions/users.actions';
import { snapshotChanges } from '@angular/fire/compat/database';

@Injectable()
export class UsersEffects {
    
    query$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(QUERY),
        switchMap((action: Query) => {
            console.log("wgere", 'stockLocationId', '==', action.payload.stock_location_id ? action.payload.stock_location_id : '')
            let queryDefinition = query(
              collection(this.afs,`backoffice-users`),
              ...(action.payload.name ? [orderBy('name', 'asc'),
              where('name', '>=', action.payload.name ? action.payload.name : ''),
              where('name', '<=', (action.payload.name ? action.payload.name : '') + '\uf8ff')] : []),
              ...(action.payload.email ? [orderBy('name', 'asc'),
              where('name', '>=', action.payload.email ? action.payload.email: ''),
              where('name', '<=', (action.payload.email ? action.payload.email : '') + '\uf8ff')] : []),
            //Limit
            limit(action.payload.per_page ? action.payload.per_page : 100),
            )
            if(action.payload.stock_location_id && action.payload.stock_location_id != -1){
                queryDefinition = query(
                    collection(this.afs,`backoffice-users`),
                    ...(action.payload.name ? [orderBy('name', 'asc'),
                    where('name', '>=', action.payload.name ? action.payload.name : ''),
                    where('name', '<=', (action.payload.name ? action.payload.name : '') + '\uf8ff')] : []),
                    ...(action.payload.email ? [orderBy('name', 'asc'),
                    where('name', '>=', action.payload.email ? action.payload.email: ''),
                    where('name', '<=', (action.payload.email ? action.payload.email : '') + '\uf8ff')] : []),
                    where('stockLocationId', '==', action.payload.stock_location_id),
                  //Limit
                  limit(action.payload.per_page ? action.payload.per_page : 100),
                  )
            }
            const newObs = new Observable(observer => {
                return onSnapshot(queryDefinition,
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
            return { type: `[Users] User ${action.type}`, payload: action.payload }
        })
    ))

    updateUser: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType('[Users] Update'),
        switchMap((action: any) => {
            const { uid, changes } = action;
            return updateDoc(doc(this.afs, `backoffice-users/${uid}`), changes);
        }),
        map((res:any)=>{
            if(res){
                return { type: '[Users] User modified' , payload: {
                    uid: res.uid,
                    changes: res.changes
                }}
            } else {
                return { type: '[Users] User not modified' }
            }
        })
    ))

    constructor(private actions$: Actions, private afs: Firestore) {}
}