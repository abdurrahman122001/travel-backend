// routes/downloadEmails.js
const express = require('express');
const {
  trackDownload,
  getDownloadEmails,
  getDownloadStats,
  deleteDownloadRecord,
  exportDownloads
} = require('../controllers/downloadEmailController.js');

const router = express.Router();

// Track download
router.post('/track', trackDownload);

// Get all download emails (admin)
router.get('/', getDownloadEmails);

// Get download statistics
router.get('/stats', getDownloadStats);

// Export downloads as CSV
router.get('/export', exportDownloads);

// Delete download record
router.delete('/:id', deleteDownloadRecord);

module.exports = router;