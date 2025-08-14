const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search routes
router.get('/', searchController.searchAll);

module.exports = router;