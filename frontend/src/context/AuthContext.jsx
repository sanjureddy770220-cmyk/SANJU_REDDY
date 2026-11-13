// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'farmer.demo@agripulse.ai',
  user_metadata: {
    full_name: 'Dr. Jane Vance (Agronomist)'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let subscription = null;

    async function initializeAuth() {
      // Check if demo session is stored
      const storedDemo = localStorage.getItem('agripulse_demo_session');
      if (storedDemo) {
        setUser(DEMO_USER);
        setSession({ access_token: 'demo-token', user: DEMO_USER });
        setIsDemo(true);
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user || null);
            setIsDemo(false);
          });
          subscription = authListener?.subscription;
        } catch (err) {
          console.error('Supabase Auth error:', err);
        }
      }

      setLoading(false);
    }

    initializeAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured()) {
      // In unconfigured demo mode, log in as demo
      loginAsDemo();
      return { user: DEMO_USER };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    setIsDemo(false);
    localStorage.removeItem('agripulse_demo_session');
    localStorage.removeItem('agripulse_demo_token');
    return data;
  };

  const signup = async (email, password, fullName) => {
    if (!isSupabaseConfigured()) {
      loginAsDemo();
      return { user: DEMO_USER };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) throw error;
    return data;
  };

  const loginWithMagicLink = async (email) => {
    if (!isSupabaseConfigured()) {
      loginAsDemo();
      return;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) throw error;
    return data;
  };

  const loginAsDemo = () => {
    localStorage.setItem('agripulse_demo_session', 'true');
    localStorage.setItem('agripulse_demo_token', 'demo-access-token');
    setUser(DEMO_USER);
    setSession({ access_token: 'demo-access-token', user: DEMO_USER });
    setIsDemo(true);
  };

  const logout = async () => {
    localStorage.removeItem('agripulse_demo_session');
    localStorage.removeItem('agripulse_demo_token');
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemo,
        login,
        signup,
        loginWithMagicLink,
        loginAsDemo,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

