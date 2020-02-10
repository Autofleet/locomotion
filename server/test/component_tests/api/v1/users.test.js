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

  beforeAll(async () => {
    expect((await request(app).get('/')).status).toBe(200);
  });

  beforeEach(async () => {
    await clearDatabase();
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
    const res = await request(app).get(`${baseUrl}/${firstUserData.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);
  });

  it('test update user', async () => {
    const newFirstName = 'tester shmester';
    await initDatabase();
    const res = await request(app).patch(`${baseUrl}/${firstUserData.id}`).send({
      firstName: newFirstName,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);
    expect(res.body.firstName).toEqual(newFirstName);
  });

  it('test delete user', async () => {
    await initDatabase();
    const res = await request(app).get(`${baseUrl}/${firstUserData.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(firstUserData.id);

    const delRes = await request(app).delete(`${baseUrl}/${firstUserData.id}`);
    expect(delRes.statusCode).toBe(200);
  });
});

