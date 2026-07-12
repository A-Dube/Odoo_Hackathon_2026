const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Routine Inspection', 'Oil Change', 'Brake Repair', 'Tire Replacement', 'Engine Tune-up']
  },
  cost: {
    type: Number,
    required: true
  },
  odometerAtService: {
    type: Number,
    required: true
  },
  serviceDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);