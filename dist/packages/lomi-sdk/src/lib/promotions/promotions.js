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
            console.error("No operator matching", prop);
            return () => {
                return false;
            };
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
            return yield this.fetchPromotionsByCategoryName('Delivery Fee');
        });
    }
    static validateRuleOverCart(cart, rule) {
        if (rule.operator_min && rule.operator_max) {
            const cartTotal = parseInt(cart.total);
            return Comparator.use(rule.operator_max)(cartTotal, rule.amount_max) && Comparator.use(rule.operator_min)(cartTotal, rule.amount_min);
        }
        return true;
    }
    static getPromotionsOfCart(cart) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let deliveryPromotions = yield this.fetchDeliveryPromotions();
            const filteredPromos = deliveryPromotions.promotions.filter((promotion) => {
                let isValid = true;
                promotion.rules.forEach((rule) => {
                    isValid = Promotions.validateRuleOverCart(cart, rule);
                });
                return isValid;
            });
            return filteredPromos;
        });
    }
}
exports.Promotions = Promotions;
//# sourceMappingURL=promotions.js.map