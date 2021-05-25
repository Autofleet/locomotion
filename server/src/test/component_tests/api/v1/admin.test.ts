const request = require('supertest');
import app from '../../../../app';

describe('Login Endpoints', () => {
  const baseUrl = '/api/v1/admin';

  it('Login', async () => {
    let res = await request(app).post(`${baseUrl}/auth`).send({
      password: 'wrong',
      userName: 'admin',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'FAIL' });

    res = await request(app).post(`${baseUrl}/auth`).send({
      password: '1234',
      userName: 'admin',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('SUCCESS');
  });
});
