"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSDK = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
function initSDK() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const spreeResponse = yield axios_1.default.get('https://lomi.cl');
        return spreeResponse.status;
    });
}
exports.initSDK = initSDK;
//# sourceMappingURL=lomi-sdk.js.map