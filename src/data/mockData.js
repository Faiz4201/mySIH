// Comprehensive mock dataset for Smart Crop Advisory & Farmer Distress Early-Warning System

export const DISTRICTS = [
  { id: 'rourkela', name: 'Rourkela (Sundargarh)', state: 'Odisha', lat: 22.2274, lng: 84.8510 }
];

export const AGRI_OFFICERS = [
  { id: 'off-1', name: 'Dr. Ramesh Sharma', designation: 'Chief Extension Officer', phone: '+91 98765 43210' },
  { id: 'off-2', name: 'Smt. Anita Mishra', designation: 'Block Agri Development Officer', phone: '+91 98765 12345' },
];

export const INITIAL_FARMERS = [
  {
    id: 'F-101', name: 'Ramachandra Mahapatra', village: 'Lathikata', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000101', pass: 'farmer123', crop: 'Paddy', landAcres: 4.5, rainfallDeficit: 42, priceCrash: 35, loanDueDays: 4, loanAmount: 85000, riskScore: 92, riskLevel: 'CRITICAL', lat: 22.18, lng: 84.87, status: 'FLAGGED', assignedOfficer: 'Unassigned', primaryTrigger: 'Severe Drought + Loan Due in 4 Days'
  },
  {
    id: 'F-102', name: 'Suresh Dash', village: 'Panposh', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000102', pass: 'farmer123', crop: 'Tomato & Maize', landAcres: 3.0, rainfallDeficit: 38, priceCrash: 28, loanDueDays: 7, loanAmount: 62000, riskScore: 84, riskLevel: 'CRITICAL', lat: 22.25, lng: 84.81, status: 'FLAGGED', assignedOfficer: 'Unassigned', primaryTrigger: 'Tomato Price Collapse (-28%)'
  },
  {
    id: 'F-103', name: 'Balaram Nayak', village: 'Kalunga', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000103', pass: 'farmer123', crop: 'Paddy & Wheat', landAcres: 2.5, rainfallDeficit: 45, priceCrash: 40, loanDueDays: 3, loanAmount: 48000, riskScore: 96, riskLevel: 'CRITICAL', lat: 22.19, lng: 84.80, status: 'OFFICER_ASSIGNED', assignedOfficer: 'Smt. Anita Mishra', primaryTrigger: 'Price Crash (-40%) + Extreme Rainfall Shortfall'
  },
  {
    id: 'F-104', name: 'Trinath Sahu', village: 'Kuarmunda', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000104', pass: 'farmer123', crop: 'Vegetables', landAcres: 5.0, rainfallDeficit: 22, priceCrash: 18, loanDueDays: 18, loanAmount: 75000, riskScore: 68, riskLevel: 'MODERATE', lat: 22.31, lng: 84.77, status: 'FLAGGED', assignedOfficer: 'Unassigned', primaryTrigger: 'Moderate Price Fluctuations'
  },
  {
    id: 'F-105', name: 'Kabir Behera', village: 'Biramitrapur', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000105', pass: 'farmer123', crop: 'Sugarcane', landAcres: 3.8, rainfallDeficit: 30, priceCrash: 32, loanDueDays: 12, loanAmount: 90000, riskScore: 78, riskLevel: 'MODERATE', lat: 22.40, lng: 84.75, status: 'FLAGGED', assignedOfficer: 'Dr. Ramesh Sharma', primaryTrigger: 'Mandi Price Crash (-32%)'
  },
  {
    id: 'F-106', name: 'Lokanath Patra', village: 'Hatibari', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000106', pass: 'farmer123', crop: 'Paddy', landAcres: 6.0, rainfallDeficit: 10, priceCrash: 5, loanDueDays: 45, loanAmount: 110000, riskScore: 32, riskLevel: 'SAFE', lat: 22.39, lng: 84.95, status: 'SAFE', assignedOfficer: 'Unassigned', primaryTrigger: 'Optimal Soil & Weather Conditions'
  },
  {
    id: 'F-107', name: 'Bidyadhar Biswal', village: 'Bisra', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000107', pass: 'farmer123', crop: 'Mustard', landAcres: 4.0, rainfallDeficit: 15, priceCrash: 8, loanDueDays: 60, loanAmount: 50000, riskScore: 25, riskLevel: 'SAFE', lat: 22.25, lng: 85.00, status: 'SAFE', assignedOfficer: 'Unassigned', primaryTrigger: 'Low Risk Profile'
  },
  {
    id: 'F-108', name: 'Gobinda Pradhan', village: 'Jhirpani', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000108', pass: 'farmer123', crop: 'Tomato', landAcres: 2.0, rainfallDeficit: 35, priceCrash: 22, loanDueDays: 14, loanAmount: 38000, riskScore: 74, riskLevel: 'MODERATE', lat: 22.28, lng: 84.88, status: 'FLAGGED', assignedOfficer: 'Unassigned', primaryTrigger: 'Rainfall Shortfall + Loan Proximity'
  },
  {
    id: 'F-109', name: 'Pramod Munda', village: 'Koelnagar', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000109', pass: 'farmer123', crop: 'Maize & Wheat', landAcres: 3.5, rainfallDeficit: 10, priceCrash: 15, loanDueDays: 35, loanAmount: 25000, riskScore: 40, riskLevel: 'SAFE', lat: 22.29, lng: 84.90, status: 'SAFE', assignedOfficer: 'Unassigned', primaryTrigger: 'Stable Yield'
  },
  {
    id: 'F-110', name: 'Shyamal Kisan', village: 'Bondamunda', districtId: 'rourkela', district: 'Rourkela (Sundargarh)', phone: '9437000110', pass: 'farmer123', crop: 'Paddy', landAcres: 2.8, rainfallDeficit: 50, priceCrash: 30, loanDueDays: 5, loanAmount: 55000, riskScore: 89, riskLevel: 'CRITICAL', lat: 22.26, lng: 84.93, status: 'FLAGGED', assignedOfficer: 'Unassigned', primaryTrigger: 'High Drought Risk'
  }
];

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

// Emulate backend with LocalStorage
export function loadFarmers() {
  const stored = localStorage.getItem('krishiFarmers');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('krishiFarmers', JSON.stringify(INITIAL_FARMERS));
  return INITIAL_FARMERS;
}

export function saveFarmers(farmers) {
  localStorage.setItem('krishiFarmers', JSON.stringify(farmers));
  window.dispatchEvent(new Event('farmersStorageUpdated'));
}
