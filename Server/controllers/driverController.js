const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

    const driverExists = await Driver.findOne({ licenseNumber: licenseNumber.toUpperCase() });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver with this license number already exists' });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore,
      status
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (req.body.licenseNumber && req.body.licenseNumber.toUpperCase() !== driver.licenseNumber) {
      const duplicateExists = await Driver.findOne({ licenseNumber: req.body.licenseNumber.toUpperCase() });
      if (duplicateExists) {
        return res.status(400).json({ message: 'Driver with this license number already exists' });
      }
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await driver.deleteOne();
    res.json({ message: 'Driver removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};