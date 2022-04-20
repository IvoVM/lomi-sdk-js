import { initSDK } from './lomi-sdk';

const OK_STATUS = 200;

describe('lomiSdk', () => {
  it('should work', async () => {
    expect(await initSDK()).toEqual(OK_STATUS);
  });

});
