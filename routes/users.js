const express = require('express');
const userRoutes = express();
const User = require('../models/user');

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

userRoutes.get('/', async function(req, res, next) {
  try {
    return res.json({ users: await User.all() });
  } catch (error) {
    return next(error);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

userRoutes.get('/:username', async function(req, res, next) {
  try {
    const user = await User.get(req.params.username);

    return res.json({ user: user });
  } catch (error) {
    return next(error);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

userRoutes.get('/:username/to', async function(req, res, next) {
  try {
    const inboundMsgs = await User.messagesTo(req.params.username);

    return res.json({ messages: inboundMsgs });
  } catch (error) {
    return next(error);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

userRoutes.get('/:username/from', async function(req, res, next) {
  try {
    const outboundMsgs = await User.messagesFrom(req.params.username);

    return res.json({ messages: outboundMsgs });
  } catch (error) {
    return next(error);
  }
});

module.exports = userRoutes;
