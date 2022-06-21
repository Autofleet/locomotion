beforeAll(async () => {
  console.log('before launch');
  await device.launchApp();
  console.log('after launch');
});
