"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const axios_1 = require("axios");
const { Client } = require('pg');
const client = new Client();
exports.scheduledFunction = functions.pubsub.schedule('every minute').onRun(async (context) => {
    await client.connect();
    console.log('This will be run every minute');
    axios_1.default.get('https://lomi.cl/');
    return null;
});
//# sourceMappingURL=index.js.map