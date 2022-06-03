import { __awaiter } from "tslib";
import axios from 'axios';
export let clientUrl = 'https://lomi.cl/';
export function changeClient(newUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        clientUrl = newUrl;
    });
}
export function initSDK() {
    return __awaiter(this, void 0, void 0, function* () {
        const spreeResponse = yield axios.get(clientUrl);
        return spreeResponse.status;
    });
}
//# sourceMappingURL=lomi-sdk.js.map