const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, model, vehicleType, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

    const vehicleExists = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (vehicleExists) {
      return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      model,
      vehicleType,
      maxLoadCapacity,
      odometer,
      acquisitionCost,
      status
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (req.body.registrationNumber && req.body.registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
      const duplicateExists = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber.toUpperCase() });
      if (duplicateExists) {
        return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};