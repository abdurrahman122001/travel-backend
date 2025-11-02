// routes/downloadEmails.js
const express = require('express');
const {
  trackDownload, 
  getDownloadEmails, 
  getDownloadStats,
  deleteDownloadRecord 
} = require('../controllers/downloadEmailController.js');

const router = express.Router();

router.post('/track', trackDownload);
router.get('/', getDownloadEmails);
router.get('/stats', getDownloadStats);
router.delete('/:id', deleteDownloadRecord);

module.exports = router;