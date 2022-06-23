import * as functions from "firebase-functions";
const { Client } = require('pg')
const client = new Client()


exports.scheduledFunction = functions.pubsub.schedule('every minute').onRun(async (context:any) => {
    await client.connect()
    console.log('This will be run every minute');
    return null;
  });