process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
// const bcrypt = require('bcrypt');
// const JWT = require('jsonwebtoken');
const User = require('../models/user');

// Check register returns token
//  Check that response body contains valid token

let user;

beforeEach(async function() {
  // register a user

  user = await User.register({
    username: 'test1',
    password: 'test',
    first_name: 'Fname',
    last_name: 'Lname',
    phone: '7777777777'
  });
});

afterEach(async function() {
  // remove test users 1 and 2
  await db.query(`DELETE FROM users`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});

describe('POST /auth/register, valid token', async function() {
  test('Registers new user and returns token', async function() {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'test2',
        password: 'secret',
        first_name: 'John',
        last_name: 'Smith',
        phone: '5555555555'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    // test for unique user
  });
  test('Attempt to register with already created username => failure', async function() {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'test1',
        password: 'secret',
        first_name: 'John',
        last_name: 'Smith',
        phone: '5555555555'
      });
    expect(response.body.error.status).toBe(400);
    expect(response.body.error.message).toBe(
      'Oops! That username is already taken. Try another, noob.'
    );
    // test for unique user
  });
});

// Check login returns token
//  Check that response body contains valid token

describe('POST auth/login, valid token', async function() {
  test('Registers new user and returns token', async function() {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'test1',
        password: 'test'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
