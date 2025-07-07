const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Create blog post
router.post('/', blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get single blog post
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);

// Delete blog post (optional)
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
