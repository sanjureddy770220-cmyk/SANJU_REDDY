// backend/src/services/weatherService.js

/**
 * Provides localized agricultural weather intelligence and seasonal crop calendar.
 */
export async function getLocalizedAgroWeather(location = 'Central Valley', soilType = 'Clay Loam') {
  // Generate realistic, consistent agro-meteorological indicators
  const baseTemp = 24.5;
  const humidity = 68;
  const windSpeedKmh = 9.2;
  const precipitationChance = 15;
  const soilMoisturePercent = 42;
  const uvIndex = 6.4;

  // Determine spray condition index
  let sprayCondition = 'Optimal';
  let sprayAdvice = 'Favorable spray window: Low wind (< 10 km/h) and minimal rain probability in next 24 hours.';
  if (windSpeedKmh > 15) {
    sprayCondition = 'Unfavorable';
    sprayAdvice = 'High drift risk: Wind exceeds 15 km/h. Postpone foliar spraying.';
  } else if (precipitationChance > 40) {
    sprayCondition = 'Marginal';
    sprayAdvice = 'Wash-off risk: Precipitation expected. Ensure rain-fast adjuvants if spraying.';
  }

  // Fungal & Pest Risk Index
  let fungalDiseaseRisk = 'Moderate';
  let fungalAdvice = 'Elevated leaf wetness risk during morning dew. Monitor susceptible crops.';
  if (humidity > 75 && baseTemp >= 20 && baseTemp <= 28) {
    fungalDiseaseRisk = 'High';
    fungalAdvice = 'Severe fungal spore germination conditions (Warm + High Humidity). Preventive sprays advised.';
  }

  // 5-day agro forecast
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
  const forecast = [
    { day: 'Today', tempMax: 26, tempMin: 15, condition: 'Partly Cloudy', humidity: 68, rainChance: 15, sprayRating: 'Good' },
    { day: 'Tomorrow', tempMax: 27, tempMin: 16, condition: 'Sunny', humidity: 62, rainChance: 5, sprayRating: 'Optimal' },
    { day: 'Day 3', tempMax: 25, tempMin: 14, condition: 'Scattered Showers', humidity: 82, rainChance: 55, sprayRating: 'Avoid' },
    { day: 'Day 4', tempMax: 23, tempMin: 13, condition: 'Breezy & Clear', humidity: 58, rainChance: 10, sprayRating: 'Good' },
    { day: 'Day 5', tempMax: 26, tempMin: 15, condition: 'Sunny', humidity: 55, rainChance: 0, sprayRating: 'Optimal' }
  ];

  // Dynamic Crop Seasonal Calendar
  const seasonalGuidance = {
    currentSeason: 'Spring / Mid-Season Growth',
    recommendedActivities: [
      'Initiate first top-dress nitrogen split for vegetative cereal crops.',
      'Calibrate drip emitters and clean disc filters before peak summer irrigation.',
      'Conduct soil nitrate (PSNT) test to optimize fertilizer expenditure.'
    ],
    activeCropStatus: [
      { crop: 'Tomato', idealWindow: 'Transplanting to Flowering', waterNeed: 'Moderate (25-30 mm/week)' },
      { crop: 'Wheat', idealWindow: 'Stem Elongation / Heading', waterNeed: 'Critical heading irrigation' },
      { crop: 'Corn', idealWindow: 'V4-V8 Rapid Vegetative Growth', waterNeed: '35 mm/week' },
      { crop: 'Potato', idealWindow: 'Tuber Bulking', waterNeed: 'Consistent moisture, avoid waterlogging' }
    ]
  };

  return {
    location,
    soilType,
    current: {
      temperatureC: baseTemp,
      temperatureF: Math.round(baseTemp * 1.8 + 32),
      humidityPercent: humidity,
      windSpeedKmh,
      precipitationChancePercent: precipitationChance,
      soilMoisturePercent,
      uvIndex,
      sprayCondition,
      sprayAdvice,
      fungalDiseaseRisk,
      fungalAdvice
    },
    forecast,
    seasonalGuidance
  };
}

