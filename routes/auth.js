const express = require('express');
const authRoutes = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

authRoutes.post('/register', async function(req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;

    await User.register({ username, password, first_name, last_name, phone });
    await User.updateLoginTimestamp(username);
    let token = jwt.sign({ username }, SECRET_KEY);

    return res.json({ token });
  } catch (err) {
    err.status = 400; //bad request
    // can apply log for the error message to set your own
    if (err.code === '23505') {
      err.message = 'Oops! That username is already taken. Try another, noob.';
    }
    return next(err);
  }
});

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

authRoutes.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;

    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      let token = jwt.sign({ username }, SECRET_KEY);

      // Create new token
      // give them new token
      return res.json({ token });
    }
    throw new Error(`Invalid username/ password.`);
  } catch (error) {
    return next(error);
  }
});

module.exports = authRoutes;
