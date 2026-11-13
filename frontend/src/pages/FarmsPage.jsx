// frontend/src/pages/FarmsPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import FarmCard from '../components/FarmCard';
import {
  Tractor,
  Plus,
  X,
  MapPin,
  Layers,
  Droplet,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const SOIL_OPTIONS = [
  'Clay Loam (Rich Organic Matter)',
  'Sandy Loam (High Drainage)',
  'Silt Loam (Volcanic / Alluvial)',
  'Black Cotton Soil (Vertisol)',
  'Red Laterite Soil',
  'Peaty Organic Soil'
];

const IRRIGATION_OPTIONS = [
  'Automated Drip Irrigation with fertigation',
  'Micro-Sprinkler & Overhead Pivot',
  'Surface Drip Irrigation',
  'Center Pivot System',
  'Subsurface Drip Irrigation (SDI)',
  'Furrow / Flood Irrigation',
  'Rainfed Agro-system'
];

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    soil_type: SOIL_OPTIONS[0],
    size_acres: '',
    irrigation_system: IRRIGATION_OPTIONS[0]
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadFarms = async () => {
    setLoading(true);
    try {
      const res = await api.getFarms();
      setFarms(res?.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load farms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      location: '',
      soil_type: SOIL_OPTIONS[0],
      size_acres: '',
      irrigation_system: IRRIGATION_OPTIONS[0]
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      soil_type: farm.soil_type,
      size_acres: farm.size_acres,
      irrigation_system: farm.irrigation_system
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || formData.name.length < 2) {
      setFormError('Farm name must be at least 2 characters');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Location is required');
      return;
    }
    const size = Number(formData.size_acres);
    if (isNaN(size) || size <= 0) {
      setFormError('Farm size must be a positive number of acres');
      return;
    }

    setSubmitting(true);
    try {
      if (editingFarm) {
        await api.updateFarm(editingFarm.id, {
          ...formData,
          size_acres: size
        });
      } else {
        await api.createFarm({
          ...formData,
          size_acres: size
        });
      }

      setModalOpen(false);
      await loadFarms();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Failed to save farm plot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm('Are you sure you want to remove this farm plot? Associated advisories will also be deleted.')) {
      return;
    }
    try {
      await api.deleteFarm(farmId);
      await loadFarms();
    } catch (err) {
      alert(err.message || 'Failed to delete farm plot');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Farm & Field Plot Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Register and calibrate plots with location, soil profile, and irrigation system parameters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Farm Plot</span>
        </button>
      </div>

      {/* Farms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-stone-200/70 rounded-2xl"></div>
          ))}
        </div>
      ) : farms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Tractor className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Farm Plots Registered</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Register your first agricultural parcel so our Gemini AI model can factor in soil type and regional climate during crop diagnostics.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Create Plot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {editingFarm ? 'Edit Farm Plot' : 'Register Agricultural Land'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Parameters used by Gemini 2.5 Flash to personalize nutrient recommendations.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Plot / Farm Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Valley Orchard - Plot B"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Location (Region, Coordinates, or County)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salinas Valley, California (36.67° N, 121.65° W)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Soil Profile Type
                  </label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  >
                    {SOIL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Plot Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 35.5"
                    value={formData.size_acres}
                    onChange={(e) => setFormData({ ...formData, size_acres: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Irrigation System
                </label>
                <select
                  value={formData.irrigation_system}
                  onChange={(e) => setFormData({ ...formData, irrigation_system: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                >
                  {IRRIGATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving Plot...' : editingFarm ? 'Update Plot' : 'Register Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

