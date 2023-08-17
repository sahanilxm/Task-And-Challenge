const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//logs user in
router.post('/', async (req, res) => {
    try {
      const givenLogin = req.body.login;
      const givenPassword = req.body.password;
      const user = await users.findOne({ login: givenLogin });
      if (!user) {
        res.status(410).json({ error: 'No user found' });
        return;
      }
      const password = user.password;
      if (typeof givenPassword !== 'string' || typeof password !== 'string') {
        res.status(500).json({ error: 'Invalid password or hash' });
        return;
      }
      const match = await bcrypt.compare(givenPassword, password);
      if (match) {
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_SECRET_KEY, {expiresIn: process.env.ACCESS_EXPIRY_TIME});
        const newDate = new Date().toISOString() //get current date in mongodb date format
        await users.findOneAndUpdate({ _id: user._id }, { lastLogged: newDate }, { new: true });
        res.status(200).json({ message: 'Successfully logged in', token: accessToken });
      } else {
        res.status(300).json({ error: 'Wrong password' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;