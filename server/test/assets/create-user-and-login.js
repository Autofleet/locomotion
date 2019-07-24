const request = require('supertest');
const app = require('../../app');
const { User, Verification } = require('../../models');

jest.mock('../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

const baseUrl = '/api/v1';

module.exports = async () => {
  await User.create({ phoneNumber: '972501234567', firstName: 'GUY' });
  await Verification.create({ phoneNumber: '972501234567', externalCode: '1234' });
  const response = await request(app).post(`${baseUrl}/login/vert`).send({ phoneNumber: '972501234567', code: '1234' });
  return response.body;
};
