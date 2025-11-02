// routes/homepage.js
const express = require('express');
const { 
  getHomepage, 
  updateHomepage, 
  updateSection,
  uploadImage,
  upload
} = require('../controllers/homepageController.js');

const router = express.Router();

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads'));

router.get('/', getHomepage);
router.put('/', updateHomepage);
router.put('/:section', updateSection);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;