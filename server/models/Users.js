const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    karma: {
        type: Number,
        default: 0,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    lastLogged: {
        type: Date,
        default: Date.now,
    },
    profileImage: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},
{collection: 'users'});

const User = mongoose.model('User', userSchema);
module.exports = User;