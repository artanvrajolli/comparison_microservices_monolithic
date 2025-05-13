const express = require('express');
const { getBlogsWithDetails } = require('../controllers/blog');

const router = express.Router();

router.get('/', getBlogsWithDetails);

module.exports = router;