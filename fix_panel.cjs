const fs = require('fs');

let content = fs.readFileSync('./src/components/farmer/farmerpanel.jsx', 'utf-8');

// 1. Replace translation object
const newTranslations = `  const translations = {
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
      financial: { riskFactors: 'Identified risk factors', rainIrregularity: 'Rainfall irregularity', highVariance: 'High variance', kccStatus: 'KCC loan status', paymentDue: 'Payment due in', days: 'days', bimaStatus: 'PM Fasal Bima insurance status', activePolicy: 'Active · Policy' }
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
      financial: { riskFactors: 'पहचाने गए जोखिम', rainIrregularity: 'वर्षा अनियमितता', highVariance: 'उच्च भिन्नता', kccStatus: 'KCC ऋण स्थिति', paymentDue: 'देय भुगतान', days: 'दिनों में', bimaStatus: 'पीएम फसल बीमा स्थिति', activePolicy: 'सक्रिय · पॉलिसी' }
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
      financial: { riskFactors: 'ଚିହ୍ନିତ ବିପଦ କାରଣଗୁଡିକ', rainIrregularity: 'ବର୍ଷା ଅନିୟମିତତା', highVariance: 'ଉଚ୍ଚ ପରିବର୍ତ୍ତନଶୀଳତା', kccStatus: 'କେସିସି (KCC) ଋଣ ସ୍ଥିତି', paymentDue: 'ଦେୟ ବାକି ଅଛି', days: 'ଦିନରେ', bimaStatus: 'ପିଏମ ଫସଲ ବୀମା', activePolicy: 'ସକ୍ରିୟ · ପଲିସି' }
    }
  };`;

content = content.replace(/const translations = \{[\s\S]*?\n  \};\n/m, newTranslations + '\n');

// 2. Replace audio lang
content = content.replace(/utterance\.lang = lang === 'hi' \? 'hi-IN' : lang === 'pa' \? 'pa-IN' : 'en-IN';/g, "utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'or-IN' : 'en-IN';");

// 3. Replace lang picker buttons
content = content.replace(/<button type="button" className={`lang-pill \$\{lang === 'pa' \? 'active' : ''\}`} onClick=\{\(\) => setLang\('pa'\)\}>ਪੰ<\/button>/g, "<button type=\"button\" className={`lang-pill ${lang === 'or' ? 'active' : ''}`} onClick={() => setLang('or')}>ଓଡ଼ି</button>");

// 4. Update hardcoded JSX to use translation keys
content = content.replace(/\{CROP_DATABASE\[crop\]\.icon\}  \{crop\}/g, "{CROP_DATABASE[crop].icon}  {text.crops[crop] || crop}");

content = content.replace(/<label className="field-label">Govt MSP<\/label>/g, '<label className="field-label">{text.mspLabel}</label>');

// Metrics
content = content.replace(/<span className="metric-label">Live weather · \{locationName\.split\(\',\', 1\)\[0\]}<\/span>/g, '<span className="metric-label">{text.metrics.weatherLabel} · {locationName.split(\',\')[0]}</span>');
content = content.replace(/<span className="metric-label">Live weather · \{locationName\.split\(\',\', 1\)\[0\]}<\/span>/, '<span className="metric-label">{text.metrics.weatherLabel} · {locationName.split(\',\')[0]}</span>');
content = content.replace(/Live weather ·/g, '{text.metrics.weatherLabel} ·');

content = content.replace(/Hum:/g, '{text.metrics.hum}');
content = content.replace(/Rain forecast:/g, '{text.metrics.rainForecast}');
content = content.replace(/Wind:/g, '{text.metrics.wind}');
content = content.replace(/Pest & disease outbreak risk/g, '{text.metrics.pestRiskTitle}');
content = content.replace(/High risk/g, '{text.metrics.highRisk}');
content = content.replace(/Low risk/g, '{text.metrics.lowRisk}');
content = content.replace(/Spray needed/g, '{text.metrics.sprayNeeded}');
content = content.replace(/Active threat for \{selectedCrop\} in humid weather/g, '{text.metrics.activeThreat} {text.crops[selectedCrop]} {text.metrics.inHumid}');
content = content.replace(/Best nearby market price/g, '{text.metrics.bestPriceTitle}');
content = content.replace(/over MSP/g, '{text.metrics.overMsp}');

// Soil
content = content.replace(/Nitrogen \(N\)/g, '{text.soil.n}');
content = content.replace(/Phosphorus \(P\)/g, '{text.soil.p}');
content = content.replace(/Potassium \(K\)/g, '{text.soil.k}');
content = content.replace(/Optimal soil moisture/g, '{text.soil.moisture}');
content = content.replace(/· \{selectedCrop\}/g, '· {text.crops[selectedCrop]}');

// Mandi Table
content = content.replace(/<th>Mandi name<\/th>/g, '<th>{text.mandi.name}</th>');
content = content.replace(/<th>Distance<\/th>/g, '<th>{text.mandi.distance}</th>');
content = content.replace(/<th>Price \/ quintal<\/th>/g, '<th>{text.mandi.price}</th>');
content = content.replace(/<th>Est\. transport cost \(₹15\/km\)<\/th>/g, '<th>{text.mandi.transport} (₹15/km)</th>');
content = content.replace(/<th>Est\. net profit<\/th>/g, '<th>{text.mandi.profit}</th>');
content = content.replace(/<th>Action<\/th>/g, '<th>{text.mandi.action}</th>');
content = content.replace(/Lock mandi price/g, '{text.mandi.lock}');

// Financial Table
content = content.replace(/Identified risk factors/g, '{text.financial.riskFactors}');
content = content.replace(/Rainfall irregularity/g, '{text.financial.rainIrregularity}');
content = content.replace(/High variance/g, '{text.financial.highVariance}');
content = content.replace(/KCC loan status/g, '{text.financial.kccStatus}');
content = content.replace(/Payment due in /g, '{text.financial.paymentDue} ');
content = content.replace(/ days/g, ' {text.financial.days}');
content = content.replace(/PM Fasal Bima insurance status/g, '{text.financial.bimaStatus}');
content = content.replace(/Active · Policy/g, '{text.financial.activePolicy}');

fs.writeFileSync('./src/components/farmer/farmerpanel.jsx', content);
console.log("Translation processing complete.");
