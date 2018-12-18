process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');
// const JWT = require('jsonwebtoken');

let auth = {};

beforeEach(async () => {
  const hashedPassword = await bcrypt.hash('secret', 1);
  await db.query(
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

  // Store token for future requests
  auth.token = response.body.token;

  // Store username for future requests
  auth.curr_username = 'test';
});
