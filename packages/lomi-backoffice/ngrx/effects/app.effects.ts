import { Injectable } from "@angular/core";
import { App } from "packages/lomi-backoffice/types/app";
import { map, Observable, switchMap } from "rxjs";
import {Actions, ofType, createEffect, act } from '@ngrx/effects';
import { collection } from "firebase/firestore";
import { collectionData, doc, Firestore, updateDoc } from "@angular/fire/firestore";
import { ADD_USER_RESOURCE, QUERY, USER_RESOURCE_ADDED } from "../actions/app.actions";
import { Action } from '@ngrx/store';
import { UserPrivelege, UserRol } from "packages/lomi-backoffice/types/user";
import { Resource } from "packages/lomi-backoffice/types/resources";

@Injectable()
export class AppEffects {

  addUserPrivilege = createEffect(() => this.actions$.pipe(
    ofType(ADD_USER_RESOURCE),
    switchMap((action: any) => {
      const document = doc(this.afs, 'backoffice-app/userRol');

      return updateDoc(document, {
        [action.payload.privilegeName] : {
          rolName : action.payload.privilegeName,
          id: action.payload.privilegeName,
          userPrivileges: [ action.payload.resourceId ],
          stockLocationId: parseInt(action.payload.resourceId.split("_")[action.payload.resourceId.split("_").length - 1]),
          resources : [ action.payload.resourceId ]
        }
      })
    }),
    map((action: any) => {
      return {
        type: USER_RESOURCE_ADDED,
        payload: action.payload
      }
    })
  ));

  query: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(QUERY),
      switchMap((action: any) => {
        const collectionBackofficeApp = collection(this.afs, 'backoffice-app');
        return collectionData(collectionBackofficeApp);
      }),
      map((app) => {
        return {
          type: '[App] Update Success',
          payload: {
            userPrivileges: Object.values(app[3]),
            userRols: Object.values(app[4] as Array<UserRol>),
            resources: Object.values(app[2] as Array<Resource>),
          }
        }
      })
      ),
  );

  constructor(private actions$: Actions, private afs:Firestore) {}

  }