import axios from 'axios';
import { io } from 'socket.io-client'
export let clientUrl:string = 'https://lomi.cl/'
export const socketIoClient = io('http://localhost:3000');

export async function changeClient(newUrl:string){
  clientUrl = newUrl;
}

export async function initSDK(): Promise<number> {
  const spreeResponse = await axios.get(clientUrl)
  return spreeResponse.status;
}