/* eslint-disable class-methods-use-this */
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

const Nexmo = require('../nexmo');
const { User, Verification } = require('../../models');
const userService = require('../../lib/user');

const {
  AUTH_ACCESS_SECRET_KEY,
  AUTH_REFRESH_SECRET_KEY,
  AUTH_ACCESS_TOKEN_LIFETIME,
  AUTH_REFRESH_TOKEN_LIFETIME,
} = process.env;


class Auth {
  constructor(userModel = User, verificationModel = Verification) {
    this.user = userModel;
    this.verification = verificationModel;
    this.nexmo = Nexmo;
  }

  async createToken(payload, type = 'accessToken') {
    const jwtid = shortid.generate();
    let expiresIn = AUTH_ACCESS_TOKEN_LIFETIME;
    let authToken = AUTH_ACCESS_SECRET_KEY;

    if (type === 'refreshToken') {
      authToken = AUTH_REFRESH_SECRET_KEY;
      expiresIn = AUTH_REFRESH_TOKEN_LIFETIME;
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


  async createVerificationCode(phoneNumber) {
    const user = await this.user.findOrCreate({
      where: { phoneNumber },
      defaults: { phoneNumber },
    });

    const externalCode = `${Math.round(Math.random() * 9999)}0000`.substring(0, 4);

    if (user) {
      await this.nexmo.sendSms(phoneNumber, `Your verifiction code is ${externalCode}`);

      await this.verification.destroy({
        where: { phoneNumber },
      });

      const verification = await this.verification.create({
        phoneNumber,
        externalCode,
      });

      return verification;
    }

    return false;
  }

  async checkVerificationCode(phoneNumber, externalCode) {
    const verification = await this.verification.findOne({ where: { phoneNumber, externalCode } });

    if (verification) {
      await verification.destroy();
      return true;
    }

    return false;
  }
}

module.exports = new Auth();
