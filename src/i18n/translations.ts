/**
 * VayuShield AI - Bilingual Dictionary (English & Hindi)
 * Full localized strings for WCAG 2.2 accessibility and seamless EN/HI toggle.
 */

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Brand & Header
    appName: 'VayuShield AI',
    tagline: 'Urban Air Quality & Winter Smog Assistant',
    subtitle: 'Evidence-based GenAI shield protecting urban families from severe particulate crises.',
    currentCity: 'Current City',
    searchCityPlaceholder: 'Search city (e.g. Delhi, Lahore, Mumbai)...',
    refreshData: 'Refresh AQI',
    langToggle: 'हिन्दी',
    themeToggleDark: 'Dark Mode',
    themeToggleLight: 'Light Mode',

    // Tabs / Nav
    tabMonitor: 'Live Smog Monitor',
    tabCommuteGuard: 'Commute Guard',
    tabIndoor: 'Indoor AQI Model',
    tabIntake: 'Smart Family Intake',
    tabTimeline: 'Clean-Hour Routine',
    tabScanner: 'Room & Mask Scanner',
    tabLedger: 'Impact Ledger',
    tabCommunityWatch: 'Community Watch',
    tabSimulator: 'What-If Simulator',
    tabPledge: 'Community Pledge',
    tabAsk: 'Ask VayuShield',

    // Live Monitor
    liveAqiTitle: 'Real-Time Air Quality Monitor',
    liveUpdated: 'Live updated',
    dominantPollutant: 'Dominant Pollutant',
    healthAdvisoryTitle: 'Health & Clinical Advisory',
    hourlyTrendTitle: '24-Hour Diurnal AQI Trend',
    tapToViewSafeHours: 'Tap any hour to inspect safety indicators',

    // Smart Intake
    intakeTitle: '1-Sentence Smart Family Intake',
    intakeSubtitle: 'Describe your household in natural language. Gemini extracts your family’s clinical sensitivity profile instantly.',
    intakePlaceholder: 'e.g., Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car...',
    intakeBtn: 'Analyze Household Profile',
    intakingLoading: 'Extracting Clinical Profile...',
    samplePromptsTitle: 'Or select a quick scenario:',
    vulnerabilityIndex: 'Family Smog Vulnerability Score',
    membersCount: 'Household Size',
    medicalFlags: 'Clinical Vulnerability Flags',
    commuteDetails: 'Commute & Exposure Mode',
    cookingSource: 'Cooking / Heating Fuel',

    // Multimodal Room Scanner
    scannerTitle: 'Multimodal Indoor Air & Room Scanner',
    scannerSubtitle: 'Upload a photo of your living room, kitchen, window, or smoggy street. Gemini Vision audits indoor particulate triggers and generates low-cost DIY fixes.',
    dragDropText: 'Drag & drop a room photo, or click to browse',
    roomContextLabel: 'Optional room context:',
    roomContextPlaceholder: 'e.g. Master bedroom near street balcony, or kitchen with gas stove...',
    scanPhotoBtn: 'Analyze Indoor Air & Detect Hazards',
    scanningLoading: 'Auditing image with Gemini Vision...',
    quickSamplePhotos: 'Or choose a test room photo:',
    hazardsFound: 'Detected Air Hazards',
    diyRemedies: 'Low-Cost DIY Interventions',
    crBoxCardTitle: 'Recommended Corsi-Rosenthal Box Sizing',
    airPlantsTitle: 'Air-Purifying Plants for This Space',

    // Clean Hour Timeline
    timelineTitle: 'Clean-Hour Daily Routine Timeline',
    timelineSubtitle: 'Real-time forecast identifying safest hours for exercise, school runs, and filtered ventilation.',
    safestExerciseWindow: 'Safest Outdoor Exercise Window',
    morningCommuteAlert: 'Morning Commute Smog Peak',
    ventilationWindow: 'Filtered Ventilation Slot',
    sleepWindow: 'Nighttime Air Management',

    // Impact Ledger
    ledgerTitle: 'Interactive "Your Choices" Impact Ledger',
    ledgerSubtitle: 'Toggle evidence-based interventions and observe real-time health and environmental benefits computed via EPA & Berkeley Earth formulas.',
    toggleN95: 'Wear Certified N95 Outdoors',
    toggleN95Sub: '95% particulate filtration vs. cloth/bare',
    togglePurifier: 'Run Corsi-Rosenthal / HEPA Purifier',
    togglePurifierSub: 'Continuous 350 CFM clean air recirculation',
    toggleCommute: 'Commute Transition',
    toggleCooking: 'Cooking Fuel Swap',
    toggleSealing: 'Perimeter Weatherstripping',
    toggleWetMopping: 'Daily Microfiber Wet Mopping',
    metricInhaledDrop: 'Inhaled PM2.5 Reduction',
    metricCigarettesAvoided: 'Cigarettes Avoided / Week',
    metricCo2Saved: 'CO2 Saved / Week',
    metricCleanHours: 'Clean Air Hours Gained',
    berkeleyBadge: 'Berkeley Earth Equation Verified',

    // Community Pledge
    pledgeTitle: 'Community Smog Action Pledge',
    pledgeSubtitle: 'Commit to clean air actions and generate your certified community badge to inspire neighbors on WhatsApp and LinkedIn.',
    pledgeNameLabel: 'Your Name or Family Name:',
    pledgeCityLabel: 'City / Neighborhood:',
    signPledgeBtn: 'Sign Community Pledge & Generate Badge',
    badgeTitle: 'Certified Clean Air Champion',
    shareOnWhatsApp: 'Share on WhatsApp',
    copyShareText: 'Copy Impact Summary',
    downloadBadge: 'Download Badge',
    copiedAlert: 'Copied to clipboard!',

    // Ask Assistant
    askTitle: 'Ask VayuShield AI Assistant',
    askSubtitle: 'Evidence-based clinical guidance grounded in your live AQI and family profile.',
    askPlaceholder: 'Ask anything (e.g. Should kids go to school at 350 AQI? How do I build a CR box?)...',
    askBtn: 'Ask AI',
    groundedNotice: 'Grounded in Berkeley Earth & US EPA calculations',

    // Corsi-Rosenthal Modal
    crModalTitle: 'Corsi-Rosenthal Box Calculator & Guide',
    crModalSubtitle: 'The scientifically proven open-source air purifier costing 80% less than commercial HEPA units.',
    roomArea: 'Room Floor Area',
    ceilingHeight: 'Ceiling Height',
    targetAch: 'Target Air Changes / Hour (ACH)',
    cadrRequired: 'Required Clean Air Delivery Rate (CADR)',
    unitsNeeded: 'Recommended CR Box Units',
    clearanceTime: 'Time to 90% Particle Clearance',
    diyCost: 'Estimated DIY Cost',
    commercialCost: 'Commercial HEPA Equivalent',
    moneySaved: 'Estimated Cost Savings',
    howToBuild: 'How to Build in 15 Minutes',

    // Common
    verifiedOnly: 'Deterministic Ground Truth Numbers Only',
    resilienceTier: 'Resilience Cascade Status',
  },
  hi: {
    // Brand & Header
    appName: 'वायुशील्ड AI',
    tagline: 'शहरी वायु गुणवत्ता एवं शीतकालीन स्मॉग सहायक',
    subtitle: 'प्रमाण-आधारित जेन-एआई शील्ड जो परिवारों को गंभीर वायु प्रदूषण संकट से सुरक्षित रखती है।',
    currentCity: 'वर्तमान शहर',
    searchCityPlaceholder: 'शहर खोजें (उदा. दिल्ली, लाहौर, मुंबई)...',
    refreshData: 'AQI रीफ्रेश करें',
    langToggle: 'English',
    themeToggleDark: 'डार्क मोड',
    themeToggleLight: 'लाइट मोड',

    // Tabs / Nav
    tabMonitor: 'लाइव स्मॉग मॉनिटर',
    tabCommuteGuard: 'कम्यूट गार्ड',
    tabIndoor: 'इंडोर AQI मॉडल',
    tabIntake: 'स्मार्ट परिवार इनटेक',
    tabTimeline: 'स्वच्छ-घंटे दिनचर्या',
    tabScanner: 'कमरा व मास्क स्कैनर',
    tabLedger: 'प्रभाव लेजर',
    tabCommunityWatch: 'कम्युनिटी वॉच',
    tabSimulator: 'व्हाट-इफ़ सिम्युलेटर',
    tabPledge: 'सामुदायिक प्रतिज्ञा',
    tabAsk: 'वायुशील्ड से पूछें',

    // Live Monitor
    liveAqiTitle: 'रीयल-टाइम वायु गुणवत्ता मॉनिटर',
    liveUpdated: 'लाइव अपडेटेड',
    dominantPollutant: 'मुख्य प्रदूषक',
    healthAdvisoryTitle: 'स्वास्थ्य एवं चिकित्सकीय सलाह',
    hourlyTrendTitle: '24-घंटे का वायु गुणवत्ता रुझान',
    tapToViewSafeHours: 'सुरक्षा संकेतक देखने के लिए किसी भी घंटे पर टैप करें',

    // Smart Intake
    intakeTitle: '1-वाक्य स्मार्ट परिवार इनटेक',
    intakeSubtitle: 'अपनी सामान्य भाषा में परिवार का विवरण लिखें। जेमिनी तुरंत आपकी परिवार की संवेदनशीलता प्रोफाइल तैयार करेगा।',
    intakePlaceholder: 'उदा., दिल्ली में 4 सदस्यों का परिवार, एक बुजुर्ग अस्थमा रोगी और 2 स्कूली बच्चे, कार से आना-जाना...',
    intakeBtn: 'पारिवारिक प्रोफाइल का विश्लेषण करें',
    intakingLoading: 'प्रोफ़ाइल तैयार की जा रही है...',
    samplePromptsTitle: 'या त्वरित उदाहरण चुनें:',
    vulnerabilityIndex: 'परिवार स्मॉग संवेदनशीलता स्कोर',
    membersCount: 'परिवार के सदस्य',
    medicalFlags: 'चिकित्सकीय जोखिम लक्षण',
    commuteDetails: 'आवागमन व जोखिम माध्यम',
    cookingSource: 'रसोई व हीटिंग ईंधन',

    // Multimodal Room Scanner
    scannerTitle: 'मल्टीमॉडल कमरा व वायु स्कैनर',
    scannerSubtitle: 'कमरे, रसोई, खिड़की या स्मॉग की फोटो अपलोड करें। जेमिनी विज़न प्रदूषण के कारणों की पहचान कर किफायती उपाय सुझाएगा।',
    dragDropText: 'कमरे की फोटो यहाँ खींचें या अपलोड करने के लिए क्लिक करें',
    roomContextLabel: 'कमरे का संदर्भ (वैकल्पिक):',
    roomContextPlaceholder: 'उदा. बालकनी के पास बेडरूम, या गैस चूल्हे वाली रसोई...',
    scanPhotoBtn: 'कमरे का विश्लेषण करें और खतरे पहचानें',
    scanningLoading: 'जेमिनी विज़न द्वारा फोटो की जांच जारी...',
    quickSamplePhotos: 'या परीक्षण हेतु नमूना फोटो चुनें:',
    hazardsFound: 'पहचाने गए वायु प्रदूषण खतरे',
    diyRemedies: 'किफायती DIY समाधान',
    crBoxCardTitle: 'अनुशंसित कोर्सी-रोसेंथल बॉक्स आकार',
    airPlantsTitle: 'इस स्थान के लिए वायु-शोधक पौधे',

    // Clean Hour Timeline
    timelineTitle: 'स्वच्छ-घंटे दैनिक दिनचर्या समयरेखा',
    timelineSubtitle: 'व्यायाम, स्कूल और हवादार करने के सबसे सुरक्षित घंटों का पूर्वानुमान।',
    safestExerciseWindow: 'व्यायाम के लिए सबसे सुरक्षित समय',
    morningCommuteAlert: 'सुबह का स्मॉग पीक अलर्ट',
    ventilationWindow: 'हवादार करने का सुरक्षित समय',
    sleepWindow: 'रात में वायु प्रबंधन',

    // Impact Ledger
    ledgerTitle: 'इंटरएक्टिव "आपकी पसंद" प्रभाव लेजर',
    ledgerSubtitle: 'प्रदूषण-रोधी विकल्पों को सक्रिय करें और EPA व बर्कले अर्थ सूत्रों पर आधारित स्वास्थ्य लाभ देखें।',
    toggleN95: 'बाहर प्रमाणित N95 मास्क पहनें',
    toggleN95Sub: 'कपड़े के मास्क की तुलना में 95% सूक्ष्म कणों से सुरक्षा',
    togglePurifier: 'कोर्सी-रोसेंथल / HEPA प्यूरीफायर चलाएं',
    togglePurifierSub: 'लगातार 350 CFM स्वच्छ हवा का परिसंचरण',
    toggleCommute: 'आवागमन बदलाव',
    toggleCooking: 'रसोई ईंधन बदलाव',
    toggleSealing: 'खिड़की-दरवाजों की सीलिंग',
    toggleWetMopping: 'दैनिक गीला माइक्रोफाइबर पोछा',
    metricInhaledDrop: 'सांस में जाने वाले PM2.5 में कमी',
    metricCigarettesAvoided: 'सिगरेट समतुल्य धुआं बचा / सप्ताह',
    metricCo2Saved: 'CO2 उत्सर्जन बचत / सप्ताह',
    metricCleanHours: 'स्वच्छ हवा के घंटे मिले',
    berkeleyBadge: 'बर्कले अर्थ सूत्र द्वारा सत्यापित',

    // Community Pledge
    pledgeTitle: 'सामुदायिक स्वच्छ वायु प्रतिज्ञा',
    pledgeSubtitle: 'स्वच्छ हवा के लिए संकल्प लें और पड़ोसियों को प्रेरित करने के लिए प्रमाणित बैज जनरेट करें।',
    pledgeNameLabel: 'आपका या परिवार का नाम:',
    pledgeCityLabel: 'शहर / इलाका:',
    signPledgeBtn: 'प्रतिज्ञा लें और बैज प्राप्त करें',
    badgeTitle: 'प्रमाणित स्वच्छ वायु चैंपियन',
    shareOnWhatsApp: 'व्हाट्सएप पर साझा करें',
    copyShareText: 'प्रभाव सारांश कॉपी करें',
    downloadBadge: 'बैज डाउनलोड करें',
    copiedAlert: 'क्लिपबोर्ड में कॉपी हो गया!',

    // Ask Assistant
    askTitle: 'वायुशील्ड AI सहायक से पूछें',
    askSubtitle: 'वर्तमान AQI और आपके परिवार की प्रोफाइल पर आधारित साक्ष्य-सम्मत चिकित्सकीय मार्गदर्शन।',
    askPlaceholder: 'कुछ भी पूछें (उदा. 350 AQI में बच्चों को स्कूल भेजें? ₹2,500 में CR बॉक्स कैसे बनाएं?)...',
    askBtn: 'AI से पूछें',
    groundedNotice: 'बर्कले अर्थ एवं US EPA गणनाओं पर आधारित',

    // Corsi-Rosenthal Modal
    crModalTitle: 'कोर्सी-रोसेंथल बॉक्स कैलकुलेटर व गाइड',
    crModalSubtitle: 'वैज्ञानिक रूप से प्रमाणित ओपन-सोर्स एयर प्यूरीफायर जो बाज़ारू HEPA से 80% कम लागत में बनता है।',
    roomArea: 'कमरे का क्षेत्रफल',
    ceilingHeight: 'छत की ऊंचाई',
    targetAch: 'लक्षित वायु परिवर्तन प्रति घंटा (ACH)',
    cadrRequired: 'आवश्यक स्वच्छ वायु वितरण दर (CADR)',
    unitsNeeded: 'आवश्यक CR बॉक्स यूनिट्स',
    clearanceTime: '90% प्रदूषण साफ होने का समय',
    diyCost: 'अनुमानित DIY लागत',
    commercialCost: 'व्यावसायिक HEPA प्यूरीफायर लागत',
    moneySaved: 'अनुमानित बचत',
    howToBuild: '15 मिनट में बनाने की विधि',

    // Common
    verifiedOnly: 'केवल सत्यापित गणितीय आंकड़े',
    resilienceTier: 'रेज़िलिएंस कैस्केड स्थिति',
  },
};
