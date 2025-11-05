const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.json(vendors);
  } catch (err) {
    console.error('Get vendors error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Register vendor
router.post('/register', async (req, res) => {
  try {
    // Normalize username and email to lowercase
    const normalizedData = {
      ...req.body,
      username: req.body.username.toLowerCase().trim(),
      email: req.body.email.toLowerCase().trim()
    };

    const existingVendor = await Vendor.findOne({ 
      $or: [
        { email: normalizedData.email }, 
        { username: normalizedData.username }
      ] 
    });
    
    if (existingVendor) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const vendor = new Vendor(normalizedData);
    await vendor.save();
    
    // Return the created vendor data (without password)
    const vendorData = vendor.toObject();
    delete vendorData.password;
    
    res.status(201).json(vendorData);
  } catch (err) {
    console.error('Vendor registration error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Login vendor
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Normalize username/email for search
    const normalizedUsername = username.toLowerCase().trim();
    
    const vendor = await Vendor.findOne({ 
      $or: [
        { username: normalizedUsername }, 
        { email: normalizedUsername }
      ] 
    });
    
    if (!vendor) {
      console.log('Vendor not found:', normalizedUsername);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (vendor.password !== password) {
      console.log('Password mismatch for vendor:', vendor.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Return vendor data without password
    const vendorData = vendor.toObject();
    delete vendorData.password;
    
    console.log('Vendor login successful:', vendor.username);
    res.json(vendorData);
  } catch (err) {
    console.error('Vendor login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update vendor portfolio
router.put('/:id/portfolio', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { portfolio: req.body.portfolio },
      { new: true }
    ).select('-password');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (err) {
    console.error('Portfolio update error:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;