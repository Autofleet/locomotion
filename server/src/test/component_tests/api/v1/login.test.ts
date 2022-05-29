import app from '../../../../app';
import { User, Verification } from '../../../../models';
const request = require('supertest');
const uuid = require('uuid');
import '../../../mocks';

const createUserData = () => ({
  phoneNumber: '972501234567',
  operationId: uuid.v4(),
})

describe('Login Endpoints', () => {
  const baseUrl = '/api/v1';

  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Verification.destroy({ truncate: true, force: true });
  });

  it('Login', async () => {
    const res = await request(app).post(`${baseUrl}/login`)
    .send({ phoneNumber: '972501234567' })
    .set('X-LOCO-OP-ID', uuid.v4());
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('Login Vert', async () => {
    const user = createUserData();
    await User.create(user);
    await Verification.create({ phoneNumber: user.phoneNumber, externalCode: '1234', operationId: user.operationId });
    const res = await request(app)
      .post(`${baseUrl}/login/vert`)
      .send({ phoneNumber: '972501234567', code: '1234' })
      .set('x-loco-op-id', user.operationId);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('OK');
    expect(res.body.userProfile.refreshTokenId).not.toBeNull();
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });
});
