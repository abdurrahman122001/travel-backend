// routes/headerSettingsRoutes.js
const express = require('express');
const router = express.Router();
const headerSettingsController = require('../controllers/headerSettingsController');

// Header settings routes
router.get('/', headerSettingsController.getHeaderSettings);
router.put('/', headerSettingsController.updateHeaderSettings);

module.exports = router;