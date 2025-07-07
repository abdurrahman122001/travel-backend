const Booking = require('../models/Booking');

// CREATE booking
exports.createBooking = async (req, res) => {
  try {
    const { packageId, packageTitle, fullName, phone, email } = req.body;
    if (!packageId || !packageTitle || !fullName || !phone || !email)
      return res.status(400).json({ message: 'All fields are required.' });

    const booking = new Booking({ packageId, packageTitle, fullName, phone, email });
    await booking.save();
    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ: Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const { packageId, packageTitle, fullName, phone, email } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { packageId, packageTitle, fullName, phone, email },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
