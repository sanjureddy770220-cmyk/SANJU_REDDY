// frontend/src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FileSearch,
  Search,
  Filter,
  PlusCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function HistoryPage() {
  const [advisories, setAdvisories] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedFarm, setSelectedFarm] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'confidence'

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [advRes, farmsRes] = await Promise.all([
          api.getAdvisories().catch(() => ({ data: [] })),
          api.getFarms().catch(() => ({ data: [] }))
        ]);
        setAdvisories(advRes?.data || []);
        setFarms(farmsRes?.data || []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter and Sort logic
  const filteredAdvisories = advisories.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.diagnosis_title?.toLowerCase().includes(q) ||
      item.crop_name?.toLowerCase().includes(q) ||
      item.symptom_description?.toLowerCase().includes(q);

    const matchesSeverity =
      selectedSeverity === 'ALL' ||
      item.severity_level?.toLowerCase() === selectedSeverity.toLowerCase();

    const matchesFarm =
      selectedFarm === 'ALL' ||
      item.farm_id === selectedFarm;

    return matchesSearch && matchesSeverity && matchesFarm;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === 'confidence') {
      return (b.confidence_score || 0) - (a.confidence_score || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Advisory Archive & Pathology Logs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Historical log of all multimodal diagnoses, treatment prescriptions, and field assessments.
          </p>
        </div>

        <Link
          to="/advisory/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New AI Diagnosis</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search diagnosis, crop, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
            >
              <option value="ALL">All Severities</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Farm Filter */}
          <div>
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
            >
              <option value="ALL">All Farm Plots</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span>Showing {filteredAdvisories.length} advisory reports</span>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 border-none focus:outline-none cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advisory Logs List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-stone-200/70 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredAdvisories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <FileSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Advisory Logs Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No diagnostic records matched your filter criteria or no advisories have been requested yet.
          </p>
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
          >
            <PlusCircle className="w-4 h-4" /> Run New Diagnosis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAdvisories.map((adv) => (
            <Link
              key={adv.id}
              to={`/advisory/${adv.id}`}
              className="block bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {adv.image_url ? (
                    <img
                      src={adv.image_url}
                      alt={adv.crop_name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 font-bold text-lg">
                      {adv.crop_name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {adv.diagnosis_title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        adv.severity_level?.toLowerCase() === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : adv.severity_level?.toLowerCase() === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {adv.severity_level}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-stone-800">{adv.crop_name}</span>
                      <span>•</span>
                      <span>{adv.growth_stage}</span>
                      <span>•</span>
                      <span>{new Date(adv.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {adv.farms?.name && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">{adv.farms.name}</span>
                        </>
                      )}
                    </p>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-1">
                      "{adv.symptom_description}"
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Confidence</span>
                    <span className="text-sm font-black text-emerald-700">{adv.confidence_score}%</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>View Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

