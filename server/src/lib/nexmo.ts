import Promise from 'bluebird';
import Nexmo from 'nexmo';

Nexmo.CHECK_STATUS_SUCSSES = '0';

class NexmoService {
  virtualNumber: string;
  nexmo: any;
  constructor() {
    this.virtualNumber = process.env.NEXMO_VIRTUAL_NUMBER;

    this.nexmo = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY || 'mockKey',
      apiSecret: process.env.NEXMO_API_SECRET || 'mockSecret',
    });
  }

  sendSms(phoneNumber, text) {
    return new Promise((resolve, reject) => this.nexmo.message.sendSms(
      this.virtualNumber,
      phoneNumber,
      text,
      (err, response) => {
        if (err) {
          reject(err);
        }

        resolve(response);
      },
    ));
  }
}

export default new NexmoService();
