// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  PlusCircle,
  FileSearch,
  Sparkles,
  CloudSun,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    {
      name: 'Overview Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Farm & Field Plots',
      path: '/farms',
      icon: Tractor,
      badge: null
    },
    {
      name: 'New AI Diagnosis',
      path: '/advisory/new',
      icon: PlusCircle,
      badge: 'AI 2.5',
      primary: true
    },
    {
      name: 'Advisory Archive',
      path: '/history',
      icon: FileSearch,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden lg:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Agronomic Controls
          </p>
          <nav className="mt-2.5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      item.primary
                        ? isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 font-semibold border border-emerald-200'
                        : isActive
                        ? 'bg-stone-100 text-emerald-800 font-semibold border-l-4 border-emerald-600'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Diagnostic Engine Status Box */}
        <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-emerald-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Gemini 2.5 Flash</span>
          </div>
          <h4 className="font-bold text-white text-sm mt-1">Multi-Modal Vision</h4>
          <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
            Clinical crop pathogen identification with deterministic temperature = 0.2.
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-300">
            <span>Latency Target</span>
            <span className="font-mono font-bold text-white">&lt; 3.5s</span>
          </div>
        </div>
      </div>

      {/* Security & RLS badge */}
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2 text-xs text-stone-500 px-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>PostgreSQL Row Level Security Active</span>
        </div>
      </div>
    </aside>
  );
}

