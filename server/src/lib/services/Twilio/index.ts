/* eslint-disable no-param-reassign */
import { Twilio } from 'twilio';
import logger from '../../../logger';

require('dotenv');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const formatPhoneNumber = (phone: string): string => (phone.includes('+') ? phone : `+${phone}`);
class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(accountSid, authToken);
  }

  send = async (phoneNumber: string, channel = 'sms') => {
    phoneNumber = formatPhoneNumber(phoneNumber);
    await this.client.verify.services(serviceId)
      .verifications
      .create({ to: phoneNumber, channel });
  };

  verify = async (phoneNumber: string, code: string) => {
    phoneNumber = formatPhoneNumber(phoneNumber);
    try {
      const { valid } = await this.client.verify.services(serviceId)
        .verificationChecks
        .create({ to: phoneNumber, code });
      return valid;
    } catch (e) {
      logger.error('error while trying verify code', {
        error: e,
        phoneNumber,
        code,
      });
      return false;
    }
  };
}

export default new TwilioService();
