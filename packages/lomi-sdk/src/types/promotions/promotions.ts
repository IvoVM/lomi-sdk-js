
export declare type promotion = {
    actions?: Array<string>
    category_name?: string
    code?: number
    description?: string
    expires_at?: Date
    img?: string
    name: String
    path?: String
    rules?: Array<rule>
    starts_at?: Date
}

export declare type rule = {
    amount_min : Number,
    amount_max : Number,
    operator_min : string,
    operator_max : string
}

export declare type cartPromotions = {
    currentDeliveryPromotion : promotion | null
    currentPromotions? : Array<promotion>
    nextPromotion : promotion | null
}