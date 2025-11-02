// routes/about.js
const express = require('express');
const {
  getAbout,
  updateAbout,
  updateSection
} = require('../controllers/aboutController.js');

const router = express.Router();

// Get full "About" data
router.get('/', getAbout);

// Update full "About" page
router.put('/', updateAbout);

// Update specific section of "About"
router.put('/section/:section', updateSection);

module.exports = router;
