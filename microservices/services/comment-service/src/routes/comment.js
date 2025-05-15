const express = require('express');
const { 
  getAllComments, 
  getCommentsByBlogId,
  getCommentById, 
  createComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/comment');

const router = express.Router();

router.get('/', getAllComments);
router.get('/blog/:blogId', getCommentsByBlogId);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router; 