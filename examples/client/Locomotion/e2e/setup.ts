//@ts-nocheck
import dotenv from 'dotenv';
dotenv.config();
beforeAll(async () => {
  console.log(process.env);
  console.log(process.env.ONESIGNAL_APP_ID);
  console.log('before launch');
  await device.launchApp();
  console.log('after launch');
});
export {};