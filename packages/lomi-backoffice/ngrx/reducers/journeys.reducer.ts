import { createEntityAdapter } from "@ngrx/entity"
import { Journey } from "packages/lomi-backoffice/types/orders"

export const initialState = {

}

export const journeysAdapter = createEntityAdapter<Journey>({})