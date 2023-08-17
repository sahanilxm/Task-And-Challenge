const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const showChallenges = require('./routes/showChallenges.js')
const handleRegistration = require('./routes/handleRegistration.js')
const login = require('./routes/login.js')
const getUserFromId = require('./routes/getUserFromId.js')
const addNewChallenge = require('./routes/addNewChallenge.js')
const handleStateChange = require('./routes/handleStateChange.js')
const editUser = require('./routes/editUser.js')
const details = require('./routes/details.js')
const conversation = require('./routes/conversation.js')
const adminPageTraffic = require('./routes/admin/pageTraffic.js')
const userOperations = require('./routes/admin/userOperations.js')

app.use('/api/showChallenges', showChallenges);
app.use('/api/handleRegistration', handleRegistration);
app.use('/api/login', login);
app.use('/api/getUserFromId', getUserFromId);
app.use('/api/addNewChallenge', addNewChallenge);
app.use('/api/handleStateChange', handleStateChange);
app.use('/api/editUser', editUser);
app.use('/api/details', details);
app.use('/api/conversation', conversation);
app.use('/api/adminPageTraffic', adminPageTraffic);
app.use('/api/adminUserOperations',userOperations);

//launching server
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

//connecting to mongoDB database
mongoose.connect(process.env.DB_URI).then(()=> {
    console.log('Connected to database');
}).catch((error) => {
    console.error('Failed to connect to database: ',error);
});