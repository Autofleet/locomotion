import { Twilio } from 'twilio';
import logger from '../../../logger';

require('dotenv');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(accountSid, authToken);
  }

  send = async (phoneNumber, channel = 'sms') => {
    await this.client.verify.services(serviceId)
      .verifications
      .create({ to: phoneNumber, channel });
  };

  verify = async (phoneNumber, code) => {
    try {
      const { valid } = await this.client.verify.services(serviceId)
        .verificationChecks
        .create({ to: phoneNumber, code });
      return valid;
    } catch (e) {
      logger.error('error while trying verify code', {
        error: e,
      });
      return false;
    }
  };
}

export default new TwilioService();
