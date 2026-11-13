// backend/src/middleware/auth.js
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Fallback demo user for local/offline testing
export const DEMO_USER = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'farmer.demo@agripulse.ai',
  user_metadata: {
    full_name: 'Dr. Jane Vance (Demo Farmer)'
  }
};

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If in demo mode and no header or anonymous request in dev, allow fallback or require login
      if (req.headers['x-demo-mode'] === 'true' || !isSupabaseConfigured()) {
        req.user = DEMO_USER;
        return next();
      }
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header with Bearer token'
      });
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-token' || token === 'demo-access-token') {
      req.user = DEMO_USER;
      return next();
    }

    if (!isSupabaseConfigured()) {
      // In dev mode without live Supabase keys, authenticate user with demo context
      req.user = {
        id: DEMO_USER.id,
        email: DEMO_USER.email
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error ? error.message : 'Invalid or expired session token'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user token'
    });
  }
}

