import axios from 'axios';
import { environment } from '../../environment/environment';
import { cartPromotions, Promotion, Rule } from '../../types/promotions/promotions';

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
}

export class Promotions{
    static deliveryPromotions:PromotionsResponse;
    
    static async  fetchAdvertisedPromotions(): Promise<Object> {
        const lomiPromotions = await axios.get(environment.lomiApiV1+"/promotions");
        return lomiPromotions.data
      }
    
    static async fetchPromotionsByCategoryName( promotionCategoryName:string ): Promise<Object> {
        const lomiPromotions = await axios.get(environment.lomiApiV1+"/promotions/availables?category="+promotionCategoryName)
        return lomiPromotions.data
      }

    static async fetchDeliveryPromotions() : Promise<PromotionsResponse>{
        let deliveryPromotions:any = await this.fetchPromotionsByCategoryName('Delivery Fee')
        return deliveryPromotions
    }

    static validateRuleOverCart(cart:Cart,rule:Rule) : boolean{
        if(rule.operator_min && rule.operator_max){
            const cartTotal:Number = parseInt(cart.total)
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
            nextPromotion.amountToReach = nextPromotion.rules[0].amount_min - parseInt(cart.total)
        }
        const cartPromotions:cartPromotions = {
            nextPromotion,
            currentDeliveryPromotion : filteredPromos.length ? filteredPromos[0] : null,
        }
        console.log(cartPromotions, filteredPromos, Promotions.deliveryPromotions)
        return cartPromotions
    }

}

