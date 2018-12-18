process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');

// const JWT = require('jsonwebtoken');

let user = {};

beforeEach(async () => {
  const hashedPassword = await bcrypt.hash('secret', 1);
  let result = await db.query(
    `INSERT INTO users (username, password, first_name, last_name, phone)
    VALUES ('test', $1, 'John', 'Smith', '555-555-5555')`,
    [hashedPassword]
  );

  const response = await request(app)
    .post('/login')
    .send({
      username: 'test',
      password: 'secret'
    });

  // Store current user for future requests
  user = result.rows[0];

  // Store token for future requests
  user.token = response.body.token;
});

//

describe('GET / success', async function() {
  test('returns list of all users', async function() {
    const response = await request(app).get(`/`);
    const { users } = response.body;
    expect(response.statusCode).toBe(200);
    expect(users[0]).toEqual(user.username);
    expect(users.length).toEqual(1);
  });
});

describe('GET /:username success', async function() {
  test('returns a single user by username', async function() {
    const response = await request(app).get(`/${user.username}`);
    const { users } = response.body;
    expect(response.statusCode).toBe(200);
    expect(user.username).toEqual('test');
    expect(users).toEqual(1);
  });
});

// Get all users

describe('GET /login success', async function() {
  test('');
});

// Get single user by id

// Post / Create new user

// Patch / Update user

//  Delete user by id
