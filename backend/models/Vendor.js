const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  whatsapp: String,
  city: { type: String, required: true },
  area: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  openToTravel: { type: Boolean, default: false },
  travelLocations: [String],
  travelCharges: { type: Number, default: 0 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: [{
    title: String,
    menu: [[String]],
    images: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);