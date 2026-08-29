const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Farmer = require('./models/Farmer');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Paste your actual hardcoded MongoDB string here (the same one from seed.js)
const MONGO_URI = 'mongodb+srv://faizsiddiqui4201_db_user:AykVh1mGaudxVHEc@cluster0.yiqgbyv.mongodb.net/?appName=Cluster0';

// Connect to Database
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Server Connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// --- API ROUTES ---

// 1. Get Farmer Data
app.get('/api/farmer/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerId: req.params.id });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Advisory Route: Returns tailored crop advice based on crop name
app.get('/api/advisory/:crop', (req, res) => {
  const crop = req.params.crop.toLowerCase();
  
  const advisories = {
    wheat: {
      pestRisk: 'High humidity detected. Watch for Yellow Rust & Aphids — apply Neem oil or Propiconazole spray.',
      rainAdvice: 'Rainfall expected soon. Delay heavy irrigation for 48 hours to prevent root rot.',
      idealNPK: { n: '75%', p: '45%', k: '80%', moisture: '40%' }
    },
    paddy: {
      pestRisk: 'Warm & humid weather favorable for Stem Borer. Apply Trichogramma bio-cards.',
      rainAdvice: 'Heavy rain favorable for standing water; ensure field bunds are intact.',
      idealNPK: { n: '85%', p: '50%', k: '70%', moisture: '75%' }
    },
    cotton: {
      pestRisk: 'High threat of Pink Bollworm in humid conditions. Inspect 20 bolls per acre.',
      rainAdvice: 'Ensure proper drainage to avoid waterlogging in cotton rows.',
      idealNPK: { n: '70%', p: '40%', k: '85%', moisture: '35%' }
    },
    tomato: {
      pestRisk: 'Favorable conditions for Early Blight. Spray Mancozeb/Copper Oxychloride before evening.',
      rainAdvice: 'High moisture detected. Stake plants to prevent soil-borne fruit infections.',
      idealNPK: { n: '60%', p: '60%', k: '90%', moisture: '50%' }
    }
  };

  const data = advisories[crop] || advisories.wheat;
  res.json(data);
});

// 3. Mandi Router Route: Calculates net profit based on distance and yield
app.post('/api/mandi/calculate', (req, res) => {
  const { crop, yieldQuintals } = req.body;
  
  const mspTable = { Wheat: 2275, Paddy: 2183, Cotton: 6620, Tomato: 1800 };
  const baseMsp = mspTable[crop] || 2275;

  const mandis = [
    { name: 'Local APMC Mandi', distance: 7, price: baseMsp + 50 },
    { name: 'Central District Mandi', distance: 28, price: baseMsp + 180 },
    { name: 'Regional Terminal Market', distance: 54, price: Math.round(baseMsp * 0.88), drop: 'Below MSP' }
  ];

  const calculatedMandis = mandis.map(m => {
    const grossRevenue = m.price * (yieldQuintals || 20);
    const transportCost = m.distance * 15; // ₹15 per km
    const netProfit = grossRevenue - transportCost;
    return { ...m, grossRevenue, transportCost, netProfit };
  });

  res.json(calculatedMandis);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Krishi Backend running on http://localhost:${PORT}`);
});