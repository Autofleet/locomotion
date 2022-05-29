/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import { userRepo } from '../../repositories';
import Twilio from '../services/Twilio';

const {
  AUTH_ACCESS_SECRET_KEY,
  AUTH_REFRESH_SECRET_KEY,
  AUTH_ACCESS_TOKEN_LIFETIME,
  AUTH_REFRESH_TOKEN_LIFETIME,
  VERIFICATION_BYPASS_CODE,
} = process.env;

export const createToken = async (payload, type = 'accessToken') => {
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
};

export const refreshValidator = async (refreshToken) => {
  let userPayload;
  try {
    userPayload = jwt.verify(refreshToken, AUTH_REFRESH_SECRET_KEY);
  } catch (e) {
    throw new Error('Refresh token is not valid');
  }

  const foundUser = await userRepo.findByRefreshTokenId(userPayload.jti);
  return foundUser;
};

export const send = async (phoneNumber: string, operationId: string): Promise<boolean> => {
  const [user] = await userRepo.findOrCreate(phoneNumber, operationId);

  if (user) {
    await Twilio.getInstance().send(phoneNumber);
    return true;
  }

  return false;
};

export const verify = (phoneNumber, externalCode) => {
  if (VERIFICATION_BYPASS_CODE && externalCode === VERIFICATION_BYPASS_CODE) {
    return true;
  }

  return Twilio.getInstance().verify(phoneNumber, externalCode);
};
