// Comprehensive mock dataset for Smart Crop Advisory & Farmer Distress Early-Warning System

export const DISTRICTS = [
  { id: 'ludhiana', name: 'Ludhiana District', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { id: 'nashik', name: 'Nashik District', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { id: 'rohtak', name: 'Rohtak District', state: 'Haryana', lat: 28.8955, lng: 76.6066 }
];

export const AGRI_OFFICERS = [
  { id: 'off-1', name: 'Dr. Ramesh Sharma', designation: 'Chief Extension Officer', phone: '+91 98765 43210' },
  { id: 'off-2', name: 'Smt. Anita Deshmukh', designation: 'Block Agri Development Officer', phone: '+91 98765 12345' },
  { id: 'off-3', name: 'Er. Vikas Patil', designation: 'Soil Health Specialist', phone: '+91 98123 45678' },
  { id: 'off-4', name: 'Dr. Gurpreet Singh', designation: 'District Crop Inspector', phone: '+91 98987 65432' }
];

export const INITIAL_FARMERS = [
  {
    id: 'F-101',
    name: 'Gurdev Singh',
    village: 'Jagraon',
    districtId: 'ludhiana',
    district: 'Ludhiana District',
    phone: '+91 94172 00101',
    crop: 'Wheat & Paddy',
    landAcres: 4.5,
    rainfallDeficit: 42, // % deficit
    priceCrash: 35, // % drop below MSP
    loanDueDays: 4, // days remaining
    loanAmount: 85000,
    riskScore: 92,
    riskLevel: 'CRITICAL',
    lat: 30.9120,
    lng: 75.8320,
    status: 'FLAGGED',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Severe Drought + Loan Due in 4 Days'
  },
  {
    id: 'F-102',
    name: 'Sukhwinder Kaur',
    village: 'Samrala',
    districtId: 'ludhiana',
    district: 'Ludhiana District',
    phone: '+91 94172 00102',
    crop: 'Cotton & Wheat',
    landAcres: 3.0,
    rainfallDeficit: 38,
    priceCrash: 28,
    loanDueDays: 7,
    loanAmount: 62000,
    riskScore: 84,
    riskLevel: 'CRITICAL',
    lat: 30.8350,
    lng: 76.1910,
    status: 'FLAGGED',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Cotton Price Collapse (-28%)'
  },
  {
    id: 'F-103',
    name: 'Ramesh Pawar',
    village: 'Kannad',
    districtId: 'aurangabad',
    district: 'Chhatrapati Sambhajinagar (Aurangabad)',
    phone: '+91 98220 11203',
    crop: 'Tomato & Maize',
    landAcres: 2.5,
    rainfallDeficit: 45,
    priceCrash: 40,
    loanDueDays: 3,
    loanAmount: 48000,
    riskScore: 96,
    riskLevel: 'CRITICAL',
    lat: 19.9200,
    lng: 75.3200,
    status: 'OFFICER_ASSIGNED',
    assignedOfficer: 'Smt. Anita Deshmukh',
    primaryTrigger: 'Tomato Price Crash (-40%) + Extreme Rainfall Shortfall'
  },
  {
    id: 'F-104',
    name: 'Sunita Patil',
    village: 'Paithan',
    districtId: 'aurangabad',
    district: 'Chhatrapati Sambhajinagar (Aurangabad)',
    phone: '+91 98220 11204',
    crop: 'Cotton & Sugarcane',
    landAcres: 5.0,
    rainfallDeficit: 22,
    priceCrash: 18,
    loanDueDays: 18,
    loanAmount: 75000,
    riskScore: 68,
    riskLevel: 'MODERATE',
    lat: 19.4800,
    lng: 75.3800,
    status: 'FLAGGED',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Moderate Price Fluctuations'
  },
  {
    id: 'F-105',
    name: 'Vikas Deshmukh',
    village: 'Sinnar',
    districtId: 'nashik',
    district: 'Nashik District',
    phone: '+91 97650 33405',
    crop: 'Onion & Grapes',
    landAcres: 3.8,
    rainfallDeficit: 30,
    priceCrash: 32,
    loanDueDays: 12,
    loanAmount: 90000,
    riskScore: 78,
    riskLevel: 'MODERATE',
    lat: 19.8500,
    lng: 73.9900,
    status: 'FLAGGED',
    assignedOfficer: 'Er. Vikas Patil',
    primaryTrigger: 'Onion Mandi Price Crash (-32%)'
  },
  {
    id: 'F-106',
    name: 'Harpreet Singh',
    village: 'Khanna',
    districtId: 'ludhiana',
    district: 'Ludhiana District',
    phone: '+91 94172 00106',
    crop: 'Paddy',
    landAcres: 6.0,
    rainfallDeficit: 10,
    priceCrash: 5,
    loanDueDays: 45,
    loanAmount: 110000,
    riskScore: 32,
    riskLevel: 'SAFE',
    lat: 30.7000,
    lng: 76.2200,
    status: 'SAFE',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Optimal Soil & Weather Conditions'
  },
  {
    id: 'F-107',
    name: 'Rajinder Kumar',
    village: 'Kalanaur',
    districtId: 'rohtak',
    district: 'Rohtak District',
    phone: '+91 98120 44107',
    crop: 'Mustard & Wheat',
    landAcres: 4.0,
    rainfallDeficit: 15,
    priceCrash: 8,
    loanDueDays: 60,
    loanAmount: 50000,
    riskScore: 25,
    riskLevel: 'SAFE',
    lat: 28.8300,
    lng: 76.4000,
    status: 'SAFE',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Low Risk Profile'
  },
  {
    id: 'F-108',
    name: 'Baljit Singh',
    village: 'Mullanpur',
    districtId: 'ludhiana',
    district: 'Ludhiana District',
    phone: '+91 94172 00108',
    crop: 'Vegetables',
    landAcres: 2.0,
    rainfallDeficit: 35,
    priceCrash: 22,
    loanDueDays: 14,
    loanAmount: 38000,
    riskScore: 74,
    riskLevel: 'MODERATE',
    lat: 30.9300,
    lng: 75.7100,
    status: 'FLAGGED',
    assignedOfficer: 'Unassigned',
    primaryTrigger: 'Rainfall Shortfall + Loan Proximity'
  }
];

// Calculation function for distress risk score (0-100)
export function calculateDistressScore(rainDeficit, priceCrashPct, loanDays) {
  const wRain = Math.min(100, Math.max(0, (rainDeficit / 50) * 100)) * 0.40;
  const wPrice = Math.min(100, Math.max(0, (priceCrashPct / 40) * 100)) * 0.35;
  
  let loanScore = 0;
  if (loanDays <= 30) {
    loanScore = ((30 - Math.max(1, loanDays)) / 29) * 100;
  }
  const wLoan = loanScore * 0.25;

  const totalScore = Math.round(wRain + wPrice + wLoan);
  
  let riskLevel = 'SAFE';
  if (totalScore >= 80) riskLevel = 'CRITICAL';
  else if (totalScore >= 55) riskLevel = 'MODERATE';

  return { totalScore, riskLevel };
}
