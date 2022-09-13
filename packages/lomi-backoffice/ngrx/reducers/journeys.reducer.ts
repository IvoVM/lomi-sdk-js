import { createEntityAdapter, EntityState } from "@ngrx/entity"
import { Journey } from "packages/lomi-backoffice/types/orders"


export interface State extends EntityState<Journey> {
    loading: boolean
}

export const journeysAdapter = createEntityAdapter<Journey>({})

export const initialState = journeysAdapter.getInitialState({
    loading: false
})

export function reducer(
    state = initialState,
    action: any,
    ):State {
    switch (action.type) {
        case '[Journey] Updated':
            return { ...journeysAdapter.addMany(action.payload, state), loading:false }
        default:
            return state
    }
}