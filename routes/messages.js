const express = require('express');
const messageRoutes = express();
const Message = require('Message');
const User = require('User');
const ensureLoggedIn = require('ensureLoggedIn');
const ensureCorrectUser = require('ensureCorrectUser');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

messageRoutes.get('/:id', ensureLoggedIn, ensureCorrectUser, async function(
  req,
  res,
  next
) {
  try {
    const id = req.params.id;

    const msg = Message.get(id);

    return res.json(msg);
  } catch (error) {
    return next(error);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

messageRoutes.post('/:id', ensureLoggedIn, ensureCorrectUser, async function(
  req,
  res,
  next
) {
  try {
    const { from_username, to_username, body } = req.body;

    const newMsg = Message.create(from_username, to_username, body);

    return res.json(newMsg);
  } catch (error) {
    return next(error);
  }
});
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

messageRoutes.post('/:id', ensureLoggedIn, ensureCorrectUser, async function(
  req,
  res,
  next
) {
  try {
    const id = req.params.id;

    const markRead = Message.markRead(id);

    return res.json(markRead);
  } catch (error) {
    return next(error);
  }
});

module.exports = messageRoutes;
