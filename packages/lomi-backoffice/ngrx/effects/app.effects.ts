import { Injectable } from "@angular/core";
import { App } from "packages/lomi-backoffice/types/app";
import { map, Observable, switchMap } from "rxjs";
import {Actions, ofType, createEffect } from '@ngrx/effects';
import { collection } from "firebase/firestore";
import { collectionData, Firestore } from "@angular/fire/firestore";
import { QUERY } from "../actions/app.actions";
import { Action } from '@ngrx/store';
import { UserPrivelege, UserRol } from "packages/lomi-backoffice/types/user";

@Injectable()
export class AppEffects {

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
          }
        }
      })
      ),
  );

  constructor(private actions$: Actions, private afs:Firestore) {}

  }