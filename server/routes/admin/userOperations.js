const express = require('express');
const router = express.Router();
const users = require('../../models/Users');
const adminCheck = require('../../middlewares/adminCheck');

router.post('/delete',adminCheck, async (req,res) => {
    try {
       
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
router.post('/changeLogin',adminCheck, async (req,res) => {
    try {
       
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
router.post('/editKarma',adminCheck, async (req,res) => {
    try {
       
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
router.post('/changeStatus',adminCheck, async (req,res) => {
    try {
       
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