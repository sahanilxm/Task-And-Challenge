const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const bcrypt = require('bcrypt');

//creates a new user in database
router.post('/', async (req,res)=>{
    try {
        const { login, password } = req.body;
        const saltValue = bcrypt.genSaltSync(10);
        const encryptedPassword = await bcrypt.hash(password,saltValue)

        const user = await users.findOne({ login });
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else{
            const newUser = new users({
                login,
                password: encryptedPassword,
            });
    
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' }); //user registered successfully
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;