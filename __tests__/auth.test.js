process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

// Check register returns token
//  Check that response body contains valid token

describe('POST /users, valid token', async function() {
  test('Registers new user and returns token', async function() {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'secret',
        first_name: 'John',
        last_name: 'Smith',
        phone: '5555555555'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

// Check login returns token
//  Check that response body contains valid token
