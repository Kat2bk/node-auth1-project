// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require('express');
const router = express.Router();
const {restricted} = require('../auth/auth-middleware');
const Users = require('./users-model');

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */

  router.get('/', restricted, async (req, res, next) => {
    const users = await Users.find();
    if (users) {
      res.status(200).json(users)
    } else {
      next({status: 500, message: "Unable to get users"})
    }
  })


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;