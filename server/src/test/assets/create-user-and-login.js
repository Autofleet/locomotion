const request = require('supertest');
const uuid = require('uuid');
const app = require('../../app');
const { User, Verification } = require('../../models');

jest.mock('../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

const baseUrl = '/api/v1';

module.exports = async () => {
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
