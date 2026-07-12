const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fuel', 'Toll', 'Insurance', 'Permit', 'Miscellaneous']
  },
  amount: {
    type: Number,
    required: true
  },
  fuelGallons: {
    type: Number,
    required: function() { return this.category === 'Fuel'; }
  },
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);