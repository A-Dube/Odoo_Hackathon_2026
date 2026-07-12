const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true
  },
  maxLoadCapacity: {
    type: Number,
    required: [true, 'Maximum load capacity is required'],
    min: [0, 'Load capacity cannot be negative']
  },
  odometer: {
    type: Number,
    required: [true, 'Odometer reading is required'],
    min: [0, 'Odometer cannot be negative']
  },
  acquisitionCost: {
    type: Number,
    required: [true, 'Acquisition cost is required'],
    min: [0, 'Acquisition cost cannot be negative']
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);