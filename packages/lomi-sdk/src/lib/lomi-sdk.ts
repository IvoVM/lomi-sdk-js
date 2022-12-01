import axios from 'axios';
export let clientUrl:string = 'https://lomi.cl/'

export async function changeClient(newUrl:string){
  clientUrl = newUrl;
}

export async function initSDK(): Promise<number> {
  const spreeResponse = await axios.get(clientUrl)
  return spreeResponse.status;
}