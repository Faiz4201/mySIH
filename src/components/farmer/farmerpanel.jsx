import { useState, useEffect } from 'react';

// Pre-configured agronomic benchmarks per crop (used as fallbacks)
const CROP_DATABASE = {
  Wheat: {
    icon: '🌾',
    accent: '#C99A3E',
    idealNPK: { n: '75%', p: '45%', k: '80%', moisture: '40%' },
    msp: 2275,
    advisoryPest: 'High humidity detected. Watch for Yellow Rust & Aphids — apply Neem oil or Propiconazole spray.',
    advisoryRain: 'Rainfall expected soon. Delay heavy irrigation for 48 hours to prevent root rot.'
  },
  Paddy: {
    icon: '🌱',
    accent: '#5E8B57',
    idealNPK: { n: '85%', p: '50%', k: '70%', moisture: '75%' },
    msp: 2183,
    advisoryPest: 'Warm & humid weather favorable for Stem Borer. Apply Trichogramma bio-cards.',
    advisoryRain: 'Heavy rain favorable for standing water; ensure field bunds are intact.'
  },
  Cotton: {
    icon: '☁️',
    accent: '#7FA7B3',
    idealNPK: { n: '70%', p: '40%', k: '85%', moisture: '35%' },
    msp: 6620,
    advisoryPest: 'High threat of Pink Bollworm in humid conditions. Inspect 20 bolls per acre.',
    advisoryRain: 'Ensure proper drainage to avoid waterlogging in cotton rows.'
  },
  Tomato: {
    icon: '🍅',
    accent: '#C1694F',
    idealNPK: { n: '60%', p: '60%', k: '90%', moisture: '50%' },
    msp: 1800,
    advisoryPest: 'Favorable conditions for Early Blight. Spray Mancozeb/Copper Oxychloride before evening.',
    advisoryRain: 'High moisture detected. Stake plants to prevent soil-borne fruit infections.'
  }
};

export default function FarmerPanel({ onBackToHome }) {
  const [lang, setLang] = useState('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioItem, setAudioItem] = useState(null);
  const [distressSent, setDistressSent] = useState(false);
  const [translatedBackendAdvisory, setTranslatedBackendAdvisory] = useState({ pestRisk: null, rainAdvice: null });

  // Backend Data & Dynamic Score State
  const [farmerData, setFarmerData] = useState(null);
  const [distressScore, setDistressScore] = useState(88);

  // --- NEW: Backend Advisory & Mandi States ---
  const [backendAdvisory, setBackendAdvisory] = useState(null);
  const [backendMandis, setBackendMandis] = useState([]);

  // User Interactive Profile
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [cropAcreage, setCropAcreage] = useState(4.5);
  const [estimatedYieldQuintals, setEstimatedYieldQuintals] = useState(20);

  // Location & Weather state
  const [locationName, setLocationName] = useState('Rourkela, Odisha');
  const [coords, setCoords] = useState({ lat: 22.25, lng: 84.81 });
  const [weather, setWeather] = useState({
    temp: 31,
    humidity: 68,
    rainForecast: '25mm',
    windSpeed: 12,
    isPestRisk: true,
    isStormRisk: false
  });
  const [loadingWeather, setLoadingWeather] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const district = data.address.state_district || data.address.county || data.address.city || 'Local Area';
          const state = data.address.state || 'India';
          setLocationName(`${district}, ${state}`);
        } catch {
          setLocationName(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
        }
        fetchWeatherData(latitude, longitude);
      },
      () => {
        setLoadingWeather(false);
        alert('Could not retrieve location. Using default region.');
      }
    );
  };

  const fetchWeatherData = async (lat, lng) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_sum&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      const temp = Math.round(data.current?.temperature_2m || 30);
      const humidity = Math.round(data.current?.relative_humidity_2m || 65);
      const windSpeed = Math.round(data.current?.wind_speed_10m || 10);
      const rain = `${data.daily?.precipitation_sum?.[0] || 0}mm`;

      const isPest = humidity > 65 && temp >= 24 && temp <= 35;
      const isStorm = windSpeed > 25 || parseFloat(rain) > 20;

      setWeather({ temp, humidity, rainForecast: rain, windSpeed, isPestRisk: isPest, isStormRisk: isStorm });
    } catch (e) {
      console.error('Weather fetch error:', e);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(coords.lat, coords.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Database Payload from Local Sync (emulated backend)
  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const { loadFarmers } = await import('../../data/mockData.js');
        const allFarmers = loadFarmers();
        const loggedInId = localStorage.getItem('loggedInFarmerId') || 'F-101';
        const current = allFarmers.find(f => f.id === loggedInId) || allFarmers[0];

        setFarmerData(current);

        if (current.crop) {
          setSelectedCrop(current.crop.split(' & ')[0] || 'Wheat');
        }
        if (current.lat && current.lng) {
          setCoords({ lat: current.lat, lng: current.lng });
          setLocationName(`${current.village}, ${current.district}`);
        }
      } catch (error) {
        console.error("Local fetch error:", error);
      }
    };
    fetchLocalData();
  }, []);

  // --- NEW: Fetch Dynamic Backend Advisory when Crop Changes ---
  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const res = await fetch(`/api/advisory/${selectedCrop}`);
        const data = await res.json();
        setBackendAdvisory(data);
      } catch (err) {
        console.error('Advisory fetch error:', err);
      }
    };
    fetchAdvisory();
  }, [selectedCrop]);

  // --- NEW: Fetch Transport-Optimized Mandi Calculations from Backend ---
  useEffect(() => {
    const fetchMandis = async () => {
      try {
        const res = await fetch('/api/mandi/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop: selectedCrop, yieldQuintals: estimatedYieldQuintals })
        });
        const data = await res.json();
        setBackendMandis(data);
      } catch (err) {
        console.error('Mandi calculation error:', err);
      }
    };
    fetchMandis();
  }, [selectedCrop, estimatedYieldQuintals]);

  // The Distress Calculation Engine
  useEffect(() => {
    if (farmerData && weather) {
      let score = 40;
      const rain = parseFloat(weather.rainForecast) || 0;
      if (rain < 2) score += 25;
      else if (rain > 15) score -= 15;

      if (farmerData.kccLoan?.daysUntilDue <= 7) {
        score += 20;
      }

      score += ((farmerData.liveRiskFactors?.mandiPriceDropPercent || 0) * 0.5);

      const finalScore = Math.min(100, Math.max(0, Math.round(score)));
      setDistressScore(finalScore);
    }
  }, [farmerData, weather]);

  useEffect(() => {
    async function translateBackendData() {
      if (!backendAdvisory) {
        setTranslatedBackendAdvisory({ pestRisk: null, rainAdvice: null });
        return;
      }

      if (lang === 'en') {
        setTranslatedBackendAdvisory({ pestRisk: backendAdvisory.pestRisk, rainAdvice: backendAdvisory.rainAdvice });
        return;
      }

      const targetLang = lang === 'hi' ? 'hi' : lang === 'or' ? 'or' : 'en';
      try {
        const pestRes = await fetch(`/api/translate/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(backendAdvisory.pestRisk)}`);
        const pestData = await pestRes.json();
        const translatedPest = pestData[0].map(x => x[0]).join('');

        const rainRes = await fetch(`/api/translate/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(backendAdvisory.rainAdvice)}`);
        const rainData = await rainRes.json();
        const translatedRain = rainData[0].map(x => x[0]).join('');

        setTranslatedBackendAdvisory({ pestRisk: translatedPest, rainAdvice: translatedRain });
      } catch (err) {
        console.error("Translation fail:", err);
        // If the translation API is completely blocked by the browser, fallback to our LOCAL 
        // internal dictionary translation instead of forcing the English backend text onto the screen!
        setTranslatedBackendAdvisory({ pestRisk: null, rainAdvice: null });
      }
    }
    translateBackendData();
  }, [lang, backendAdvisory]);

  const translations = {
    en: {
      appName: 'KrishiRakshak Farmer',
      tagline: 'Hyperlocal Crop Advisory & Smart Mandi Router',
      liveStatus: 'Advisory Engine Active',
      listenBtn: 'Listen Audio Advisory',
      stopAudio: 'Stop Audio',
      cropConfigTitle: 'Crop & Land Configuration',
      selectCrop: 'Your primary crop',
      acreageLabel: 'Land under cultivation (acres)',
      yieldLabel: 'Estimated yield (Quintal)',
      mspLabel: 'Govt MSP',
      weatherTitle: 'Hyperlocal Weather & Field Status',
      soilTitle: 'Recommended soil & field status',
      advisoryTitle: 'Actionable recommendation',
      mandiTitle: 'Real-time mandi price comparison',
      mandiSub: 'Net profit calculated for your estimated yield',
      financialTitle: 'Farmer financial safety & risk status',
      requestBtn: 'Request agri-officer assistance',
      requestSent: 'Assistance requested. District agri-officer dispatched.',
      crops: { Wheat: 'Wheat', Paddy: 'Paddy', Cotton: 'Cotton', Tomato: 'Tomato' },
      metrics: {
        weatherLabel: 'Live weather', rainForecast: 'Rain forecast:', wind: 'Wind:', hum: 'Hum:',
        pestRiskTitle: 'Pest & disease outbreak risk', highRisk: 'High risk', lowRisk: 'Low risk', sprayNeeded: 'Spray needed',
        activeThreat: 'Active threat for', inHumid: 'in humid weather', bestPriceTitle: 'Best nearby market price', overMsp: 'over MSP'
      },
      soil: { n: 'Nitrogen (N)', p: 'Phosphorus (P)', k: 'Potassium (K)', moisture: 'Optimal soil moisture' },
      mandi: { name: 'Mandi name', distance: 'Distance', price: 'Price / quintal', transport: 'Est. transport cost', profit: 'Est. net profit', action: 'Action', lock: 'Lock mandi price' },
      financial: { riskFactors: 'Identified risk factors', rainIrregularity: 'Rainfall irregularity', highVariance: 'High variance', kccStatus: 'KCC loan status', paymentDue: 'Payment due in', days: 'days', bimaStatus: 'PM Fasal Bima insurance status', activePolicy: 'Active · Policy' },
      advisories: {
        Wheat: {
          pest: 'High humidity detected. Watch for Yellow Rust & Aphids — apply Neem oil or Propiconazole spray.',
          rain: 'Rainfall expected soon. Delay heavy irrigation for 48 hours to prevent root rot.'
        },
        Paddy: {
          pest: 'Warm & humid weather favorable for Stem Borer. Apply Trichogramma bio-cards.',
          rain: 'Heavy rain favorable for standing water; ensure field bunds are intact.'
        },
        Cotton: {
          pest: 'High threat of Pink Bollworm in humid conditions. Inspect 20 bolls per acre.',
          rain: 'Ensure proper drainage to avoid waterlogging in cotton rows.'
        },
        Tomato: {
          pest: 'Favorable conditions for Early Blight. Spray Mancozeb/Copper Oxychloride before evening.',
          rain: 'High moisture detected. Stake plants to prevent soil-borne fruit infections.'
        }
      }
    },
    hi: {
      appName: 'कृषि रक्षक किसान',
      tagline: 'स्थानीय फसल परामर्श एवं स्मार्ट मंडी तंत्र',
      liveStatus: 'सलाह इंजन सक्रिय',
      listenBtn: 'ऑडियो सलाह सुनें',
      stopAudio: 'ऑडियो रोकें',
      cropConfigTitle: 'फसल और भूमि विन्यास',
      selectCrop: 'आपकी मुख्य फसल',
      acreageLabel: 'खेती के अंतर्गत भूमि (एकड़)',
      yieldLabel: 'अनुमानित उपज (क्विंटल)',
      mspLabel: 'सरकार MSP',
      weatherTitle: 'स्थानीय मौसम और खेत की स्थिति',
      soilTitle: 'अनुशंसित मृदा एवं खेत स्थिति',
      advisoryTitle: 'कार्रवाई योग्य सलाह',
      mandiTitle: 'मंडी बाजार मूल्य तुलना',
      mandiSub: 'आपकी अनुमानित उपज पर आधारित शुद्ध लाभ',
      financialTitle: 'किसान वित्तीय स्थिति और संकट चेतावनी',
      requestBtn: 'कृषि अधिकारी सहायता का अनुरोध करें',
      requestSent: 'सहायता का अनुरोध किया गया। जिला अधिकारी तैनात।',
      crops: { Wheat: 'गेहूं (Wheat)', Paddy: 'धान (Paddy)', Cotton: 'कपास (Cotton)', Tomato: 'टमाटर (Tomato)' },
      metrics: { weatherLabel: 'वास्तविक मौसम', rainForecast: 'बारिश:', wind: 'हवा:', hum: 'नमी:', pestRiskTitle: 'कीट एवं रोग प्रकोप जोखिम', highRisk: 'उच्च जोखिम', lowRisk: 'कम जोखिम', sprayNeeded: 'छिड़काव आवश्यक', activeThreat: 'नम मौसम में सक्रिय खतरा', inHumid: '', bestPriceTitle: 'सर्वश्रेष्ठ मंडी मूल्य', overMsp: 'MSP से ज्यादा' },
      soil: { n: 'नाइट्रोजन (N)', p: 'फास्फोरस (P)', k: 'पोटेशियम (K)', moisture: 'इष्टतम मिट्टी की नमी' },
      mandi: { name: 'मंडी का नाम', distance: 'दूरी', price: 'मूल्य / क्विंटल', transport: 'परिवहन लागत', profit: 'अनुमानित शुद्ध लाभ', action: 'कार्रवाई', lock: 'मूल्य लॉक करें' },
      financial: { riskFactors: 'पहचाने गए जोखिम', rainIrregularity: 'वर्षा अनियमितता', highVariance: 'उच्च भिन्नता', kccStatus: 'KCC ऋण स्थिति', paymentDue: 'देय भुगतान', days: 'दिनों में', bimaStatus: 'पीएम फसल बीमा स्थिति', activePolicy: 'सक्रिय · पॉलिसी' },
      advisories: {
        Wheat: {
          pest: 'उच्च आर्द्रता। पीला रतुआ और एफिड्स के लिए ध्यान दें — नीम का तेल या प्रोपिकोनाज़ोल स्प्रे करें।',
          rain: 'जल्द ही बारिश की उम्मीद है। जड़ सड़न को रोकने के लिए 48 घंटे तक भारी सिंचाई रोकें।'
        },
        Paddy: {
          pest: 'स्टेम बोरर (तना छेदक) के लिए मौसम अनुकूल है। ट्राइकोग्रामा बायो-कार्ड लगाएं।',
          rain: 'भारी बारिश ठहरे हुए पानी के लिए अनुकूल है; सुनिश्चित करें कि खेत की मेड़ें सुरक्षित हैं।'
        },
        Cotton: {
          pest: 'आर्द्र अवस्था में पिंक बॉलवॉर्म (गुलाबी सुंडी) की उच्च आशंका। प्रति एकड़ 20 टिंडों का निरीक्षण करें।',
          rain: 'कपास की पंक्तियों में जलभराव से बचने के लिए उचित जल निकासी सुनिश्चित करें।'
        },
        Tomato: {
          pest: 'अर्ली ब्लाइट (अगेती झुलसा) के लिए अनुकूल परिस्थितियां। शाम से पहले मैन्कोज़ेब / कॉपर ऑक्सीक्लोराइड का छिड़काव करें।',
          rain: 'उच्च नमी का पता चला। मिट्टी से होने वाले फलों के संक्रमण को रोकने के लिए पौधों को सहारा दें।'
        }
      }
    },
    or: {
      appName: 'କୃଷି ରକ୍ଷକ କୃଷକ',
      tagline: 'ସ୍ଥାନୀୟ ଫସଲ ପରାମର୍ଶ ଏବଂ ସ୍ମାର୍ଟ ମଣ୍ଡି ପ୍ରଣାଳୀ',
      liveStatus: 'ପରାମର୍ଶ ଇଞ୍ଜିନ ସକ୍ରିୟ',
      listenBtn: 'ଅଡିଓ ପରାମର୍ଶ ଶୁଣନ୍ତୁ',
      stopAudio: 'ଅଡିଓ ବନ୍ଦ କରନ୍ତୁ',
      cropConfigTitle: 'ଫସଲ ଏବଂ ଜମି ବିନ୍ୟାସ',
      selectCrop: 'ଆପଣଙ୍କର ମୁଖ୍ୟ ଫସଲ',
      acreageLabel: 'ଚାଷ ଅଧୀନରେ ଥିବା ଜମି (ଏକର)',
      yieldLabel: 'ଆନୁମାନିକ ଅମଳ (କୁଇଣ୍ଟାଲ)',
      mspLabel: 'ସରକାରୀ ଏମଏସପି (MSP)',
      weatherTitle: 'ସ୍ଥାନୀୟ ପାଣିପାଗ ଏବଂ କ୍ଷେତ ସ୍ଥିତି',
      soilTitle: 'ପରାମର୍ଶିତ ମୃତ୍ତିକା ଏବଂ କ୍ଷେତ ସ୍ଥିତି',
      advisoryTitle: 'କାର୍ଯ୍ୟକାରୀ ପରାମର୍ଶ',
      mandiTitle: 'ମଣ୍ଡି ବଜାର ମୂଲ୍ୟ ତୁଳନା',
      mandiSub: 'ଆପଣଙ୍କର ଆନୁମାନିକ ଅମଳ ଉପରେ ଆଧାରିତ ଶୁଦ୍ଧ ଲାଭ',
      financialTitle: 'କୃଷକ ଆର୍ଥିକ ସୁରକ୍ଷା ସ୍ଥିତି',
      requestBtn: 'ସହାୟତା ଅନୁରୋଧ କରନ୍ତୁ',
      requestSent: 'ସହାୟତା ଅନୁରୋଧ କରାଯାଇଛି। କୃଷି ଅଧିକାରୀ ନିୟୋଜିତ।',
      crops: { Wheat: 'ଗହମ (Wheat)', Paddy: 'ଧାନ (Paddy)', Cotton: 'କପା (Cotton)', Tomato: 'ଟମାଟୋ (Tomato)' },
      metrics: { weatherLabel: 'ସିଧାସଳଖ ପାଣିପାଗ', rainForecast: 'ବର୍ଷା ପୂର୍ବାନୁମାନ:', wind: 'ପବନ:', hum: 'ଆର୍ଦ୍ରତା:', pestRiskTitle: 'କୀଟ ଏବଂ ରୋଗ ଆଶଙ୍କା', highRisk: 'ଉଚ୍ଚ ବିପଦ', lowRisk: 'କମ୍ ବିପଦ', sprayNeeded: 'ସ୍ପ୍ରେ ଦରକାର', activeThreat: 'ଆର୍ଦ୍ର ପାଣିପାଗରେ ସକ୍ରିୟ ବିପଦ', inHumid: '', bestPriceTitle: 'ସର୍ବୋତ୍ତମ ବଜାର ମୂଲ୍ୟ', overMsp: 'MSP ଉପରେ' },
      soil: { n: 'ଯବକ୍ଷାରଜାନ (N)', p: 'ଫସଫରସ୍ (P)', k: 'ପଟାସିୟମ୍ (K)', moisture: 'ମୃତ୍ତିକା ଆର୍ଦ୍ରତା' },
      mandi: { name: 'ମଣ୍ଡି ନାମ', distance: 'ଦୂରତା', price: 'ମୂଲ୍ୟ / କୁଇଣ୍ଟାଲ', transport: 'ପରିବହନ ଖର୍ଚ୍ଚ', profit: 'ଆନୁମାନିକ ଶୁଦ୍ଧ ଲାଭ', action: 'କାର୍ଯ୍ୟ', lock: 'ମୂଲ୍ୟ ଫିକ୍ସ କରନ୍ତୁ' },
      financial: { riskFactors: 'ଚିହ୍ନିତ ବିପଦ କାରଣଗୁଡିକ', rainIrregularity: 'ବର୍ଷା ଅନିୟମିତତା', highVariance: 'ଉଚ୍ଚ ପରିବର୍ତ୍ତନଶୀଳତା', kccStatus: 'କେସିସି (KCC) ଋଣ ସ୍ଥିତି', paymentDue: 'ଦେୟ ବାକି ଅଛି', days: 'ଦିନରେ', bimaStatus: 'ପିଏମ ଫସଲ ବୀମା', activePolicy: 'ସକ୍ରିୟ · ପଲିସି' },
      advisories: {
        Wheat: {
          pest: 'ଉଚ୍ଚ ଆର୍ଦ୍ରତା ଦେଖାଯାଇଛି। ୟେଲୋ ରଷ୍ଟ ଗୁଡିକ ପାଇଁ ସତର୍କ ରୁହନ୍ତୁ - ନିମ୍ବ ତେଲ ସ୍ପ୍ରେ କରନ୍ତୁ।',
          rain: 'ଶୀଘ୍ର ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି। ମୂଳ ପଚାକୁ ରୋକିବା ପାଇଁ ୪୮ ଘଣ୍ଟା ପର୍ଯ୍ୟନ୍ତ ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ।'
        },
        Paddy: {
          pest: 'ଷ୍ଟେମ୍ ବୋରର୍ ପାଇଁ ପାଗ ଅନୁକୂଳ। ଟ୍ରାଇକୋଗ୍ରାମା ବାୟୋ-କାର୍ଡ ପ୍ରୟୋଗ କରନ୍ତୁ।',
          rain: 'ଠିଆ ପାଣି ପାଇଁ ପ୍ରବଳ ବର୍ଷା ଅନୁକୂଳ; କ୍ଷେତ ହୁଡା ସୁରକ୍ଷିତ ଥିବା ନିଶ୍ଚିତ କରନ୍ତୁ।'
        },
        Cotton: {
          pest: 'ଆର୍ଦ୍ର ଅବସ୍ଥାରେ ପିଙ୍କ୍ ବୋଲୱର୍ମର ଉଚ୍ଚ ଆଶଙ୍କା। ଏକର ପିଛା ୨୦ଟି ବୋଲ୍ ଯାଞ୍ଚ କରନ୍ତୁ।',
          rain: 'ତୁଳା ଧାଡିରେ ଜଳାବଦ୍ଧତା ଯେପରି ନହୁଏ ସେଥିପାଇଁ ଉପଯୁକ୍ତ ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା ନିଶ୍ଚିତ କରନ୍ତୁ।'
        },
        Tomato: {
          pest: 'ଅର୍ଲି ବ୍ଲାଇଟ୍ ରୋଗ ପାଇଁ ଅନୁକୂଳ ପରିସ୍ଥିତି। ସନ୍ଧ୍ୟା ପୂର୍ବରୁ ମାନକୋଜେବ୍ ସ୍ପ୍ରେ କରନ୍ତୁ।',
          rain: 'ଉଚ୍ଚ ଆର୍ଦ୍ରତା ଦେଖାଯାଇଛି। ଫଳ ସଂକ୍ରମଣକୁ ରୋକିବା ପାଇଁ ଗଛକୁ ଟେକି ରଖନ୍ତୁ।'
        }
      }
    }
  };

  const text = translations[lang] || translations.en;
  const currentCropData = CROP_DATABASE[selectedCrop] || CROP_DATABASE.Wheat;

  // Utilize the dynamically translated remote backend advisory values first, fallback to internal language dictionary
  // IF the incoming backend string precisely matches our generic english mock database, intercept and route directly to our PERFECT hand-written human locales!
  const isMockPest = backendAdvisory?.pestRisk === currentCropData.advisoryPest;
  const isMockRain = backendAdvisory?.rainAdvice === currentCropData.advisoryRain;

  const activePestAdvisory = isMockPest
    ? text.advisories[selectedCrop]?.pest
    : (translatedBackendAdvisory.pestRisk || text.advisories[selectedCrop]?.pest || currentCropData.advisoryPest);

  const activeRainAdvisory = isMockRain
    ? text.advisories[selectedCrop]?.rain
    : (translatedBackendAdvisory.rainAdvice || text.advisories[selectedCrop]?.rain || currentCropData.advisoryRain);
  const activeNPK = backendAdvisory?.idealNPK || currentCropData.idealNPK;

  const handleVoiceNarration = async () => {
    // 1. Aggressively cancel any native speech that might be stuck
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      if (audioItem) audioItem.pause();
      setIsPlayingAudio(false);
      return;
    }

    const degreesText = lang === 'hi' ? 'डिग्री' : lang === 'or' ? 'ଡିଗ୍ରୀ' : 'degrees';
    const narration = `${text.weatherTitle}: ${weather.temp} ${degreesText}. ${text.advisoryTitle}: ${weather.isPestRisk ? activePestAdvisory : activeRainAdvisory}`;

    setIsPlayingAudio(true);

    try {
      // Map internal lang to Sarvam TTS AI lang format (Odia acts as 'od-IN')
      const langCode = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'od-IN' : 'en-IN';

      // We use Vite's internal proxy '/api/sarvam' to bypass browser CORS entirely!
      const res = await fetch('/api/sarvam/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [narration],
          target_language_code: langCode,
          speaker: "priya",
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: "bulbul:v3"
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Sarvam HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const base64Audio = data.audios[0];

      const audio = new window.Audio("data:audio/wav;base64," + base64Audio);
      setAudioItem(audio);

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);

      await audio.play();
    } catch (err) {
      console.error("Sarvam API failed:", err);
      alert("Sarvam Audio API Failed:\n" + err.message + "\n\nFalling back to your standard PC voice.");
      // Fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(narration);
        utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'or-IN' : 'en-IN';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    }
  };

  const handleRequestAssistance = async () => {
    setDistressSent(true);
    const { loadFarmers, saveFarmers } = await import('../../data/mockData.js');
    const allFarmers = loadFarmers();
    const loggedInId = localStorage.getItem('loggedInFarmerId') || 'F-101';

    // Update the state for the admin panel sync
    const updatedFarmers = allFarmers.map(f => {
      if (f.id === loggedInId) {
        return {
          ...f,
          riskScore: Math.max(90, f.riskScore), // ensure it shows critical if SOS sent
          riskLevel: 'CRITICAL',
          status: 'FLAGGED',
          primaryTrigger: 'EMERGENCY: Farmer Requested Immediate SOS Assistance'
        };
      }
      return f;
    });

    saveFarmers(updatedFarmers);
  };

  const gaugeRadius = 52;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference * (1 - distressScore / 100);

  return (
    <div className="krishi-dashboard" style={{ '--crop-accent': currentCropData.accent }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .krishi-dashboard {
          --forest: #3E5C46;
          --forest-deep: #2C4534;
          --sage: #7C9473;
          --sage-light: #E7EEE0;
          --parchment: #F6F3EA;
          --card: #FFFEFA;
          --gold: #C99A3E;
          --gold-light: #FBF0D9;
          --clay: #C1694F;
          --clay-light: #F7E7E1;
          --sky: #7FA7B3;
          --sky-light: #E7F1F3;
          --ink: #2B332C;
          --muted: #6E7A6A;
          --hairline: #E4E1D2;
          --crop-accent: #C99A3E;
          font-family: 'Manrope', -apple-system, sans-serif;
          color: var(--ink);
          background:
            radial-gradient(ellipse 900px 500px at 85% -5%, rgba(201,154,62,0.10), transparent 60%),
            radial-gradient(ellipse 700px 500px at -5% 10%, rgba(124,148,115,0.14), transparent 55%),
            var(--parchment);
          min-height: 100vh;
          line-height: 1.5;
        }
        .krishi-dashboard * { box-sizing: border-box; }
        .krishi-dashboard h1, .krishi-dashboard h2, .krishi-dashboard h3, .krishi-dashboard h4 {
          font-family: 'Fraunces', Georgia, serif;
          color: var(--forest-deep);
          margin: 0;
        }

        /* ---------- Top navbar ---------- */
        .top-navbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
          padding: 16px 28px;
          background: linear-gradient(180deg, #FFFEFA, #FBF9F1);
          border-bottom: 1px solid var(--hairline);
          position: sticky; top: 0; z-index: 10;
        }
        .nav-left { display: flex; align-items: center; gap: 14px; }
        .btn-nav-home {
          border: 1px solid var(--hairline); background: var(--card); color: var(--muted);
          border-radius: 999px; padding: 9px 16px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; transition: all .15s ease; font-family: inherit;
        }
        .btn-nav-home:hover { background: var(--sage-light); color: var(--forest-deep); border-color: var(--sage); }
        .brand-logo {
          width: 46px; height: 46px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; background: linear-gradient(160deg, var(--sage-light), #d7e4cb);
          box-shadow: inset 0 0 0 1px rgba(62,92,70,0.1);
        }
        .brand-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: var(--forest-deep); display: flex; align-items: center; gap: 10px; }
        .brand-subtitle { font-size: 12.5px; color: var(--muted); margin-top: 1px; }
        .status-badge-green {
          font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .02em;
          color: #3E7A4C; background: #E4F2E2; border-radius: 999px; padding: 3px 10px;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .status-badge-green::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #4C9A5A; }

        .nav-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .btn-gps {
          border: 1px solid var(--hairline); background: var(--card); color: var(--forest-deep);
          border-radius: 999px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all .15s ease;
        }
        .btn-gps:hover { border-color: var(--sage); background: var(--sage-light); }

        .lang-picker { display: flex; background: var(--sage-light); border-radius: 999px; padding: 3px; gap: 2px; }
        .lang-pill {
          border: none; background: transparent; color: var(--muted); font-family: inherit;
          font-size: 12.5px; font-weight: 700; padding: 7px 13px; border-radius: 999px; cursor: pointer;
          transition: all .15s ease;
        }
        .lang-pill.active { background: var(--forest); color: #fff; box-shadow: 0 2px 6px rgba(44,69,52,0.25); }

        .btn-narration {
          border: 1px solid var(--forest); background: var(--forest); color: #fff;
          border-radius: 999px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: all .15s ease; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-narration:hover { background: var(--forest-deep); }
        .btn-narration.narration-active { background: var(--clay); border-color: var(--clay); animation: pulse-soft 1.6s ease-in-out infinite; }
        @keyframes pulse-soft { 0%,100% { box-shadow: 0 0 0 0 rgba(193,105,79,0.35); } 50% { box-shadow: 0 0 0 8px rgba(193,105,79,0); } }

        /* ---------- Main content ---------- */
        .dashboard-content { max-width: 1180px; margin: 0 auto; padding: 26px 28px 60px; display: flex; flex-direction: column; gap: 22px; }

        .card-section {
          background: var(--card); border: 1px solid var(--hairline); border-radius: 20px;
          padding: 24px 26px; box-shadow: 0 10px 30px rgba(62,92,70,0.05);
        }
        .section-header { margin-bottom: 16px; }
        .section-header h3 { font-size: 19px; font-weight: 600; }
        .section-sub { color: var(--muted); font-size: 13px; margin-top: 3px; }

        /* ---------- Crop configuration ---------- */
        .crop-config-section { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .crop-badge-wrap { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
        .crop-badge-glow {
          position: absolute; inset: -10px; border-radius: 50%;
          background: radial-gradient(circle, var(--crop-accent) 0%, transparent 70%);
          opacity: 0.28; animation: breathe 4s ease-in-out infinite; transition: background 0.4s ease;
        }
        @keyframes breathe { 0%,100% { transform: scale(0.94); opacity: 0.22; } 50% { transform: scale(1.06); opacity: 0.36; } }
        .crop-badge {
          position: relative; width: 84px; height: 84px; border-radius: 50%;
          background: var(--card); border: 2px solid var(--crop-accent);
          display: flex; align-items: center; justify-content: center; font-size: 38px;
          transition: border-color 0.4s ease;
        }

        .crop-config-fields { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 14px; }
        .field-label { font-size: 12.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; display: block; }

        .crop-select-wrap { position: relative; max-width: 320px; }
        .crop-select {
          width: 100%; appearance: none; -webkit-appearance: none;
          background: var(--sage-light); border: 1.5px solid transparent; color: var(--forest-deep);
          font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15.5px;
          padding: 12px 42px 12px 16px; border-radius: 14px; cursor: pointer;
          transition: all .15s ease;
        }
        .crop-select:hover { border-color: var(--sage); }
        .crop-select:focus { outline: none; border-color: var(--crop-accent); background: var(--card); }
        .crop-select-chevron {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: var(--forest); font-size: 12px;
        }

        .crop-meta-row { display: flex; gap: 28px; flex-wrap: wrap; }
        .meta-input-group { display: flex; flex-direction: column; }
        .meta-input {
          border: 1.5px solid var(--hairline); background: var(--parchment); border-radius: 10px;
          padding: 8px 12px; font-family: inherit; font-weight: 700; font-size: 14.5px; color: var(--forest-deep);
          width: 110px; transition: border-color .15s ease;
        }
        .meta-input:focus { outline: none; border-color: var(--sage); }
        .meta-static { display: flex; flex-direction: column; justify-content: center; }
        .meta-static .meta-value { font-weight: 700; font-size: 15px; color: var(--gold); }

        /* ---------- Metrics row ---------- */
        .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .metric-card {
          background: var(--card); border: 1px solid var(--hairline); border-radius: 18px;
          padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;
          box-shadow: 0 8px 22px rgba(62,92,70,0.05); transition: transform .15s ease;
        }
        .metric-card.alert-card { border-color: rgba(193,105,79,0.35); background: linear-gradient(180deg, var(--clay-light), var(--card) 60%); }
        .metric-icon-box {
          width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .metric-icon-box.blue { background: var(--sky-light); }
        .metric-icon-box.red { background: var(--clay-light); }
        .metric-icon-box.green { background: var(--gold-light); }
        .metric-data { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .metric-label { font-size: 12px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
        .metric-main-val { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: var(--forest-deep); display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .metric-main-val.red-text { color: var(--clay); }
        .trend-up { font-size: 13px; color: var(--muted); font-family: 'Manrope', sans-serif; font-weight: 600; }
        .metric-subtext { font-size: 12.5px; color: var(--muted); }
        .badge-critical {
          font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: .02em;
          background: var(--clay); color: #fff; padding: 3px 9px; border-radius: 999px;
        }

        /* ---------- Advisory grid ---------- */
        .advisory-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 760px) { .advisory-grid { grid-template-columns: 1fr; } }
        .box-title { font-size: 14px; font-weight: 700; color: var(--forest-deep); margin-bottom: 14px; font-family: 'Manrope', sans-serif; }
        .soil-card-box { background: var(--parchment); border-radius: 16px; padding: 20px; }
        .soil-item { margin-bottom: 14px; }
        .soil-item:last-child { margin-bottom: 0; }
        .soil-meta { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: var(--ink); font-weight: 600; }
        .val-text { color: var(--muted); font-weight: 700; }
        .progress-bg { height: 8px; border-radius: 999px; background: var(--hairline); overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 999px; transition: width .5s ease; }
        .progress-fill.green { background: linear-gradient(90deg, #8FAE7D, #5E8B57); }
        .progress-fill.yellow { background: linear-gradient(90deg, #E4BE73, var(--gold)); }
        .progress-fill.blue-fill { background: linear-gradient(90deg, #A8CAD3, var(--sky)); }

        .recommendation-box { background: var(--sage-light); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; }
        .rec-text { font-size: 14.5px; color: var(--forest-deep); line-height: 1.6; margin: 0 0 14px; font-weight: 600; }
        .trigger-badge { font-size: 11.5px; color: var(--muted); background: rgba(255,255,255,0.6); border-radius: 10px; padding: 10px 12px; margin-top: auto; line-height: 1.5; }

        /* ---------- Mandi table ---------- */
        .table-wrapper { overflow-x: auto; border-radius: 14px; border: 1px solid var(--hairline); }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 640px; }
        .admin-table thead th {
          text-align: left; padding: 12px 16px; background: var(--sage-light); color: var(--forest-deep);
          font-weight: 700; font-size: 11.5px; text-transform: uppercase; letter-spacing: .03em;
        }
        .admin-table tbody td { padding: 14px 16px; border-top: 1px solid var(--hairline); }
        .admin-table tbody tr:nth-child(even) { background: rgba(124,148,115,0.05); }
        .profit-value { color: #3E7A4C; }
        .badge-crash { font-size: 10.5px; font-weight: 800; background: var(--clay-light); color: var(--clay); padding: 3px 8px; border-radius: 999px; }
        .btn-table-action {
          border: 1.5px solid var(--forest); background: transparent; color: var(--forest);
          font-family: inherit; font-weight: 700; font-size: 12.5px; padding: 7px 14px; border-radius: 999px; cursor: pointer;
          transition: all .15s ease; white-space: nowrap;
        }
        .btn-table-action:hover { background: var(--forest); color: #fff; }

        /* ---------- Financial panel ---------- */
        .financial-panel-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; }
        @media (max-width: 760px) { .financial-panel-grid { grid-template-columns: 1fr; } }
        .distress-gauge-card { display: flex; gap: 22px; align-items: center; background: var(--parchment); border-radius: 16px; padding: 20px; }
        .gauge-ring-wrap { position: relative; width: 130px; height: 130px; flex-shrink: 0; }
        .gauge-ring-wrap svg { transform: rotate(-90deg); }
        .gauge-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .score-num { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 700; color: var(--clay); line-height: 1; }
        .score-denom { font-size: 11px; color: var(--muted); font-weight: 700; }
        .score-label {
          font-size: 10.5px; font-weight: 800; letter-spacing: .03em; color: var(--clay);
          margin-top: 10px; text-align: center; max-width: 150px;
        }
        .gauge-details { flex: 1; min-width: 0; }
        .factor-item { padding: 10px 0; border-top: 1px solid var(--hairline); }
        .factor-item:first-of-type { border-top: none; padding-top: 0; }
        .factor-info { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; flex-wrap: wrap; }
        .factor-info > span:first-child { color: var(--ink); font-weight: 600; }
        .red-text { color: var(--clay); font-weight: 700; }

        .action-side-panel { display: flex; flex-direction: column; gap: 16px; }
        .loan-status-box { background: var(--sage-light); border-radius: 14px; padding: 16px 18px; }
        .box-label { font-size: 11.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .03em; }
        .status-flag { margin-top: 8px; font-weight: 700; font-size: 13.5px; }
        .status-flag.green-flag { color: #3E7A4C; }
        .status-flag.green-flag::before { content: '● '; }

        .assistance-block { flex: 1; display: flex; align-items: stretch; }
        .btn-dispatch-emergency {
          width: 100%; border: none; background: linear-gradient(180deg, var(--clay), #A8563E); color: #fff;
          font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14.5px; padding: 16px 20px;
          border-radius: 14px; cursor: pointer; transition: all .15s ease; box-shadow: 0 8px 20px rgba(193,105,79,0.25);
        }
        .btn-dispatch-emergency:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(193,105,79,0.32); }
        .alert-success-banner {
          background: var(--sage-light); color: var(--forest-deep); font-weight: 700; font-size: 13.5px;
          padding: 16px 18px; border-radius: 14px; text-align: center; border: 1px solid var(--sage);
        }
      `}</style>

      <header className="top-navbar">
        <div className="nav-left">
          <button className="btn-nav-home" type="button" onClick={onBackToHome}>← Home</button>
          <div className="brand-logo">🌾</div>
          <div>
            <div className="brand-title">{text.appName} <span className="status-badge-green">{text.liveStatus}</span></div>
            <div className="brand-subtitle">{text.tagline}</div>
          </div>
        </div>

        <div className="nav-right">
          <button type="button" className="btn-gps" onClick={detectLocation}>
            📍 {loadingWeather ? 'Detecting…' : locationName}
          </button>

          <div className="lang-picker">
            <button type="button" className={`lang-pill ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button type="button" className={`lang-pill ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
            <button type="button" className={`lang-pill ${lang === 'or' ? 'active' : ''}`} onClick={() => setLang('or')}>ଓଡ଼ି</button>
          </div>

          <button
            type="button"
            onClick={handleVoiceNarration}
            className={`btn-narration ${isPlayingAudio ? 'narration-active' : ''}`}
          >
            🔊 {isPlayingAudio ? text.stopAudio : text.listenBtn}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Crop & Land Configuration */}
        <section className="card-section">
          <div className="section-header">
            <h3>{text.cropConfigTitle}</h3>
          </div>
          <div className="crop-config-section">
            <div className="crop-badge-wrap">
              <div className="crop-badge-glow" />
              <div className="crop-badge">{currentCropData.icon}</div>
            </div>

            <div className="crop-config-fields">
              <div>
                <label className="field-label">{text.selectCrop}</label>
                <div className="crop-select-wrap">
                  <select
                    className="crop-select"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    {Object.keys(CROP_DATABASE).map((crop) => (
                      <option key={crop} value={crop}>
                        {CROP_DATABASE[crop].icon}  {text.crops[crop] || crop}
                      </option>
                    ))}
                  </select>
                  <span className="crop-select-chevron">▼</span>
                </div>
              </div>

              <div className="crop-meta-row">
                <div className="meta-input-group">
                  <label className="field-label">{text.acreageLabel}</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="meta-input"
                    value={cropAcreage}
                    onChange={(e) => setCropAcreage(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="meta-input-group">
                  <label className="field-label">{text.yieldLabel}</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="meta-input"
                    value={estimatedYieldQuintals}
                    onChange={(e) => setEstimatedYieldQuintals(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="meta-static">
                  <label className="field-label">{text.mspLabel}</label>
                  <span className="meta-value">₹{currentCropData.msp}/Qtl</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-icon-box blue">🌤️</div>
            <div className="metric-data">
              <span className="metric-label">{text.metrics.weatherLabel} · {locationName.split(',')[0]}</span>
              <div className="metric-main-val">{weather.temp}°C <span className="trend-up">{text.metrics.hum} {weather.humidity}%</span></div>
              <span className="metric-subtext">{text.metrics.rainForecast} {weather.rainForecast} · {text.metrics.wind} {weather.windSpeed} km/h</span>
            </div>
          </div>

          <div className={`metric-card ${weather.isPestRisk ? 'alert-card' : ''}`}>
            <div className="metric-icon-box red">🚨</div>
            <div className="metric-data">
              <span className="metric-label">{text.metrics.pestRiskTitle}</span>
              <div className={`metric-main-val ${weather.isPestRisk ? 'red-text' : ''}`}>
                {weather.isPestRisk ? text.metrics.highRisk : text.metrics.lowRisk}
                {weather.isPestRisk && <span className="badge-critical">{text.metrics.sprayNeeded}</span>}
              </div>
              <span className="metric-subtext">{text.metrics.activeThreat} {text.crops[selectedCrop]} {text.metrics.inHumid}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box green">💰</div>
            <div className="metric-data">
              <span className="metric-label">{text.metrics.bestPriceTitle}</span>
              <div className="metric-main-val">₹{currentCropData.msp + 180} <span className="trend-up">/ Qtl</span></div>
              <span className="metric-subtext">Central APMC (+₹180 {text.metrics.overMsp})</span>
            </div>
          </div>
        </div>

        {/* Dynamic Weather & Soil Advisory */}
        <section className="card-section">
          <div className="section-header">
            <h3>{text.weatherTitle}</h3>
          </div>
          <div className="advisory-grid">
            <div className="soil-card-box">
              <h4 className="box-title">{text.soilTitle} · {text.crops[selectedCrop]}</h4>
              <div className="soil-item">
                <div className="soil-meta"><span>{text.soil.n}</span><span className="val-text">{activeNPK.n}</span></div>
                <div className="progress-bg"><div className="progress-fill green" style={{ width: activeNPK.n }} /></div>
              </div>
              <div className="soil-item">
                <div className="soil-meta"><span>{text.soil.p}</span><span className="val-text">{activeNPK.p}</span></div>
                <div className="progress-bg"><div className="progress-fill yellow" style={{ width: activeNPK.p }} /></div>
              </div>
              <div className="soil-item">
                <div className="soil-meta"><span>{text.soil.k}</span><span className="val-text">{activeNPK.k}</span></div>
                <div className="progress-bg"><div className="progress-fill green" style={{ width: activeNPK.k }} /></div>
              </div>
              <div className="soil-item">
                <div className="soil-meta"><span>{text.soil.moisture}</span><span className="val-text">{activeNPK.moisture}</span></div>
                <div className="progress-bg"><div className="progress-fill blue-fill" style={{ width: activeNPK.moisture }} /></div>
              </div>
            </div>

            <div className="recommendation-box">
              <h4 className="box-title">{text.advisoryTitle}</h4>
              <p className="rec-text">
                {weather.isPestRisk ? activePestAdvisory : activeRainAdvisory}
              </p>
              <div className="trigger-badge">
                Auto-triggered: backend agronomy intelligence mapped to live weather ({text.metrics.hum} {weather.humidity}%, Temp: {weather.temp}°C) for {selectedCrop}.
              </div>
            </div>
          </div>
        </section>

        {/* Mandi Price Comparison */}
        <section className="card-section">
          <div className="section-header">
            <h3>{text.mandiTitle} · {text.crops[selectedCrop]}</h3>
            <p className="section-sub">{text.mandiSub} ({estimatedYieldQuintals} quintals)</p>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{text.mandi.name}</th>
                  <th>{text.mandi.distance}</th>
                  <th>{text.mandi.price}</th>
                  <th>{text.mandi.transport} (₹15/km)</th>
                  <th>{text.mandi.profit}</th>
                  <th>{text.mandi.action}</th>
                </tr>
              </thead>
              <tbody>
                {backendMandis.map((m) => {
                  return (
                    <tr key={m.name}>
                      <td style={{ fontWeight: 700 }}>{m.name}</td>
                      <td>{m.distance} km</td>
                      <td>
                        <span style={{ fontWeight: 700 }}>₹{m.price}</span>
                        {m.drop && <span className="badge-crash" style={{ marginLeft: 8 }}>{m.drop}</span>}
                      </td>
                      <td>₹{m.transportCost}</td>
                      <td className="profit-value" style={{ fontWeight: 700 }}>₹{m.netProfit.toLocaleString()}</td>
                      <td><button className="btn-table-action">{text.mandi.lock}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Financial Health & Emergency SOS */}
        <section className="card-section">
          <div className="section-header">
            <h3>{text.financialTitle}</h3>
          </div>
          <div className="financial-panel-grid">
            <div className="distress-gauge-card">
              <div className="gauge-ring-wrap">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r={gaugeRadius} fill="none" stroke="#E4E1D2" strokeWidth="12" />
                  <circle
                    cx="65" cy="65" r={gaugeRadius} fill="none" stroke="#C1694F" strokeWidth="12"
                    strokeDasharray={gaugeCircumference} strokeDashoffset={gaugeOffset} strokeLinecap="round"
                  />
                </svg>
                <div className="gauge-center">
                  <span className="score-num">{distressScore}</span>
                  <span className="score-denom">/ 100</span>
                </div>
              </div>
              <div className="gauge-details">
                <h4 className="box-title">{text.financial.riskFactors}</h4>
                <div className="factor-item">
                  <div className="factor-info"><span>{text.financial.rainIrregularity}</span><span className="red-text">{text.financial.highVariance}</span></div>
                </div>
                <div className="factor-item">
                  <div className="factor-info">
                    <span>{text.financial.kccStatus}</span>
                    <span className="red-text">
                      {text.financial.paymentDue} {farmerData?.kccLoan?.daysUntilDue || 4} {text.financial.days}
                      (₹{farmerData?.kccLoan?.amount?.toLocaleString() || '85,000'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-side-panel">
              <div className="loan-status-box">
                <span className="box-label">{text.financial.bimaStatus}</span>
                <div className="status-flag green-flag">{text.financial.activePolicy} #KCC-883920-A</div>
              </div>

              <div className="assistance-block">
                {distressSent ? (
                  <div className="alert-success-banner">✅ {text.requestSent}</div>
                ) : (
                  <button type="button" className="btn-dispatch-emergency" onClick={handleRequestAssistance}>
                    🆘 {text.requestBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}