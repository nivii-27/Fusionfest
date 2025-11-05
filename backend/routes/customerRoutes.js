const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Register customer
router.post('/register', async (req, res) => {
  try {
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email: req.body.email }, { username: req.body.username }] 
    });
    
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login customer
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!customer || customer.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const customerData = customer.toObject();
    delete customerData.password;
    res.json(customerData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;