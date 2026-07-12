const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const Maintenance = require('./models/Maintenance');
const Expense = require('./models/Expense');
const User = require('./models/User');

dotenv.config();

const vehiclesData = [
  { registrationNumber: 'NY-8821-AA', model: 'Freightliner Cascadia', vehicleType: 'Heavy Hauler', maxLoadCapacity: 22000, odometer: 85450, acquisitionCost: 135000, status: 'Available' },
  { registrationNumber: 'TX-4492-BB', model: 'Volvo FH16', vehicleType: 'Heavy Hauler', maxLoadCapacity: 25000, odometer: 42120, acquisitionCost: 145000, status: 'Available' },
  { registrationNumber: 'CA-1102-CC', model: 'Peterbilt 579', vehicleType: 'Heavy Hauler', maxLoadCapacity: 24000, odometer: 115000, acquisitionCost: 120000, status: 'In Shop' },
  { registrationNumber: 'FL-5531-DD', model: 'Isuzu NPR', vehicleType: 'Regional Van', maxLoadCapacity: 8000, odometer: 28600, acquisitionCost: 65000, status: 'Available' }
];

const driversData = [
  { name: 'Marcus Vance', licenseNumber: 'DL-88291', licenseCategory: 'Class A CDL', licenseExpiryDate: new Date('2030-05-12'), contactNumber: '555-0144', safetyScore: 98, status: 'Available' },
  { name: 'Elena Rostova', licenseNumber: 'DL-44102', licenseCategory: 'Class A CDL', licenseExpiryDate: new Date('2029-11-20'), contactNumber: '555-0177', safetyScore: 95, status: 'Available' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops');
    console.log('Database connected for deep operational seeding...');

    // Clear everything clean out
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await Maintenance.deleteMany({});
    await Expense.deleteMany({});

    // 1. Build Base Inventory Data Structures
    const createdVehicles = await Vehicle.create(vehiclesData);
    const createdDrivers = await Driver.create(driversData);
    console.log('Core assets populated.');

    // 2. Fetch a valid administrative team manager ID for cost logging attribution
    const mockManager = await User.findOne({ role: 'Fleet Manager' }) || { _id: new mongoose.Types.ObjectId() };

    // 3. Inject Historical Maintenance Log Records
    await Maintenance.create([
      { vehicle: createdVehicles[0]._id, serviceType: 'Oil Change', cost: 180, odometerAtService: 85000, notes: 'Full dynamic synthetic engine fluid flush completed.' },
      { vehicle: createdVehicles[1]._id, serviceType: 'Brake Repair', cost: 650, odometerAtService: 42000, notes: 'Front axle ceramic shoe pad assemblies replaced.' },
      { vehicle: createdVehicles[2]._id, serviceType: 'Tire Replacement', cost: 1200, odometerAtService: 114500, notes: 'Full configuration replacement of rear drive tires.' }
    ]);
    console.log('Maintenance ledger initialized.');

    // 4. Inject Financial Expense Entries
    await Expense.create([
      { vehicle: createdVehicles[0]._id, category: 'Fuel', amount: 320, fuelGallons: 95, loggedBy: mockManager._id },
      { vehicle: createdVehicles[1]._id, category: 'Fuel', amount: 280, fuelGallons: 82, loggedBy: mockManager._id },
      { vehicle: createdVehicles[0]._id, category: 'Toll', amount: 45, loggedBy: mockManager._id },
      { vehicle: createdVehicles[2]._id, category: 'Insurance', amount: 850, loggedBy: mockManager._id }
    ]);
    console.log('Expense ledger accounts populated.');

    // 5. Build Initial Active Trip Records
    await Trip.create([
      { source: 'Chicago Hub', destination: 'Dallas Facility', vehicle: createdVehicles[0]._id, driver: createdDrivers[0]._id, cargoWeight: 18000, plannedDistance: 920, status: 'Draft' }
    ]);
    console.log('Trip configurations synced.');

    console.log('All historical operations successfully populated!');
    process.exit();
  } catch (error) {
    console.error(`Deep Seeding failure encountered: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();