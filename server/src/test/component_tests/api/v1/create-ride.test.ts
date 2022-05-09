import app from '../../../../app';
import { Ride, User, Verification } from '../../../../models';

const uuid = require('uuid');
const request = require('supertest');

const baseUrl = '/api/v1';

jest.mock('../../../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

const createUserAndLogin = async () => {
  const operationId = uuid.v4();
  await User.create({
    phoneNumber: '972501234567', firstName: 'GUY', lastName: 'Serfaty', operationId,
  });
  await Verification.create({ phoneNumber: '972501234567', externalCode: '1234', operationId });
  const response = await request(app).post(`${baseUrl}/login/vert`)
    .send({ phoneNumber: '972501234567', code: '1234' })
    .set('x-loco-op-id', operationId);
  console.info('response', response.body);
  return response.body;
};

describe('Create rides', () => {

  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Verification.destroy({ truncate: true, force: true });
    await Ride.destroy({ truncate: true, force: true });
  });
  // const webHookHost = process.env.SERVER_HOST || 'https://716ee2e6.ngrok.io';
  // const mockPostAutofleet = nock(`${SERVER_HOST}/api/v1/ride-webhook/${ride.id}`)
  //   .post(uri => uri.includes('cats'))
  //   .once()
  //   .reply(200, response)

  it('Can create ride', async () => {
    const { accessToken } = await createUserAndLogin();
    const res = await request(app).post(`${baseUrl}/me/rides`).send({
      stopPoints: [
        {
          address: 'Some address 1',
          lat: 32,
          lng: 34.1,
        },
        {
          address: 'Some address 2',
          lat: 32.2,
          lng: 34.2,
        }
      ]
    }).set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ success: true });
  });
});
