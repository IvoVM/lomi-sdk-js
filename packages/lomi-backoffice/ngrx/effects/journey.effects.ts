import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { JourneysService } from "packages/lomi-backoffice/providers/lomi/journeys.service";
import { map, mergeMap, Observable, of, switchMap } from "rxjs";
import { JourneyQuery, JOURNEY_QUERY } from "../actions/journey.actions";

@Injectable()
export class JourneyEffects {
   
        query$: Observable<Action> = createEffect(() => 
        this.actions.pipe(
            ofType(JOURNEY_QUERY),
            mergeMap((action: JourneyQuery) => {
                const orderJourneysObserver = this.journeysService.selectJourneysFromFirebaseByOrderId(action.payload.orderId)
                return orderJourneysObserver
            }),
            map((journeys) => {
                return {
                    type: '[Journey] Updated',
                    payload: journeys
                }
            })
        ))

        constructor(
            private journeysService:JourneysService,
            private actions: Actions,
            
            ){
            return
        }
}