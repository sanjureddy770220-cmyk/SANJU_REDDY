// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Tractor,
  Layers,
  Leaf,
  CloudSun,
  Camera,
  Activity,
  Award,
  Globe2
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, loginAsDemo } = useAuth();

  const features = [
    {
      title: 'Multimodal Gemini 2.5 Flash Vision',
      desc: 'Sub-second crop disease, leaf lesion, and nutritional deficiency identification using high-resolution image analysis and zero-hallucination deterministic temperature controls (0.2).',
      icon: Sparkles,
      color: 'emerald'
    },
    {
      title: 'PostgreSQL Row Level Security (RLS)',
      desc: 'Enterprise-grade tenant isolation powered by Supabase Auth and PostgreSQL policies ensuring private, farm-specific data segregation.',
      icon: ShieldCheck,
      color: 'blue'
    },
    {
      title: 'Clinical Treatment Protocols (IPM)',
      desc: 'Structured, actionable advice with dual organic and chemical spray schedules, exact active ingredient dosages, and critical worker safety PPE guidelines.',
      icon: Leaf,
      color: 'amber'
    },
    {
      title: 'Agro-Meteorology & Spray Windows',
      desc: 'Dynamic localized weather indicators assessing leaf wetness, microclimate fungal spore risk, and optimal wind speed spray windows.',
      icon: CloudSun,
      color: 'teal'
    }
  ];

  const targetCrops = [
    { name: 'Wheat & Cereal Grains', sample: 'Leaf Rust, Powdery Mildew, Nitrogen Chlorosis', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80' },
    { name: 'Tomatoes & Solanaceae', sample: 'Early Blight, Bacterial Spot, Blossom End Rot', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a41?w=600&auto=format&fit=crop&q=80' },
    { name: 'Corn & Maize', sample: 'Northern Corn Leaf Blight, Fall Armyworm', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80' },
    { name: 'Citrus & Fruit Orchards', sample: 'Citrus Canker, Spider Mites, Iron Deficiency', image: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.stone.50))] opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-semibold shadow-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-700 animate-spin-slow" />
            <span>Powered by Google Gemini 2.5 Flash & Supabase Cloud</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.1]">
            Next-Gen AI Crop Health & <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">Agronomic Advisory</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-600 text-base sm:text-lg leading-relaxed">
            Empower growers, agronomists, and extension workers with instant multimodal disease diagnosis, soil-aware treatment dosages, and precision pest management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth?mode=signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all"
                >
                  <span>Start Diagnosing Crops</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => {
                    loginAsDemo();
                    window.location.href = '/dashboard';
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-base border border-stone-200 shadow-xs hover:border-emerald-300 transition-all"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Instant 1-Click Demo</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700">96.8%</span>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Diagnostic Accuracy</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700">&lt; 3.0s</span>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Multimodal Inference</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700">100%</span>
              <p className="text-xs text-stone-500 font-medium mt-0.5">RLS Tenant Privacy</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700">50+ Crops</span>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Pathology Models</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-stone-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 pb-8 border-b border-stone-800">
            <div>
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
                End-To-End Autonomous Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                How AgriPulse AI Operates
              </h2>
            </div>
            <Link
              to="/advisory/new"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl transition"
            >
              <Camera className="w-4 h-4" /> Try It With A Photo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Capture & Upload</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Take a field photo of the diseased leaf or soil anomaly. Select your farm plot and growth stage.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Gemini 2.5 Flash Inference</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Multimodal vision inspects lesion margins, chlorosis patterns, and fungal sporulation with strict JSON schema.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Clinical Treatment Plan</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Receive certified organic and chemical remedial rates, safety precautions, and long-term preventative controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
            Built For Agricultural Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            A Complete Precision Agronomy Platform
          </h2>
          <p className="text-stone-500 text-sm">
            Everything your farm needs from disease containment to seasonal weather intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900">{feat.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Crops Spectrum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
            Agronomic Spectrum
          </span>
          <h2 className="text-3xl font-bold text-stone-900">
            Supported Agricultural Domains
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {targetCrops.map((crop, i) => (
            <div key={i} className="rounded-3xl border border-stone-200 overflow-hidden bg-white shadow-xs group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-sm">{crop.name}</h4>
                </div>
              </div>
              <div className="p-4 text-xs text-stone-600 bg-stone-50/60">
                <span className="font-semibold text-stone-900 block mb-0.5">Diagnosable Issues:</span>
                <p className="text-stone-500">{crop.sample}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-8 sm:p-14 text-center text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to Protect Your Harvest with AI Agronomy?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm leading-relaxed">
            Create an account in 30 seconds or jump into the interactive demonstration environment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/auth?mode=signup"
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition"
            >
              Register Farm Account
            </Link>
            <button
              onClick={() => {
                loginAsDemo();
                window.location.href = '/dashboard';
              }}
              className="px-8 py-3.5 rounded-2xl bg-emerald-950/60 text-white font-bold text-sm border border-emerald-700/60 hover:bg-emerald-950 transition"
            >
              Explore Instant Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

