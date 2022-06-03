export declare type Promotion = {
    actions?: Array<string>;
    category_name?: string;
    code?: number;
    description?: string;
    expires_at?: string;
    img?: string;
    name: String;
    path?: String;
    rules: Array<Rule>;
    starts_at?: Date;
    amountToReach?: number;
};
export declare type Rule = {
    amount_min: number;
    amount_max: number;
    operator_min: string;
    operator_max: string;
};
export declare type cartPromotions = {
    currentDeliveryPromotion: Promotion | null;
    currentPromotions?: Array<Promotion>;
    nextPromotion: Promotion | null;
};
