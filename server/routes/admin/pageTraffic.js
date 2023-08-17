const express = require('express');
const router = express.Router();
const users = require('../../models/Users');
const adminCheck = require('../../middlewares/adminCheck');

//ADMIN ROUTE: gets lis of users sorted by lastLogged field (ascending)
router.post('/',adminCheck, async (req,res) => {
    try {
        const usersSorted = await users.find({}, null, {sort: {lastLogged: -1}}).select('login karma createDate lastLogged isAdmin');
        if(!usersSorted){
            res.status(410).json({ error: 'No users found' })
        }
        res.status(207).send({data: usersSorted});
    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        } 
        else if(error.response.status === 402){
            res.status(402).json({ message: 'You are not an admin' });
        } 
        else{
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;