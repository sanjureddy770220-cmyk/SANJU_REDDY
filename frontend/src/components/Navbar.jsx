// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Tractor,
  FileSearch,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isDemo } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Farms', path: '/farms', icon: Tractor },
    { label: 'New Advisory', path: '/advisory/new', icon: PlusCircle, highlight: true },
    { label: 'Advisory Logs', path: '/history', icon: FileSearch }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                AgriPulse<span className="text-emerald-600">.ai</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-emerald-800/80 -mt-1">
                Precision Agritech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      link.highlight
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 font-semibold'
                        : isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/#features" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition">
                Platform Overview
              </Link>
              <Link to="/#technology" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition">
                Gemini 2.5 Flash
              </Link>
              <Link to="/#security" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition">
                Enterprise RLS
              </Link>
            </div>
          )}

          {/* Right Action / Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-stone-100 transition focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-stone-700 max-w-[130px] truncate">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user?.email}</p>
                      {isDemo && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Demo Session Active
                        </span>
                      )}
                    </div>

                    <Link
                      to="/farms"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <Tractor className="w-4 h-4 text-stone-500" /> Farm Profiles
                    </Link>

                    <Link
                      to="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <FileSearch className="w-4 h-4 text-stone-500" /> Past Advisories
                    </Link>

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" /> End Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Icon className="w-5 h-5 text-stone-500" />
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

