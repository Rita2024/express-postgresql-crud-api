const request = require('supertest');
const app = require('../src/App');
const pool = require('../src/config/db');

let adminToken, userToken, userId;

beforeAll(async () => {
  await pool.query("DELETE FROM users;");

  // Register admin user (no auth needed)
  await request(app)
    .post('/users')
    .send({
      name: 'Admin',
      email: 'admin@example.com',
      age: 40,
      password: 'adminpass',
      role: 'admin'
    });

  // Login admin
  const adminLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'adminpass' });
  adminToken = adminLogin.body.accessToken;

  // Register regular user
  const userRes = await request(app)
    .post('/users')
    .send({
      name: 'TestUser',
      email: 'testuser@example.com',
      age: 25,
      password: 'testpassword'
    });
  userId = userRes.body.id;

  // Login regular user
  const userLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'testpassword'
    });
  userToken = userLogin.body.accessToken;
});

afterAll(async () => {
  await pool.end();
});

describe('Users API', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'AnotherUser',
        email: 'anotheruser@example.com',
        age: 28,
        password: 'anotherpassword'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.email).toEqual('anotheruser@example.com');
  });

  test('should login as user and receive JWT tokens', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'anotheruser@example.com',
        password: 'anotherpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test('should fetch all users (auth required)', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should update the user', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'UpdatedUser',
        email: 'testuser@example.com',
        age: 26
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('UpdatedUser');
  });

  test('should not allow regular user to delete a user', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
  });

  test('should allow admin to delete a user', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User deleted successfully');
  });
});