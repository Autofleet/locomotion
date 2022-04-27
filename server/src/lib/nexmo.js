const Promise = require('bluebird');
const Nexmo = require('nexmo');

Nexmo.CHECK_STATUS_SUCSSES = '0';

class NexmoService {
  constructor() {
    this.virtualNumber = process.env.NEXMO_VIRTUAL_NUMBER;

    this.nexmo = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET,
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

module.exports = new NexmoService();
