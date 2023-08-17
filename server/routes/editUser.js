const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const challenges = require('../models/Challenges')
const bcrypt = require('bcrypt');
const logCheck = require('../middlewares/logCheck');

router.post('/delete',logCheck, async (req,res) => {
    try{
        const userId = req.userId;
        const givenPassword= req.body.password
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const password = user.password;
        if (!givenPassword || !password) {
            res.status(510).json({ error: 'Invalid password or hash' }); //510 invalid password or hash
            return;
        }
        const match = await bcrypt.compare(givenPassword, password);
        if (match) { 
            const deletedAuthor = user.login;
            await users.findOneAndRemove({ _id: userId }, { new: true });
            await challenges.deleteMany({$and: [{author: deletedAuthor}, {challengeState: {$ne: 3}}]});
            res.status(205).json({ message: 'Successfully deleted'}); //205 successfully deleted account
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    }catch(error){
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});
router.post('/changePassword', logCheck, async (req,res) => {
    try{
        const userId = req.userId;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters long' });
            return;
        }
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const password = user.password;
        if (!oldPassword || !password) {
            res.status(510).json({ error: 'Invalid password or hash' }); //510 invalid password or hash
            return;
        }
        const match = await bcrypt.compare(oldPassword, password);
        if (match) {
            const saltValue = bcrypt.genSaltSync(10);
            const encryptedPassword = await bcrypt.hash(newPassword,saltValue)
            await users.findOneAndUpdate({ _id: userId },{password: encryptedPassword},{ new: true });
            res.status(205).json({ message: 'Successfully updated password'}); //205 successfully updated password
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    }catch(error){
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;