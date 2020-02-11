const request = require('supertest');
const app = require('../../../../app');
const { User, Verification } = require('../../../../models');

describe('Users Endpoints', () => {
  const baseUrl = '/api/v1/admin';
  const usersApiUrl = `${baseUrl}/users`;
  let acToken;
  const firstUserData = {
    id: 'f8a0c5fc-9b4c-43fa-93e7-a57349645be2',
    phoneNumber: '972501234567',
    firstName: 'Tester',
    lastName: 'Teste',
  };
  const secUserData = {
    phoneNumber: '972501234568',
    firstName: 'secTester',
    lastName: 'secTeste',
  };

  const initDatabase = async () => {
    await User.create(firstUserData);
    await User.create(secUserData);
  };

  const clearDatabase = async () => {
    await User.destroy({
      truncate: true,
      force: true,
    });
    await Verification.destroy({
      truncate: true,
      force: true,
    });
  };

  beforeAll(async () => {
    expect((await request(app).get('/')).status).toBe(200);

    const res = await request(app).post(`${baseUrl}/auth`).send({
      userName: 'admin',
      password: '1234',
    });
    if (!res.body.token) throw new Error(`admin login is needed for this test! resp was ${JSON.stringify(res)}`);
    acToken = [
      'Authorization',
      `Bearer ${res.body.token}`,
    ];
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('test create new user', async () => {
    const res = await request(app).post(`${usersApiUrl}`).set(...acToken).send({ user: firstUserData });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(firstUserData.id);
  });

  it('test get all users', async () => {
    await initDatabase();
    const res = await request(app).get(`${usersApiUrl}`).set(...acToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(firstUserData.id);
    expect(res.body[1].phoneNumber).toEqual(secUserData.phoneNumber);
  });

  it('test get first user', async () => {
    await initDatabase();
    const res = await request(app).get(`${usersApiUrl}/${firstUserData.id}`).set(...acToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);
  });

  it('test update user', async () => {
    const newFirstName = 'tester shmester';
    await initDatabase();
    const res = await request(app).patch(`${usersApiUrl}/${firstUserData.id}`).set(...acToken).send({
      firstName: newFirstName,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);
    expect(res.body.firstName).toEqual(newFirstName);
  });

  it('test delete user', async () => {
    await initDatabase();
    const res = await request(app).get(`${usersApiUrl}/${firstUserData.id}`).set(...acToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);

    const delRes = await request(app).delete(`${usersApiUrl}/${firstUserData.id}`).set(...acToken);
    expect(delRes.statusCode).toBe(200);
  });
});

