const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);             // Create
router.get('/bookings', bookingController.getAllBookings);             // Read all
router.get('/bookings/:id', bookingController.getBookingById);         // Read one
router.put('/bookings/:id', bookingController.updateBooking);          // Update
router.delete('/bookings/:id', bookingController.deleteBooking);       // Delete

module.exports = router;
