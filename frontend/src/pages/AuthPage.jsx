// frontend/src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import {
  Sprout,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'magic-link'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [error, setError] = useState(null);
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const { login, signup, loginWithMagicLink, loginAsDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsEmailUnconfirmed(false);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        const result = await signup(email, password, fullName);
        if (result?.session) {
          navigate('/dashboard');
        } else {
          setSuccessMessage(
            'Account registered successfully! If email confirmation is enabled in your Supabase project, please check your inbox (or spam) to verify your address before signing in.'
          );
          setMode('login');
        }
      } else if (mode === 'magic-link') {
        await loginWithMagicLink(email);
        setSuccessMessage('Magic link sent! Check your email inbox to sign in directly.');
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      const msg = err.message || '';
      
      if (msg.toLowerCase().includes('email not confirmed')) {
        setIsEmailUnconfirmed(true);
        setError('Your email has not been confirmed yet. Please check your inbox for the Supabase confirmation email.');
      } else {
        setError(msg || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address to resend the confirmation email.');
      return;
    }
    setResendingEmail(true);
    try {
      if (supabase) {
        const { error: resendErr } = await supabase.auth.resend({
          type: 'signup',
          email: email
        });
        if (resendErr) throw resendErr;
        setSuccessMessage(`Confirmation email resent to ${email}. Please check your inbox.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation email.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {mode === 'signup'
              ? 'Create Farm Profile'
              : mode === 'magic-link'
              ? 'Magic Link Sign In'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'signup'
              ? 'Register your agricultural plot credentials'
              : mode === 'magic-link'
              ? 'Receive a one-click login link via email'
              : 'Access your crop health dashboard & field logs'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setIsEmailUnconfirmed(false); }}
            className={`py-2 rounded-xl transition ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setIsEmailUnconfirmed(false); }}
            className={`py-2 rounded-xl transition ${
              mode === 'signup'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('magic-link'); setError(null); setIsEmailUnconfirmed(false); }}
            className={`py-2 rounded-xl transition ${
              mode === 'magic-link'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>

            {isEmailUnconfirmed && (
              <div className="pt-2 border-t border-rose-200/80 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-rose-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition w-fit"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>{resendingEmail ? 'Resending...' : 'Resend Confirmation Email'}</span>
                </button>
                <p className="text-[11px] text-stone-600 leading-relaxed bg-white/80 p-2 rounded-lg border border-rose-100">
                  💡 <strong>Tip for Instant Access:</strong> In your Supabase Dashboard, go to <strong>Authentication &rarr; Providers &rarr; Email</strong> and toggle off <strong>Confirm email</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Gonzalez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="farmer@agripulse.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {mode !== 'magic-link' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Register Account'
                    : mode === 'magic-link'
                    ? 'Send Magic Link'
                    : 'Sign In to Dashboard'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Sandbox Shortcut */}
        <div className="pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant Demo Mode (No Registration Required)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
