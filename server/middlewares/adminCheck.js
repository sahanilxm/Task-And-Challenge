const jwt = require('jsonwebtoken');
const users = require('../models/Users');

//middleware to check if there is a valid access token in request, if not, it will send error 401
const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      else {
        const user = await users.findById(decoded.userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' })
        }
        if(user.isAdmin == false){
            return res.status(402).json({ message: 'You are not an admin' });
        }
      }
      req.userId = decoded.userId;
      next();
    });
  };
  
  module.exports = adminMiddleware;