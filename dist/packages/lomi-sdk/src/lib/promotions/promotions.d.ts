export declare type PromotionsResponse = {
    status: string;
    promotions: Array<Promotion>;
};
export declare type Promotion = {
    catergory_name: string;
    name: string;
    actions: Array<any>;
    rules: Array<any>;
};
export declare type Rule = {
    amount_min: Number;
    amount_max: Number;
    operator_min: string;
    operator_max: string;
};
export declare type Cart = {
    total: string;
    display_total: string;
};
export declare class Promotions {
    static fetchAdvertisedPromotions(): Promise<Object>;
    static fetchPromotionsByCategoryName(promotionCategoryName: string): Promise<Object>;
    static fetchDeliveryPromotions(): Promise<Object>;
    static validateRuleOverCart(cart: Cart, rule: Rule): boolean;
    static getPromotionsOfCart(cart: Cart): Promise<Array<Object>>;
}
