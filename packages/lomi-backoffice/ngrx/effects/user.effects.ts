import { Injectable }                 from '@angular/core';
import { Store }                      from '@ngrx/store';
import {Actions, ofType, createEffect }            from '@ngrx/effects';


import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, from, lastValueFrom } from 'rxjs';
import { delay, map, mergeMap, switchMap, take, takeLast }   from 'rxjs/operators';

import {IUser, User} from '../../types/user';
import {UsersQuery} from '../reducers/user.reducer';
import firebase from 'firebase/compat/app';

import * as userActions from '../actions/user.actions';
import { BackofficeState } from '..';
import { defer } from 'rxjs';
import { Route, Router } from '@angular/router';
import { collectionData, doc, Firestore, startAt, setDoc } from '@angular/fire/firestore';
import { docSnapshots } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
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
                switchMap(user => {
                    if(user){
                        this.store.dispatch(new userActions.Authenticated({
                            uid: user.uid,
                            email: user.email,
                        }));
                        const userDoc = doc(this.afs,`backoffice-users/${user.uid}`)
                        docSnapshots(userDoc).pipe(take(1)).subscribe(async (doc) => {
                            if(!doc.exists()){
                                console.log("Doc doesnt exist")
                                await setDoc(userDoc,{
                                    id: user.uid,
                                    uid: user.uid,
                                    email: user.email,
                                }, {merge:true} )
                            }
                        })
                        return docSnapshots(userDoc)
                    } else {
                        return of(null)
                    }
                }),
                map( (userDocSnapshot) => {
                    if(this.router.url === '/auth'){
                        this.router.navigateByUrl('/')
                    }
                    if (userDocSnapshot?.exists()) {
                       /// User logged in
                       const user = userDocSnapshot.data() as IUser;
                       if( user.stockLocationId && user.stockLocationId > 0){
                           localStorage.setItem('stockLocationId', user.stockLocationId.toString())
                 
                       }
                       if(!user.userRol){
                            this.router.navigateByUrl("user-without-rol")
                       }
                       else if(user.userRol && this.router.url.includes("user-without-rol")){
                           this.router.navigateByUrl("/")
                        }
                        localStorage.setItem("userRol", user.userRol.toString())
                       return new userActions.UserUpdated(user);
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
  stockLocations = []
  private getStockLocations() {
    return new Promise((resolve, reject) => {
      this.http.get('https://lomi.cl/api/v2/storefront/stock_locations').subscribe((data:any)=>{
        this.stockLocations = data.data
        localStorage.setItem('stockLocations', JSON.stringify(data.data))
        console.log(data.data, "data.data")
        resolve(data.data)
      })
    })
  }

  constructor(
      private actions$: Actions,
      private store: Store<BackofficeState>,
      private afAuth: AngularFireAuth,
      private router: Router,
      private afs: Firestore,
      private http: HttpClient
  ) {
    this.getStockLocations().then((data:any)=>{
        console.log(this.stockLocations)
    })
  }

  /**
   *
   */
  login() : Observable<IUser> {
    this.store.dispatch(new userActions.GoogleLogin());
    return this.user$;
  }

  /**
   *
   */
  logout() : Observable<IUser> {
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