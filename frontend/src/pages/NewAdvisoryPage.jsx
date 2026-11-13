// frontend/src/pages/NewAdvisoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import {
  Sparkles,
  Sprout,
  Tractor,
  Layers,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Clock,
  HelpCircle
} from 'lucide-react';

const COMMON_CROPS = [
  'Tomato',
  'Wheat',
  'Corn / Maize',
  'Rice (Paddy)',
  'Potato',
  'Soybean',
  'Cotton',
  'Onion',
  'Apple Orchard',
  'Citrus / Orange'
];

const GROWTH_STAGES = [
  'Seedling / Emergence',
  'Vegetative (Leaf & Canopy Expansion)',
  'Flowering / Booting',
  'Fruiting / Grain Fill / Tuber Bulking',
  'Pre-Harvest Maturation'
];

const DIAGNOSTIC_STEPS = [
  'Inspecting leaf lesion margins and chlorosis patterns...',
  'Correlating local soil profile and growth stage physiology...',
  'Synthesizing IPM organic and chemical dosage treatment protocol...'
];

export default function NewAdvisoryPage() {
  const [searchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farmId') || '';

  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);

  // Form Fields
  const [farmId, setFarmId] = useState(initialFarmId);
  const [cropName, setCropName] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState(GROWTH_STAGES[1]);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Submission State
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticStepIndex, setDiagnosticStepIndex] = useState(0);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFarms() {
      try {
        const res = await api.getFarms();
        const list = res?.data || [];
        setFarms(list);
        if (list.length > 0 && !farmId) {
          setFarmId(list[0].id);
        }
      } catch (err) {
        console.warn('Could not fetch farms:', err);
      } finally {
        setLoadingFarms(false);
      }
    }
    fetchFarms();
  }, []);

  // Cycle animation steps while analyzing
  useEffect(() => {
    let interval = null;
    if (analyzing) {
      interval = setInterval(() => {
        setDiagnosticStepIndex((prev) => (prev + 1) % DIAGNOSTIC_STEPS.length);
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analyzing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Please select or register a farm plot.');
      return;
    }
    if (!cropName.trim()) {
      setError('Please specify the crop name.');
      return;
    }
    if (!symptomDescription.trim() || symptomDescription.trim().length < 10) {
      setError('Please provide a detailed symptom description (at least 10 characters).');
      return;
    }

    setAnalyzing(true);
    setDiagnosticStepIndex(0);

    try {
      const formData = new FormData();
      formData.append('farm_id', farmId);
      formData.append('crop_name', cropName);
      formData.append('growth_stage', growthStage);
      formData.append('symptom_description', symptomDescription);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log('Sending diagnostic request to backend...');
      const response = await api.createAdvisory(formData);

      if (response?.data?.id) {
        navigate(`/advisory/${response.data.id}`);
      } else {
        throw new Error('Advisory could not be generated. Please retry.');
      }
    } catch (err) {
      console.error('Diagnosis failed:', err);
      setError(err.message || 'Diagnosis generation failed. Please check your image format and symptoms.');
      setAnalyzing(false);
    }
  };

  const handleApplyPresetSymptom = (text) => {
    setSymptomDescription(text);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Gemini 2.5 Flash Vision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          New AI Crop Advisory & Pathology Scan
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Upload specimen leaf/soil imagery and document symptoms to generate structured remedial prescriptions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Diagnosis Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Step 1: Image Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Crop Specimen Image</span>
            </label>
            <span className="text-xs text-stone-400">High-resolution leaf or soil view</span>
          </div>

          <ImageUploader
            selectedFile={imageFile}
            onFileSelect={(file) => setImageFile(file)}
            onClear={() => setImageFile(null)}
          />
        </div>

        {/* Step 2: Target Farm Plot & Crop Info */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Farm Plot & Crop Details</span>
            </label>
            <Link to="/farms" className="text-xs font-semibold text-emerald-700 hover:underline">
              + New Farm Plot
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Farm Plot</label>
              {loadingFarms ? (
                <div className="h-10 bg-stone-100 rounded-xl animate-pulse"></div>
              ) : farms.length === 0 ? (
                <div className="text-xs text-rose-600 p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                  No plots found. <Link to="/farms" className="underline font-bold">Create a farm plot first</Link>.
                </div>
              ) : (
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.location.slice(0, 24)}... - {f.soil_type.slice(0, 15)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
              >
                {GROWTH_STAGES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Crop Selector with Chips */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Crop Name / Variety
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tomato (Roma VF)"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400 font-medium mr-1">Quick Select:</span>
              {COMMON_CROPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCropName(c)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition ${
                    cropName === c
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Symptom Description */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Field Symptom Observations</span>
            </label>
            <span className="text-xs text-stone-400">Describe visual anomalies</span>
          </div>

          <textarea
            rows={4}
            required
            placeholder="e.g. Leaves exhibit dark brown concentric ring spots on lower canopy with distinct yellow chlorotic halos. Recent heavy dew and morning fog observed in plot."
            value={symptomDescription}
            onChange={(e) => setSymptomDescription(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          ></textarea>

          {/* Example prompt pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-stone-400 font-medium">Quick Symptom Templates:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleApplyPresetSymptom('Dark water-soaked concentric lesions on lower foliage with chlorotic yellow halos. Stems have sunken black cankers.')}
                className="text-[11px] text-stone-600 bg-stone-50 hover:bg-stone-100 p-2 rounded-xl border border-stone-200 text-left transition"
              >
                🍄 Concentric spots with yellow halos (Fungal Blight)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetSymptom('Interveinal chlorosis on younger leaves, stunted canopy growth, and pale yellowing along leaf midrib.')}
                className="text-[11px] text-stone-600 bg-stone-50 hover:bg-stone-100 p-2 rounded-xl border border-stone-200 text-left transition"
              >
                🧪 Interveinal yellowing (Nutrient Deficiency)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetSymptom('Severe leaf curling and mosaic mottling on apical shoots with high population of small white sucking insects on underside.')}
                className="text-[11px] text-stone-600 bg-stone-50 hover:bg-stone-100 p-2 rounded-xl border border-stone-200 text-left transition"
              >
                🐛 Leaf curling with sucking insects (Vector/Pest)
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button & Diagnostic Progress */}
        <div className="pt-4 border-t border-stone-100">
          {analyzing ? (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-green-950 text-white space-y-4 text-center animate-in fade-in">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                <span className="font-bold text-base tracking-wide">
                  Gemini 2.5 Flash Processing Specimen
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-mono">
                {DIAGNOSTIC_STEPS[diagnosticStepIndex]}
              </p>
              <div className="w-full bg-emerald-950/80 h-1.5 rounded-full overflow-hidden max-w-md mx-auto">
                <div className="bg-emerald-400 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 group hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span>Generate AI Crop Diagnosis & Treatment Plan</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

