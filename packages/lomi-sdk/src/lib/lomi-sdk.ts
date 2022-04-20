import axios from 'axios';

export async function initSDK(): Promise<number> {
  const spreeResponse = await axios.get('https://lomi.cl')
  return spreeResponse.status;
}