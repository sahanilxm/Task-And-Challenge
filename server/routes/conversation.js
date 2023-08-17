const express = require('express');
const router = express.Router();
const comments = require('../models/Comments');
const users = require('../models/Users');
const bcrypt = require('bcrypt');
const logCheck = require('../middlewares/logCheck');
const mongoose = require('mongoose');

router.post('/show',logCheck, async (req,res)=>{
    try{
        const challengeId = req.body.id;
        const commentsToThisChallenge = await comments.find({ challengeId }).sort({createDate: 'asc'});

        if (commentsToThisChallenge.length === 0) {
            res.status(404).json({ error: 'No comments found' }); //410 no comments found
            return;
        }
        res.status(200).json({ data: commentsToThisChallenge, message: "Resources sent successfully" }); //successfully send resources in response
    } catch(error){
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});
router.post('/add',logCheck, async (req,res)=>{
    try{
        const challengeId = req.body.id;
        const text = req.body.text;

        const userId = req.userId;

        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const author = user.login;

        if(challengeId != '' && author != '' && text != ''){
            const newComment = new comments({
                challengeId: new mongoose.Types.ObjectId(challengeId),
                author,
                text
            });
            await newComment.save();
            res.status(200).json({ message: 'comment added successfully' }); //comment added successfully
        }else{
            res.status(400).json({ error: 'Invalid data' }); //400 invalid data
            return;
        }
    } catch(error){
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;