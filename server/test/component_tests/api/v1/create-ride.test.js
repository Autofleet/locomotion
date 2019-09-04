const request = require('supertest');
// const nock = require('nock');
const app = require('../../../../app');
const createUserAndLogin = require('../../../assets/create-user-and-login');
const { Ride, User, Verification } = require('../../../../models');

jest.mock('../../../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

describe('Create rides', () => {
  const baseUrl = '/api/v1';

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
    const { accessToken, userProfile } = await createUserAndLogin();
    const res = await request(app).post(`${baseUrl}/me/rides`).send({
      pickupAddress: 'Some address 1',
      pickupLat: 32,
      pickupLng: 34.1,
      dropoffAddress: 'Some address 2',
      dropoffLat: 32.2,
      dropoffLng: 34.2,
    }).set('Authorization', `Bearer ${accessToken}`);

    console.log(accessToken);
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ success: true });
  });
});
