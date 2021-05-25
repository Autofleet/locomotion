const request = require('supertest');
import app from '../../../../app';
import createUserAndLogin from '../../../assets/create-user-and-login';
import { Ride, User, Verification } from '../../../../models';

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
    const { accessToken } = await createUserAndLogin();
    const res = await request(app).post(`${baseUrl}/me/rides`).send({
      numberOfPassenger: 1,
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
