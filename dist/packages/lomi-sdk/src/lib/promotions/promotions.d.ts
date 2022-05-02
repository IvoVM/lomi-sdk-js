import { Promotion, Rule } from '../../types/promotions/promotions';
export declare type PromotionsResponse = {
    status: string;
    promotions: Array<Promotion>;
};
export declare type Cart = {
    total: string;
    display_total: string;
};
export declare class Promotions {
    static deliveryPromotions: PromotionsResponse;
    static fetchAdvertisedPromotions(): Promise<Object>;
    static fetchPromotionsByCategoryName(promotionCategoryName: string): Promise<Object>;
    static fetchDeliveryPromotions(): Promise<PromotionsResponse>;
    static validateRuleOverCart(cart: Cart, rule: Rule): boolean;
    static sortPromotionsByMaxAmountOfFirstRule(): Promise<void>;
    static getPromotionsOfCart(cart: Cart, withBuffer?: boolean): Promise<Object>;
}
