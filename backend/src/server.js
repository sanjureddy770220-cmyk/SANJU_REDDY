// backend/src/server.js
import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import farmRoutes from './routes/farmRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isGeminiConfigured } from './config/gemini.js';

const app = express();

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or any origin in development
    if (!origin || ENV.NODE_ENV === 'development' || ENV.CORS_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed by Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-Mode']
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AgriPulse AI Agricultural Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    integrations: {
      supabase: isSupabaseConfigured() ? 'Connected' : 'Demo/Local Mode Active',
      gemini_2_5_flash: isGeminiConfigured() ? 'Ready' : 'Diagnostic Knowledge Base Active'
    }
  });
});

// API Routes
app.use('/api/farms', farmRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/weather', weatherRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(ENV.PORT, () => {
  console.log('==================================================');
  console.log(`🌾 AgriPulse AI Server listening on port ${ENV.PORT}`);
  console.log(`🌐 Base URL: http://localhost:${ENV.PORT}`);
  console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`⚡ Supabase Configured: ${isSupabaseConfigured() ? 'YES' : 'NO (Demo/Fallback Active)'}`);
  console.log(`🤖 Gemini Configured: ${isGeminiConfigured() ? 'YES' : 'NO (Diagnostic KB Active)'}`);
  console.log('==================================================');
});

export default app;

