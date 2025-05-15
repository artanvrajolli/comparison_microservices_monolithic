const axios = require('axios');
const { Comment } = require('../models');

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().lean();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get comments by blog ID
exports.getCommentsByBlogId = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).lean();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).lean();
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new comment
exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 