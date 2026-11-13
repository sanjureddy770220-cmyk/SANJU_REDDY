// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import FarmCard from '../components/FarmCard';
import WeatherWidget from '../components/WeatherWidget';
import {
  Tractor,
  FileSearch,
  PlusCircle,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const [farms, setFarms] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [farmsRes, advisoriesRes] = await Promise.all([
          api.getFarms().catch(() => ({ data: [] })),
          api.getAdvisories().catch(() => ({ data: [] }))
        ]);

        setFarms(farmsRes?.data || []);
        setAdvisories(advisoriesRes?.data || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to fetch agricultural records.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalAcres = farms.reduce((acc, f) => acc + (Number(f.size_acres) || 0), 0);
  const criticalCount = advisories.filter(a => a.severity_level?.toLowerCase() === 'critical' || a.severity_level?.toLowerCase() === 'high').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Agricultural Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time crop pathology diagnostics, microclimate risk, and plot management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/farms"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 shadow-2xs transition"
          >
            <Tractor className="w-4 h-4 text-emerald-600" />
            <span>Manage Farms</span>
          </Link>

          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New AI Advisory</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Plots</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{farms.length}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {totalAcres.toFixed(1)} Total Acres Cultivated
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">AI Diagnoses</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{advisories.length}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Gemini 2.5 Flash Reports
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Active High Risk</span>
            <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${criticalCount > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
            {criticalCount}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Requires Immediate Remedial Action
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Health Index</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">
            {criticalCount === 0 ? '98%' : `${Math.max(65, 95 - criticalCount * 8)}%`}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Crop Canopy Vitality
          </span>
        </div>
      </div>

      {/* Main Grid: Weather & Recent Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recent Advisories & Plots */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Advisories */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Recent Crop Diagnoses</h3>
                <p className="text-xs text-stone-500">Latest field inspections and treatment protocols.</p>
              </div>
              <Link
                to="/history"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-400 animate-pulse">
                Loading advisory records...
              </div>
            ) : advisories.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800 text-sm">No Advisories Generated Yet</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Upload a photo of any crop leaf showing spots, yellowing, or pests to receive instant clinical diagnosis.
                </p>
                <Link
                  to="/advisory/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Run First Diagnosis
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {advisories.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    to={`/advisory/${item.id}`}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/80 -mx-3 px-3 rounded-xl transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.crop_name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 font-bold text-xs">
                          {item.crop_name?.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 truncate">
                            {item.diagnosis_title}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          {item.crop_name} ({item.growth_stage}) • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.severity_level?.toLowerCase() === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.severity_level?.toLowerCase() === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.severity_level}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Farm Plots Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Registered Farm Plots</h3>
                <p className="text-xs text-stone-500">Plots monitored under your account.</p>
              </div>
              <Link
                to="/farms"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All ({farms.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farms.slice(0, 2).map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Weather & Spray Guidelines */}
        <div className="space-y-6">
          <WeatherWidget
            location={farms[0]?.location || 'Central Valley'}
            soilType={farms[0]?.soil_type || 'Clay Loam'}
          />
        </div>
      </div>
    </div>
  );
}

