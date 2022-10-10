import * as actions from '../actions/app.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createFeatureSelector, createSelector, select } from "@ngrx/store";
import { EntitySelectorsFactory } from "@ngrx/data";
import { filter, pipe } from "rxjs";
import { CHANGE_STOCK_LOCATION } from "../actions/app.actions";
import { App } from 'packages/lomi-backoffice/types/app';

const initialState:App = {
    userPrivileges: [],
    userRols: [],
    resources: [],
    selectedStockLocationId: 0,
}

export function reducer(
    state: App =  initialState,
    action: any,
    ):App {
    switch (action.type) {
        case (actions.UPDATE_SUCCESS): 
            return  action.payload
            
        default:
            return state
    }
}