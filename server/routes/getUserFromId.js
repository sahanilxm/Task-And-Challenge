const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const logCheck = require('../middlewares/logCheck');

//gets userId from logCheck middleware, then returns a user object (only id, login, isAdmin)
router.post('/',logCheck, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' })
        }
        res.status(207).send({userId,login: user.login, karma: user.karma, isAdmin: user.isAdmin}); //succesfully returns an user
    } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
    }
});

//gets userId from logCheck middleware, then returns a user object (without password)
router.post('/extended',logCheck,async (req, res) => {
  try {
      const userId = req.userId;
      const user = await users.findById(userId);
      if (!user) {
          res.status(410).json({ error: 'No user found' })
      }
      res.status(207).send({ //succesfully returns an user
        userId,
        login: user.login,
        karma: user.karma,
        createDate: user.createDate,
        lastLogged: user.lastLogged,
        isAdmin: user.isAdmin
      });
  } catch (error) {
      if (error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
  }
});

module.exports = router;