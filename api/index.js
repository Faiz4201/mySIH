import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Successfully connected to MongoDB Atlas!");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Pre-configured agronomic benchmarks per crop (used as mock fallbacks if DB empty)
const CROP_DATABASE = {
  Wheat: {
    idealNPK: { n: '75%', p: '45%', k: '80%', moisture: '40%' },
    msp: 2275,
    advisoryPest: 'High humidity detected. Watch for Yellow Rust & Aphids — apply Neem oil or Propiconazole spray.',
    advisoryRain: 'Rainfall expected soon. Delay heavy irrigation for 48 hours to prevent root rot.'
  },
  Paddy: {
    idealNPK: { n: '85%', p: '50%', k: '70%', moisture: '75%' },
    msp: 2183,
    advisoryPest: 'Warm & humid weather favorable for Stem Borer. Apply Trichogramma bio-cards.',
    advisoryRain: 'Heavy rain favorable for standing water; ensure field bunds are intact.'
  },
  Cotton: {
    idealNPK: { n: '70%', p: '40%', k: '85%', moisture: '35%' },
    msp: 6620,
    advisoryPest: 'High threat of Pink Bollworm in humid conditions. Inspect 20 bolls per acre.',
    advisoryRain: 'Ensure proper drainage to avoid waterlogging in cotton rows.'
  },
  Tomato: {
    idealNPK: { n: '60%', p: '60%', k: '90%', moisture: '50%' },
    msp: 1800,
    advisoryPest: 'Favorable conditions for Early Blight. Spray Mancozeb/Copper Oxychloride before evening.',
    advisoryRain: 'High moisture detected. Stake plants to prevent soil-borne fruit infections.'
  }
};

// --- ROUTES ---

// 1. Advisory API (Called by Farmer Panel)
app.get('/api/advisory/:crop', async (req, res) => {
  try {
    const crop = req.params.crop;
    const cropData = CROP_DATABASE[crop] || CROP_DATABASE.Wheat;

    // In a full implementation, you would query Mongoose for live dynamic AI advisories here.
    // For now, we serve the exact schema the frontend expects.
    res.json({
      idealNPK: cropData.idealNPK,
      pestRisk: cropData.advisoryPest,
      rainAdvice: cropData.advisoryRain
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve advisory' });
  }
});

// 2. Mandi Calculation API (Called by Farmer Panel)
app.post('/api/mandi/calculate', async (req, res) => {
  try {
    const { crop, yieldQuintals } = req.body;
    const cropData = CROP_DATABASE[crop] || CROP_DATABASE.Wheat;

    // Dummy Data to emulate dynamic mandi calculations via backend
    const computedMandis = [
      {
        name: 'APMC Market (Local)',
        distance: 8,
        price: cropData.msp + 180,
        transportCost: 8 * 15, // ₹15 per km
        netProfit: (yieldQuintals * (cropData.msp + 180)) - (8 * 15)
      },
      {
        name: 'District Wholesale',
        distance: 25,
        price: cropData.msp + 450,
        transportCost: 25 * 15,
        netProfit: (yieldQuintals * (cropData.msp + 450)) - (25 * 15),
        drop: '-2% trend'
      }
    ];

    res.json(computedMandis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate mandi routing' });
  }
});

// Export the Express API to seamlessly run entirely on Vercel Serverless Edge Network!
export default app;
