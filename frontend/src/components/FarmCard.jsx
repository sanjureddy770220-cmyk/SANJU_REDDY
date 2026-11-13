// frontend/src/components/FarmCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Droplet,
  Maximize2,
  Trash2,
  Edit,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export default function FarmCard({ farm, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
              {farm.name}
            </h3>
            <p className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{farm.location}</span>
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {farm.size_acres ? `${farm.size_acres} Acres` : 'Plot'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <span className="text-stone-400 font-medium block flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3 text-stone-500" /> Soil Profile
            </span>
            <span className="font-semibold text-stone-800 block truncate" title={farm.soil_type}>
              {farm.soil_type || 'Unspecified'}
            </span>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <span className="text-stone-400 font-medium block flex items-center gap-1 mb-1">
              <Droplet className="w-3 h-3 text-blue-500" /> Irrigation
            </span>
            <span className="font-semibold text-stone-800 block truncate" title={farm.irrigation_system}>
              {farm.irrigation_system || 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <Link
          to={`/advisory/new?farmId=${farm.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" /> Diagnose Crop
        </Link>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(farm)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              title="Edit Farm Plot"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(farm.id)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Farm Plot"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

