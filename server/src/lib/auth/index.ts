/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import Nexmo from '../nexmo';
// const Nexmo = require('../nexmo');
import { User, Verification } from '../../models';
import userService from '../user';

const {
  AUTH_ACCESS_SECRET_KEY,
  AUTH_REFRESH_SECRET_KEY,
  AUTH_ACCESS_TOKEN_LIFETIME,
  AUTH_REFRESH_TOKEN_LIFETIME,
  VERIFICATION_BYPASS_CODE,
} = process.env;

class Auth {
  user: any;

  verification: any;

  nexmo: any;

  constructor(userModel = User, verificationModel = Verification) {
    this.user = userModel;
    this.verification = verificationModel;
    this.nexmo = Nexmo;
  }

  async createToken(payload, type = 'accessToken') {
    const jwtid = shortid.generate();
    let expiresIn = AUTH_ACCESS_TOKEN_LIFETIME || 10000;
    let authToken = AUTH_ACCESS_SECRET_KEY || '1234';

    if (type === 'refreshToken') {
      authToken = AUTH_REFRESH_SECRET_KEY || '5678';
      expiresIn = AUTH_REFRESH_TOKEN_LIFETIME || 1000000;
    }

    const token = jwt.sign(payload, authToken, {
      expiresIn,
      jwtid,
    });

    return { jwtid, token };
  }

  async refreshValidator(refreshToken) {
    let userPayload;
    try {
      userPayload = jwt.verify(refreshToken, AUTH_REFRESH_SECRET_KEY);
    } catch (e) {
      throw new Error('Refresh token is not valid');
    }

    const foundUser = await userService.findByRefreshTokenId(userPayload.jti);
    return foundUser;
  }

  async createVerificationCode(phoneNumber, operationId) {
    const user = await this.user.findOrCreate({
      where: { phoneNumber, operationId },
      defaults: { phoneNumber, operationId },
    });

    const operation = {
      name: 'Locomotion',
    }; // TODO should get from operations settings when ready

    const externalCode = `${Math.round(Math.random() * 9999)}0000`.substring(0, 4);

    if (user) {
      await this.nexmo.sendSms(phoneNumber, `Your ${operation.name} code is ${externalCode}`);

      await this.verification.destroy({
        where: { phoneNumber },
      });

      const verification = await this.verification.create({
        phoneNumber,
        externalCode,
        operationId,
      });

      return verification;
    }

    return false;
  }

  async checkVerificationCode(phoneNumber, externalCode, operationId) {
    const verification = await this.verification.findOne({ where: { phoneNumber, externalCode, operationId } });

    if (verification) {
      await verification.destroy();
      return true;
    }

    if (VERIFICATION_BYPASS_CODE && externalCode === VERIFICATION_BYPASS_CODE) {
      return true;
    }

    return false;
  }
}

export default new Auth();