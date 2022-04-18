const request = require('supertest');

const app = require('../../../../app');

const { User, Verification } = require('../../../../models');

jest.mock('../../../../lib/nexmo', () => ({
  sendSms: jest.fn(() => true),
}));

describe('Login Endpoints', () => {
  const baseUrl = '/api/v1';

  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Verification.destroy({ truncate: true, force: true });
  });

  it('Login', async () => {
    const res = await request(app).post(`${baseUrl}/login`).send({ phoneNumber: '972501234567' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('Login Vert', async () => {
    await User.create({ phoneNumber: '972501234567' });
    await Verification.create({ phoneNumber: '972501234567', externalCode: '1234' });
    const res = await request(app).post(`${baseUrl}/login/vert`).send({ phoneNumber: '972501234567', code: '1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('OK');
    expect(res.body.userProfile.refreshTokenId).not.toBeNull();
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });
});
