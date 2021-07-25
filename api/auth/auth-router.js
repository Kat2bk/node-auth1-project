// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware');

router.post('/register', checkPasswordLength, async (req, res, next) => {
  const {username, password} = req.body;
  try {
    const newUser = await Users.add({
      username, password: await bcrypt.hashSync(password, 12),
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error)
  }

})

router.post('/login', checkUsernameExists, (req, res, next) => {
  const {username, password} = req.body;
  // try {
  //   const [user] = await Users.findBy({username})
  //   if (user && bcrypt.compareSync(password, user.password)) {
  //     req.session.username = user;
  //     res.status(200).json({message: `Welcome ${user.username}`})
  //   } else {
  //     res.status(401).json({message: "Invalid Credentials"})
  //   }
  // } catch (error) {
  //   next(error)
  // }
  Users.findBy({username})
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({message: `Welcome ${user.username}`})
    } else {
      res.status(401).json({message: "Invalid Credentials"})
    }
  })
  .catch(error => {
    next(error)
  })
  
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    res.session.destroy(err => {
      if (err) {
        res.status(404).json({message: "cannot logout"})
      } else {
        res.status(204).end()
      }
    })
  } else {
    res.status(200).json({message: "session ended"})
  }
})

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */



 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;