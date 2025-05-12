const express = require('express');
const { getBlogsWithDetails } = require('../controllers/blogController');

const router = express.Router();

router.get('/', getBlogsWithDetails);

module.exports = router;