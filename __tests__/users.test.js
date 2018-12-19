process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');

// const JWT = require('jsonwebtoken');

let user;
let user2;
let msgToUser;
let msgFromUser;

beforeEach(async function() {
  // register a user which returns user obj: { username, password, first_name, last_name, phone }

  user = await User.register({
    username: 'test1',
    password: 'test',
    first_name: 'Fname',
    last_name: 'Lname',
    phone: '7777777777'
  });

  user2 = await User.register({
    username: 'test2',
    password: 'test',
    first_name: 'Fname',
    last_name: 'Lname',
    phone: '7777777777'
  });

  // create msg from user to user 2
  msgFromUser = await Message.create({
    from_username: user.username,
    to_username: user2.username,
    body: 'This is a test message from user'
  });

  // create msg from user2 to user
  msgToUser = await Message.create({
    from_username: user2.username,
    to_username: user.username,
    body: 'This is a test message from user2'
  });
});

afterEach(async function() {
  // remove test users 1 and 2
  await db.query(`DELETE FROM messages`);
  await db.query(`DELETE FROM users`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});

// Get all users

describe('GET /users get all users success', async function() {
  test('returns list of all users', async function() {
    const response = await request(app).get(`/users`);
    const { users } = response.body;
    expect(response.statusCode).toBe(200);
    expect(users[0].username).toEqual(user.username);
    expect(users.length).toEqual(2);
  });
});

// Get single user by id

describe('GET /users/:username get individual user success', async function() {
  test('returns a single user by username', async function() {
    const response = await request(app).get(`/users/${user.username}`);
    const { user } = response.body;
    expect(response.statusCode).toBe(200);
    expect(user.username).toEqual('test1');
  });
});

// Get all messages to user

describe('GET /users/:username/to success', async function() {
  test('returns all messages to the current user', async function() {
    const response = await request(app).get(`/users/${user.username}/to`);
    const { messages } = response.body;
    expect(response.statusCode).toBe(200);
    expect(messages).hasLength(1);
    expect(messages[0]).toEqual(msgToUser);
    expect(messages[0].body).toBe('This is a test message from user2');
  });
});

// Get all messages from user

describe('GET /users/:username/from success', async function() {
  test('returns all messages from the current user', async function() {
    const response = await request(app).get(`/users/${user.username}/to`);
    const { messages } = response.body;
    expect(response.statusCode).toBe(200);
    expect(messages).hasLength(1);
    expect(messages[0]).toEqual(msgFromUser);
    expect(messages[0].body).toBe('This is a test message from user');
  });
});
