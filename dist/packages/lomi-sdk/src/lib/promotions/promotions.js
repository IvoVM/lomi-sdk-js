"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotions = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const environment_1 = require("../../environment/environment");
class Comparator {
    static use(prop) {
        const context = this;
        if (context[prop]) {
            return context[prop];
        }
        else {
            throw new Error("Comparation functon doesn't match any of the defined in the Comparator class.");
        }
    }
    static gt(leftValue, rightValue) {
        return leftValue > rightValue;
    }
    static gte(leftValue, rightValue) {
        return leftValue >= rightValue;
    }
    static lt(leftValue, rightValue) {
        return leftValue < rightValue;
    }
    static lte(leftValue, rightValue) {
        return leftValue <= rightValue;
    }
}
class Promotions {
    static fetchAdvertisedPromotions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lomiPromotions = yield axios_1.default.get(environment_1.environment.lomiApiV1 + "/promotions");
            return lomiPromotions.data;
        });
    }
    static fetchPromotionsByCategoryName(promotionCategoryName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lomiPromotions = yield axios_1.default.get(environment_1.environment.lomiApiV1 + "/promotions/availables?category=" + promotionCategoryName);
            return lomiPromotions.data;
        });
    }
    static fetchDeliveryPromotions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let deliveryPromotions = yield this.fetchPromotionsByCategoryName('Delivery Fee');
            return deliveryPromotions;
        });
    }
    static validateRuleOverCart(cart, rule) {
        if (rule.operator_min && rule.operator_max) {
            const cartTotal = parseInt(cart.total);
            return Comparator.use(rule.operator_max)(cartTotal, rule.amount_max) && Comparator.use(rule.operator_min)(cartTotal, rule.amount_min);
        }
        return true;
    }
    static sortPromotionsByMaxAmountOfFirstRule() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            Promotions.deliveryPromotions.promotions.sort((promotion1, promotion2) => {
                const firstRule1 = promotion1.rules[0];
                const firstRule2 = promotion2.rules[0];
                return firstRule1.amount_min - firstRule2.amount_min;
            });
        });
    }
    static getPromotionsOfCart(cart, withBuffer = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!withBuffer || !Promotions.deliveryPromotions) {
                Promotions.deliveryPromotions = yield this.fetchDeliveryPromotions();
                Promotions.sortPromotionsByMaxAmountOfFirstRule();
            }
            const filteredPromos = [];
            let nextPromotion = null;
            for (var promotion in Promotions.deliveryPromotions.promotions) {
                let isValid = true;
                Promotions.deliveryPromotions.promotions[promotion].rules.forEach((rule) => {
                    isValid = Promotions.validateRuleOverCart(cart, rule);
                });
                if (isValid) {
                    filteredPromos.push(Promotions.deliveryPromotions.promotions[promotion]);
                    if (parseInt(promotion) < Promotions.deliveryPromotions.promotions.length - 1) {
                        nextPromotion = Promotions.deliveryPromotions.promotions[parseInt(promotion) + 1];
                    }
                }
            }
            nextPromotion = filteredPromos.length ? nextPromotion : Promotions.deliveryPromotions.promotions.length ? Promotions.deliveryPromotions.promotions[0] : null;
            if (nextPromotion) {
                nextPromotion.amountToReach = nextPromotion.rules[0].amount_min - parseInt(cart.total);
            }
            const cartPromotions = {
                nextPromotion,
                currentDeliveryPromotion: filteredPromos.length ? filteredPromos[0] : null,
            };
            return cartPromotions;
        });
    }
}
exports.Promotions = Promotions;
//# sourceMappingURL=promotions.js.map