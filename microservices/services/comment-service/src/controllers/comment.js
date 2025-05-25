const axios = require('axios');
const { Comment } = require('../models');
const promClient = require('prom-client');

// Create the counter metric if it doesn't exist
let commentOperationsTotal;
try {
  commentOperationsTotal = promClient.register.getSingleMetric('comment_service_operations_total');
} catch (error) {
  commentOperationsTotal = new promClient.Counter({
    name: 'comment_service_operations_total',
    help: 'Total number of comment operations',
    labelNames: ['operation', 'status']
  });
}

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().lean();
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_all', status: 'success' });
    }
    res.status(200).json(comments);
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_all', status: 'error' });
    }
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
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_by_blog', status: 'success' });
    }
    res.status(200).json(comments);
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_by_blog', status: 'error' });
    }
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
      if (commentOperationsTotal) {
        commentOperationsTotal.inc({ operation: 'get_by_id', status: 'not_found' });
      }
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_by_id', status: 'success' });
    }
    res.status(200).json(comment);
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'get_by_id', status: 'error' });
    }
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
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'create', status: 'success' });
    }
    res.status(201).json(comment);
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'create', status: 'error' });
    }
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
      if (commentOperationsTotal) {
        commentOperationsTotal.inc({ operation: 'update', status: 'not_found' });
      }
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'update', status: 'success' });
    }
    res.status(200).json(comment);
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'update', status: 'error' });
    }
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
      if (commentOperationsTotal) {
        commentOperationsTotal.inc({ operation: 'delete', status: 'not_found' });
      }
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'delete', status: 'success' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    if (commentOperationsTotal) {
      commentOperationsTotal.inc({ operation: 'delete', status: 'error' });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 