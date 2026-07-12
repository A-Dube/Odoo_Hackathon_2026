const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

// Maintenance Actions
const getMaintenanceLogs = async (req, res) => {
  try {
    const logs = await Maintenance.find({}).populate('vehicle', 'registrationNumber model');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaintenanceLog = async (req, res) => {
  try {
    const { vehicle, serviceType, cost, odometerAtService, notes } = req.body;
    const log = await Maintenance.create({ vehicle, serviceType, cost, odometerAtService, notes });
    
    // Dynamically update the vehicle's odometer reading metric
    await Vehicle.findByIdAndUpdate(vehicle, { odometer: odometerAtService });
    
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Expense Actions
const getExpenses = async (req, res) => {
  try {
    const logs = await Expense.find({}).populate('vehicle', 'registrationNumber model');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpenseLog = async (req, res) => {
  try {
    const { vehicle, category, amount, fuelGallons } = req.body;
    const log = await Expense.create({
      vehicle,
      category,
      amount,
      fuelGallons: category === 'Fuel' ? fuelGallons : undefined,
      loggedBy: req.user._id
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Advanced Report Generator Metrics Dashboard Engine
const getReportMetrics = async (req, res) => {
  try {
    const maintenanceTotals = await Maintenance.aggregate([
      { $group: { _id: null, total: { $sum: '$cost' }, count: { $sum: 1 } } }
    ]);
    const expenseTotals = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    res.json({
      maintenanceTotal: maintenanceTotals[0]?.total || 0,
      maintenanceCount: maintenanceTotals[0]?.count || 0,
      expenseBreakdown: expenseTotals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMaintenanceLogs, createMaintenanceLog, getExpenses, createExpenseLog, getReportMetrics };