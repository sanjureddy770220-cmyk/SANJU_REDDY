// backend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

let supabaseClient = null;

const isValidSupabaseConfig = 
  ENV.SUPABASE_URL && 
  ENV.SUPABASE_URL.startsWith('http') && 
  !ENV.SUPABASE_URL.includes('your-supabase-project') &&
  ENV.SUPABASE_SERVICE_ROLE_KEY &&
  ENV.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key';

if (isValidSupabaseConfig) {
  try {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Client initialized with Service Role Key.');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn('⚠️ Supabase credentials are empty or placeholders. Running in Dev/Demo mode.');
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = () => !!supabaseClient;

