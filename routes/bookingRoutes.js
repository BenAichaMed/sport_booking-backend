const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

// Create Booking
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { courtId, date, startTime, endTime } = req.body;

    // Validate input
    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate total price (fetch pricePerHour from Court model)
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    const totalPrice = court.pricePerHour * calculateDuration(startTime, endTime);

    // Create a new booking
    const newBooking = new Booking({
      userId,
      courtId,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'pending',
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel Booking
router.put('/cancel/:bookingId', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Update booking status to "cancelled"
    const cancelledBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!cancelledBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully', booking: cancelledBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View Bookings
router.get('/view', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch user's bookings
    const bookings = await Booking.find({ userId }).populate('courtId');

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

function calculateDuration(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return Math.abs(end - start) / 36e5; // Difference in hours
}

module.exports = router;