// frontend/src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-supabase-project') &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key';

let client = null;

if (isConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
  }
}

export const supabase = client;
export const isSupabaseConfigured = () => isConfigured && !!client;

