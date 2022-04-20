import axios from 'axios';
import { environment } from '../../environment/environment';

class Comparator{
    static use(prop:string) : Function {
        const context:any = this;
        if(context[prop]){
            return context[prop]
        } else {
            console.error("No operator matching", prop)
            return () => {
                return false;
            }
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

export declare type Promotion = {
    catergory_name: string,
    name: string,
    actions : Array<any>
    rules: Array<any>
}

export declare type Rule = {
    amount_min : Number,
    amount_max : Number,
    operator_min : string,
    operator_max : string
}

export declare type Cart = {
    total: string;
    display_total: string;
}

export class Promotions{    
    
    static async  fetchAdvertisedPromotions(): Promise<Object> {
        const lomiPromotions = await axios.get(environment.lomiApiV1+"/promotions");
        return lomiPromotions.data
      }      
    
    static async fetchPromotionsByCategoryName( promotionCategoryName:string ): Promise<Object> {
        const lomiPromotions = await axios.get(environment.lomiApiV1+"/promotions/availables?category="+promotionCategoryName)
        return lomiPromotions.data
      }

    static async fetchDeliveryPromotions() : Promise<Object>{
        let deliveryPromotions:any = await this.fetchPromotionsByCategoryName('Delivery Fee')
        return await this.fetchPromotionsByCategoryName('Delivery Fee')
    }

    static validateRuleOverCart(cart:Cart,rule:Rule) : boolean{
        if(rule.operator_min && rule.operator_max){
            const cartTotal:Number = parseInt(cart.total)
            return Comparator.use(rule.operator_max)(cartTotal, rule.amount_max) && Comparator.use(rule.operator_min)(cartTotal, rule.amount_min)
        }
        return true
    }

    static async getPromotionsOfCart(cart:Cart) : Promise<Array<Object>>{
        let deliveryPromotions : any = await this.fetchDeliveryPromotions();
        const filteredPromos = deliveryPromotions.promotions.filter((promotion:Promotion)=>{
            let isValid = true;
            promotion.rules.forEach((rule)=>{
                isValid = Promotions.validateRuleOverCart(cart,rule);
            })
            return isValid
        })
        return filteredPromos
    }

}

