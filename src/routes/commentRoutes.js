// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Get comments for a blog (by blog id)
router.get('/blog/:blogId', commentController.getCommentsByBlog);
// Add a comment to a blog
router.post('/blog/:blogId', commentController.addComment);

module.exports = router;
