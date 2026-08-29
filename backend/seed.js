require('dotenv').config();
const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb+srv://faizsiddiqui4201_db_user:AykVh1mGaudxVHEc@cluster0.yiqgbyv.mongodb.net/?appName=Cluster0');
    console.log('✅ Connected to MongoDB Atlas!');

    await Farmer.deleteMany({}); // Clear old data

    await Farmer.create({
      farmerId: 'F-101',
      name: 'Gurdev Singh',
      location: 'Jagraon, Punjab',
      kccLoan: { amount: 85000, daysUntilDue: 4 },
      liveRiskFactors: { rainfallDeficitPercent: 42, mandiPriceDropPercent: 35 }
    });

    console.log('✅ Test Farmer Added Successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();