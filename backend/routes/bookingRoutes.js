const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings for a customer
router.get('/customer/:username', async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.username });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;