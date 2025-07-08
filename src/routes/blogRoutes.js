const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
router.get('/count', blogController.countAllBlogs);
router.get('/', blogController.getAllBlogs); // All blogs
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/slug/:slug', blogController.getBlogBySlug); // <-- SLUG ROUTE before :id
router.get('/:id', blogController.getBlogById);          // <-- ID ROUTE (optional, admin)
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
