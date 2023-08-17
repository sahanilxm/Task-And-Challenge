const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const users = require('../models/Users');
const logCheck = require('../middlewares/logCheck');

router.post('/',logCheck,async (req, res) => {
    try {
        author = req.body.author;
        title = req.body.title;
        details = req.body.details;
        endDate = new Date(req.body.endDate).toISOString();
        points = req.body.points;
        const userId = req.userId;
        const user = await users.findById(userId);
        if (!user) {
          res.status(410).json({ error: 'No user found' })
          return;
        }
        var pointsToTake;
        if(points <= 20){
          pointsToTake = 0;
        }
        else{
          pointsToTake = points - 20;
        }
        if(user.karma < points-20){
          res.status(422).json({error: 'You don\'t have enough karma'});
          return;
        }
        else{
          await users.findOneAndUpdate({ _id: userId },{karma: user.karma - pointsToTake},{ new: true }); //substracted karma from author
        }
        const newChallenge = new challenges({
            author,
            title,
            details,
            endDate,
            points,
        });
        await newChallenge.save();
        res.status(201).json({ message: 'Challenge added' }); //successfully added new challenge
    } catch (error) {
        console.log(error);
        if (error.status === 401) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;