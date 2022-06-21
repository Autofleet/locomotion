describe('Detox Demo', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
    console.log('hello');
    });
  
    it('should have header with  title Detox Demo', async () => {
    console.log('hello');
      await expect(element(by.id('demo-header'))).toBeVisible();
      await expect(element(by.id('demo-header'))).toHaveText('Detox Demo');
    });
  });