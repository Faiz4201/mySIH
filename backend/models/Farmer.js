const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  kccLoan: {
    amount: Number,
    daysUntilDue: Number
  },
  liveRiskFactors: {
    rainfallDeficitPercent: Number,
    mandiPriceDropPercent: Number
  }
});

// THIS IS THE CRITICAL LINE
module.exports = mongoose.model('Farmer', FarmerSchema);