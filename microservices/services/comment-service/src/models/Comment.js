const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  blogId: {
    type: String,  // Reference to the blog in the blog service
    required: true
  },
  userId: {
    type: String,  // Reference to the user in the user service
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema); 