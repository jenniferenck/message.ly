const express = require('express');
const messageRoutes = express();
const Message = require('../models/message');
const { ensureLoggedIn } = require('../middleware/auth');

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

messageRoutes.get('/:id', ensureLoggedIn, async function(req, res, next) {
  try {
    const id = req.params.id;

    const msg = await Message.get(id);

    // if logged in user is either from or to user, return message
    if (
      req.username === msg.from_user.username ||
      req.username === msg.to_user.username
    ) {
      return res.json({ message: msg });
    }
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

messageRoutes.post('/:id', ensureLoggedIn, async function(req, res, next) {
  try {
    const { to_username, body } = req.body;

    const newMsg = await Message.create(req.username, to_username, body);

    return res.json({ message: newMsg });
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

messageRoutes.post('/:id', ensureLoggedIn, async function(req, res, next) {
  try {
    // Maybe we need to get message first and check that req.username is to_user
    const id = req.params.id;
    const msg = await Message.get(id);

    if (msg.to_user.username === req.username) {
      const markRead = await Message.markRead(id);

      return res.json({ message: markRead });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = messageRoutes;
