const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const users = require('../models/Users');
const logCheck = require('../middlewares/logCheck');

router.post('/',logCheck, async (req,res)=>{
    try{
        const idToGet = req.body.id;
        const challenge = await challenges.findById(idToGet);
        const userId = req.userId;

        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const login = user.login;
        if (!challenge) {
            res.status(410).json({ error: 'No challenge found' }); //410 no challenge found
            return;
        }
        res.status(207).send({challenge, login});
    }catch(error){
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;