import { Injectable }                 from '@angular/core';
import { Store }                      from '@ngrx/store';
import {Actions, ofType, createEffect }            from '@ngrx/effects';


import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, from } from 'rxjs';
import { delay, map, mergeMap, switchMap }   from 'rxjs/operators';

import {User} from '../../types/user';
import {UsersQuery} from '../reducers/user.reducer';
import firebase from 'firebase/compat/app';

import * as userActions from '../actions/user.actions';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BackofficeState } from '..';
import { defer } from 'rxjs';
import { Route, Router } from '@angular/router';
type Action = userActions.All;


@Injectable()
export class UserEffects {

  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************

  user$ = this.store.select(UsersQuery.getUser);

  // ************************************************
  // Effects to be registered at the Module level
  // ************************************************

getUser$: Observable<Action> = createEffect(() => this.actions$.pipe(
                ofType(userActions.GET_USER),
                map((action: userActions.GetUser) => action.payload ),
                switchMap(payload => this.afAuth.authState ),
                map( (authData) => {
                   if (authData) {
                       /// User logged in
                       const user = new User(authData.uid, authData.displayName as any);
                       this.router.navigateByUrl('/')
                       return new userActions.Authenticated(user);
                   } else {
                       /// User not logged in
                       return new userActions.NotAuthenticated();
                   }

               }))
  )


    /**
     * Login with Google OAuth
     */
    login$: Observable<Action> = createEffect(() => this.actions$.pipe(
                ofType(userActions.GOOGLE_LOGIN),
                 map((action: userActions.GoogleLogin) => action.payload),
                 switchMap(payload => {

                     return from( this.googleLogin() );
                 }),
                 map( credential => {
                     // successful login
                     return new userActions.GetUser();
                 })
     ))


     logout$: Observable<Action> = createEffect(()=>
             this.actions$.pipe(
               ofType(userActions.LOGOUT),
                map((action: userActions.Logout) => action.payload ),
                switchMap(payload => {
                    return of( this.afAuth.signOut() );
                }),
                map( authData => {
                    this.router.navigateByUrl("/auth")
                    return new userActions.NotAuthenticated();
    })
            )
     )      

      init$: Observable<any> = createEffect(() => this.actions$.pipe(
        ofType("@ngrx/effects/init"),
        map((action: any) => {
            return new userActions.GetUser()
        }),
      )
      );

  // ************************************************
  // Internal Code
  // ************************************************

  constructor(
      private actions$: Actions,
      private store: Store<BackofficeState>,
      private afAuth: AngularFireAuth,
      private router: Router,
      private db: AngularFireDatabase
  ) { }

  /**
   *
   */
  login() : Observable<User> {
    this.store.dispatch(new userActions.GoogleLogin());
    return this.user$;
  }

  /**
   *
   */
  logout() : Observable<User> {
    this.store.dispatch(new userActions.Logout());
    return this.user$;
  }

  // ******************************************
  // Internal Methods
  // ******************************************


  protected googleLogin(): Promise<any> {
       const provider = new firebase.auth.GoogleAuthProvider();
       return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
   }

}