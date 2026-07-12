const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

const getDashboardStats = async (req, res) => {
  try {
    const activeVehicles = await Vehicle.countDocuments({ status: 'On Trip' });
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    const inMaintenance = await Vehicle.countDocuments({ status: 'In Shop' });
    
    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });
    
    const driversOnDuty = await Driver.countDocuments({ 
      status: { $in: ['Available', 'On Trip'] } 
    });

    const totalVehicles = activeVehicles + availableVehicles + inMaintenance;
    const fleetUtilization = totalVehicles > 0 
      ? Math.round((activeVehicles / totalVehicles) * 100) + '%' 
      : '0%';

    res.json({
      activeVehicles,
      availableVehicles,
      inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };