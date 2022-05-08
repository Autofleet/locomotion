import app from '../../app';
import { User, Verification } from '../../models';

const request = require('supertest');
const uuid = require('uuid');

jest.mock('../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

const baseUrl = '/api/v1';

export default async () => {
  const operationId = uuid.v4();
  await User.create({
    phoneNumber: '972501234567', firstName: 'GUY', lastName: 'Serfaty', operationId,
  });
  await Verification.create({ phoneNumber: '972501234567', externalCode: '1234', operationId });
  const response = await request(app).post(`${baseUrl}/login/vert`)
    .send({ phoneNumber: '972501234567', code: '1234' })
    .set('x-loco-op-id', operationId);
  console.log('response', response.body);
  return response.body;
};
