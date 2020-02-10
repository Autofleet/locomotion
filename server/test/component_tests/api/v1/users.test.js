const request = require('supertest');
const app = require('../../../../app');
const { User, Verification } = require('../../../../models');

describe('Users Endpoints', () => {
  const baseUrl = '/api/v1/users';
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

  beforeEach(async () => {
    await clearDatabase();
    expect((await request(app).get('/')).status).toBe(200);
  });

  it('test create new user', async () => {
    const res = await request(app).post(`${baseUrl}`).send({ user: firstUserData });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(firstUserData.id);
  });

  it('test get all users', async () => {
    await initDatabase();
    const res = await request(app).get(`${baseUrl}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(firstUserData.id);
    expect(res.body[1].phoneNumber).toEqual(secUserData.phoneNumber);
  });

  it('test get first user', async () => {
    await initDatabase();
    const userId = firstUserData.id;
    const res = await request(app).get(`${baseUrl}/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);
  });
});

