const express = require('express');
const visitorController = require('../controllers/visitorController');

const router = express.Router();

router.post("/count", visitorController.addVisitor);      // For frontend "every visit" tracking
router.get("/", visitorController.getVisitors);           // List recent visitors for analytics page
router.get("/stats", visitorController.getVisitorStats);  // Get stats (total, unique)

module.exports = router;
