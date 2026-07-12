const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');

dotenv.config();

const vehiclesData = [
  { registrationNumber: 'NY-8821-AA', model: 'Freightliner Cascadia', vehicleType: 'Heavy Hauler', maxLoadCapacity: 22000, odometer: 85000, acquisitionCost: 135000, status: 'Available' },
  { registrationNumber: 'TX-4492-BB', model: 'Volvo FH16', vehicleType: 'Heavy Hauler', maxLoadCapacity: 25000, odometer: 42000, acquisitionCost: 145000, status: 'Available' },
  { registrationNumber: 'CA-1102-CC', model: 'Peterbilt 579', vehicleType: 'Heavy Hauler', maxLoadCapacity: 24000, odometer: 115000, acquisitionCost: 120000, status: 'In Shop' },
  { registrationNumber: 'FL-5531-DD', model: 'Isuzu NPR', vehicleType: 'Regional Van', maxLoadCapacity: 8000, odometer: 28000, acquisitionCost: 65000, status: 'Available' },
  { registrationNumber: 'IL-7742-EE', model: 'Ford F-550', vehicleType: 'Regional Van', maxLoadCapacity: 7500, odometer: 61000, acquisitionCost: 58000, status: 'Available' }
];

const driversData = [
  { name: 'Marcus Vance', licenseNumber: 'DL-88291', licenseCategory: 'Class A CDL', licenseExpiryDate: new Date('2030-05-12'), contactNumber: '555-0144', safetyScore: 98, status: 'Available' },
  { name: 'Elena Rostova', licenseNumber: 'DL-44102', licenseCategory: 'Class A CDL', licenseExpiryDate: new Date('2029-11-20'), contactNumber: '555-0177', safetyScore: 95, status: 'Available' },
  { name: 'David Miller', licenseNumber: 'DL-33981', licenseCategory: 'Class B CDL', licenseExpiryDate: new Date('2031-02-15'), contactNumber: '555-0122', safetyScore: 88, status: 'Available' },
  { name: 'Sarah Jenkins', licenseNumber: 'DL-11024', licenseCategory: 'Class A CDL', licenseExpiryDate: new Date('2027-01-10'), contactNumber: '555-0155', safetyScore: 72, status: 'Suspended' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops');
    console.log('Database connected for seeding...');

    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    console.log('Existing mock assets dropped clean.');

    const createdVehicles = await Vehicle.create(vehiclesData);
    const createdDrivers = await Driver.create(driversData);
    console.log(`Successfully seeded ${createdVehicles.length} vehicles and ${createdDrivers.length} drivers.`);

    await Trip.create([
      { source: 'Chicago Hub', destination: 'Dallas Facility', vehicle: createdVehicles[0]._id, driver: createdDrivers[0]._id, cargoWeight: 18000, plannedDistance: 920, status: 'Draft' },
      { source: 'Atlanta Port', destination: 'Miami Logistics', vehicle: createdVehicles[1]._id, driver: createdDrivers[1]._id, cargoWeight: 21000, plannedDistance: 660, status: 'Draft' }
    ]);
    console.log('Initial trip manifests generated.');

    console.log('Database seeding process completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error encountered: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();