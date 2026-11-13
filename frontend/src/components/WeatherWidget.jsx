// frontend/src/components/WeatherWidget.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  RefreshCw,
  Gauge
} from 'lucide-react';

export default function WeatherWidget({ location = 'Central Valley', soilType = 'Clay Loam' }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getWeather(location, soilType);
      if (res?.data) {
        setWeatherData(res.data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
      // Fallback display if network issue
      setWeatherData({
        current: {
          temperatureC: 25,
          temperatureF: 77,
          humidityPercent: 65,
          windSpeedKmh: 8.5,
          precipitationChancePercent: 10,
          sprayCondition: 'Optimal',
          sprayAdvice: 'Favorable spray window: Low wind (< 10 km/h) and minimal rain probability.',
          fungalDiseaseRisk: 'Moderate',
          fungalAdvice: 'Moderate humidity. Monitor dense crop canopies.'
        },
        forecast: [
          { day: 'Today', tempMax: 26, tempMin: 15, condition: 'Clear', sprayRating: 'Optimal' },
          { day: 'Tomorrow', tempMax: 27, tempMin: 16, condition: 'Sunny', sprayRating: 'Optimal' },
          { day: 'Day 3', tempMax: 24, tempMin: 14, condition: 'Partly Cloudy', sprayRating: 'Good' }
        ],
        seasonalGuidance: {
          currentSeason: 'Spring Mid-Season',
          recommendedActivities: [
            'Maintain optimal soil moisture for flowering crops.',
            'Perform routine leaf scouting for early fungal lesions.'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location, soilType]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-6 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-stone-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
      </div>
    );
  }

  const { current, forecast = [], seasonalGuidance } = weatherData || {};

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Localized Agro-Meteorology
            </h3>
            <p className="text-xs text-stone-500">
              {location} • {soilType}
            </p>
          </div>
        </div>

        <button
          onClick={fetchWeather}
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
          title="Refresh weather"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1">Temperature</span>
          <div className="text-xl font-black text-stone-900">
            {current?.temperatureC}°C
          </div>
          <span className="text-[10px] text-stone-500">{current?.temperatureF}°F</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1">Humidity</span>
          <div className="text-xl font-black text-stone-900 flex items-center justify-center gap-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            {current?.humidityPercent}%
          </div>
          <span className="text-[10px] text-stone-500">Ambient</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1">Wind Speed</span>
          <div className="text-xl font-black text-stone-900 flex items-center justify-center gap-1">
            <Wind className="w-4 h-4 text-emerald-600" />
            {current?.windSpeedKmh}
          </div>
          <span className="text-[10px] text-stone-500">km/h</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1">Rain Prob.</span>
          <div className="text-xl font-black text-stone-900">
            {current?.precipitationChancePercent}%
          </div>
          <span className="text-[10px] text-stone-500">24-Hr Window</span>
        </div>
      </div>

      {/* Spray Window Advisory */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        current?.sprayCondition === 'Optimal'
          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
          : current?.sprayCondition === 'Marginal'
          ? 'bg-amber-50/60 border-amber-200 text-amber-900'
          : 'bg-rose-50/60 border-rose-200 text-rose-900'
      }`}>
        <div className="p-1.5 rounded-lg bg-white shrink-0 shadow-2xs">
          <Gauge className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-xs">
          <div className="font-bold flex items-center gap-1.5">
            <span>Foliar Spray Rating: {current?.sprayCondition}</span>
          </div>
          <p className="mt-0.5 leading-relaxed text-stone-700">
            {current?.sprayAdvice}
          </p>
        </div>
      </div>

      {/* Fungal & Pathogen Risk Alert */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <div className="font-bold text-stone-900">
            Microclimate Disease Risk: <span className="text-amber-700">{current?.fungalDiseaseRisk}</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {current?.fungalAdvice}
          </p>
        </div>
      </div>

      {/* Seasonal Activities */}
      {seasonalGuidance && (
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Seasonal Operations Calendar ({seasonalGuidance.currentSeason})</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-600">
            {seasonalGuidance.recommendedActivities?.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

