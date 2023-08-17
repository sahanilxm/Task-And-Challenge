const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    author: { 
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
},
{collection: 'comments'});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;