import axios from 'axios';
import { cartPromotions, Promotion, Rule } from '../../types/promotions/promotions';
import { clientUrl } from '../lomi-sdk';

class Comparator{
    static use(prop:string) : Function {
        const context:any = this;
        if(context[prop]){
            return context[prop]
        } else {
            throw new Error("Comparation functon doesn't match any of the defined in the Comparator class.");
        }
    }

    static gt(leftValue:number, rightValue:number){
        return leftValue > rightValue
    }

    static gte(leftValue:number, rightValue:number){
        return leftValue >= rightValue
    }

    static lt(leftValue:number, rightValue:Number){
        return leftValue < rightValue
    }

    static lte(leftValue:number, rightValue:number){
        return leftValue <= rightValue
    }
}

export declare type PromotionsResponse = {
    status : string,
    promotions: Array<Promotion>
}



export declare type Cart = {
    total: string;
    display_total: string;
    ship_total:string
}

export class Promotions{
    static deliveryPromotions:PromotionsResponse;
    
    static async  fetchAdvertisedPromotions(): Promise<Object> {
        const lomiPromotions = await axios.get(clientUrl+"api/v1/promotions");
        return lomiPromotions.data
      }
    
    static async fetchPromotionsByCategoryName( promotionCategoryName:string ): Promise<Object> {
        const lomiPromotions = await axios.get(clientUrl+"api/v1/promotions/availables?category="+promotionCategoryName)
        return lomiPromotions.data
      }

    static async fetchDeliveryPromotions() : Promise<PromotionsResponse>{
        let deliveryPromotions:any = await this.fetchPromotionsByCategoryName('Delivery Fee')
        deliveryPromotions.promotions = deliveryPromotions.promotions.filter((deliveryPromotion:Promotion)=>{
            return (deliveryPromotion.rules.length && deliveryPromotion.rules[0].amount_max) && !(deliveryPromotion.expires_at && new Date(deliveryPromotion.expires_at).getTime() < new Date().getTime())
        })
        return deliveryPromotions
    }

    static validateRuleOverCart(cart:Cart,rule:Rule) : boolean{
        if(rule.operator_min && rule.operator_max){
            const cartTotal:Number = +cart.total - +cart.ship_total
            return Comparator.use(rule.operator_max)(cartTotal, rule.amount_max) && Comparator.use(rule.operator_min)(cartTotal, rule.amount_min)
        }
        return true
    }
    
    static async sortPromotionsByMaxAmountOfFirstRule(){
        Promotions.deliveryPromotions.promotions.sort((promotion1:Promotion, promotion2:Promotion)=>{
            const firstRule1:Rule = promotion1.rules[0]
            const firstRule2:Rule = promotion2.rules[0]
            return firstRule1.amount_min - firstRule2.amount_min
        })
    }

    static async getPromotionsOfCart(cart:Cart, withBuffer = true) : Promise<Object>{
        if(!withBuffer || !Promotions.deliveryPromotions){
            Promotions.deliveryPromotions = await this.fetchDeliveryPromotions();
            Promotions.sortPromotionsByMaxAmountOfFirstRule();
        }
        const filteredPromos = []
        let nextPromotion = null;
        for( var promotion in Promotions.deliveryPromotions.promotions){
            let isValid = true;
            Promotions.deliveryPromotions.promotions[promotion].rules.forEach((rule)=>{
                isValid = Promotions.validateRuleOverCart(cart,rule);
            })
            if(isValid){
                filteredPromos.push(Promotions.deliveryPromotions.promotions[promotion])
                if(parseInt(promotion) < Promotions.deliveryPromotions.promotions.length - 1){
                    nextPromotion = Promotions.deliveryPromotions.promotions[ parseInt(promotion) + 1 ];
                }
            }
        }
        nextPromotion = filteredPromos.length ? nextPromotion : Promotions.deliveryPromotions.promotions.length ? Promotions.deliveryPromotions.promotions[0] : null
        if(nextPromotion){
            nextPromotion.amountToReach = nextPromotion.rules[0].amount_min - +cart.total + +cart.ship_total
        }
        const cartPromotions:cartPromotions = {
            nextPromotion,
            currentDeliveryPromotion : filteredPromos.length ? filteredPromos[0] : null,
        }
        return cartPromotions
    }

}

