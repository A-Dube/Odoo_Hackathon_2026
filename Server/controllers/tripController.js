const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({}).populate('vehicle').populate('driver');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle: vehicleId, driver: driverId, cargoWeight, plannedDistance } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle) return res.status(444).json({ message: 'Targeted vehicle not found' });
    if (!driver) return res.status(404).json({ message: 'Targeted driver not found' });

    if (vehicle.status === 'Retired') return res.status(400).json({ message: 'Validation Failed: Vehicle is Retired' });
    if (vehicle.status === 'In Shop') return res.status(400).json({ message: 'Validation Failed: Vehicle is In Shop' });
    if (vehicle.status === 'On Trip') return res.status(400).json({ message: 'Validation Failed: Vehicle is already On Trip' });
    
    if (driver.status === 'Suspended') return res.status(400).json({ message: 'Validation Failed: Driver is Suspended' });
    if (driver.status === 'On Trip') return res.status(400).json({ message: 'Validation Failed: Driver is already On Trip' });
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ message: 'Validation Failed: Driver license is expired' });
    }
    
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({ message: `Validation Failed: Cargo weight exceeds capacity (${vehicle.maxLoadCapacity}kg)` });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicle: vehicleId,
      driver: driverId,
      cargoWeight,
      plannedDistance,
      status: 'Draft'
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.status !== 'Draft') return res.status(400).json({ message: 'Only Draft trips can be dispatched' });

    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'On Trip' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'On Trip' });

    trip.status = 'Dispatched';
    await trip.save();
    res.json({ message: 'Trip dispatched successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.status !== 'Dispatched') return res.status(400).json({ message: 'Only Dispatched trips can be completed' });

    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });

    trip.status = 'Completed';
    await trip.save();
    res.json({ message: 'Trip completed safely', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot cancel a closed trip' });
    }

    if (trip.status === 'Dispatched') {
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
      await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
    }

    trip.status = 'Cancelled';
    await trip.save();
    res.json({ message: 'Trip cancelled', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip };