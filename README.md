# AgriPulse AI — Next-Gen Crop Health & Advisory Intelligence

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google%20GenAI-gemini--2.5--flash-orange)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20(RLS)-3ecf8e)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)](https://tailwindcss.com/)

**AgriPulse AI** is a production-grade, end-to-end precision agritech digital ecosystem. It empowers farmers, agronomists, and agricultural extension workers to diagnose crop health issues, receive localized fertilizer and pest management recommendations, analyze soil and leaf pathology, and track microclimate spray conditions through an intuitive AI-driven interface.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │        AgriPulse AI Frontend           │
                      │  React (Vite) + Tailwind CSS + Lucide  │
                      └───────────────────┬────────────────────┘
                                          │
                        HTTPS / JSON / Multipart Form-Data
                                          │
                      ┌───────────────────▼────────────────────┐
                      │         Express.js Backend API         │
                      │   Multer + Zod Validation + JWT Auth   │
                      └─────────┬────────────────────┬─────────┘
                                │                    │
       Multimodal Vision (JSON) │                    │ Service Role / JWT
                                │                    │
             ┌──────────────────▼──────┐   ┌─────────▼──────────────────┐
             │    Google Gemini SDK    │   │   Supabase Cloud Postgres  │
             │   (@google/genai)       │   │  - Row Level Security (RLS)│
             │    gemini-2.5-flash     │   │  - Farms & Advisories Tables│
             │   Deterministic (0.2)   │   │  - Storage Bucket (Images) │
             └─────────────────────────┘   └────────────────────────────┘
```

---

## Key Features

1. **Secure Authentication & Data Isolation:**
   - Supabase Auth (Email/Password, Magic Link, and persistent JWT sessions).
   - PostgreSQL Row Level Security (RLS) ensuring strict tenant isolation across all farm plots and advisory archives.
   - 1-Click Interactive Demo Mode for instant inspection.

2. **Farm & Field Plot Profiling:**
   - Multi-plot registration with GPS coordinates, acreage, soil classification (e.g. Clay Loam, Sandy Loam), and irrigation infrastructure (Automated Drip, Overhead Pivot).

3. **Multimodal Gemini 2.5 Flash Crop Diagnosis:**
   - Drag-and-drop or direct mobile camera capture of diseased foliage or soil conditions.
   - Deterministic clinical reasoning with `temperature: 0.2` and strict JSON Schema enforcement.
   - Comprehensive IPM recommendations:
     - **Confidence Score & Severity Badges:** (Low, Moderate, High, Critical).
     - **Immediate Remedial Actions:** Prioritized containment checklist within 24–48 hours.
     - **Targeted Treatment Plan:** Dual organic/biological and chemical interventions with commercial product examples, exact dosage rates, and mandatory PPE precautions.
     - **Long-Term Cultural & Preventative Controls:** Crop rotations, sanitation, and nutritional soil amendments.

4. **Localized Agro-Meteorology & Spray Windows:**
   - Live ambient temperature, relative humidity, wind velocity, and 24-hour precipitation probability.
   - Real-time spray condition rating (Optimal, Marginal, Unfavorable) to prevent chemical drift or rain wash-off.
   - Fungal spore germination risk index based on microclimate leaf wetness.

5. **Historical Archive & Multi-Format Export:**
   - Searchable, filterable archive by crop name, severity level, and farm plot.
   - One-click Print/PDF formatting and structured Markdown export.

---

## Directory Structure

```text
agripulse-ai/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment, Gemini SDK & Supabase clients
│   │   ├── controllers/        # Farm, Advisory, and Weather controllers
│   │   ├── middleware/         # Supabase JWT Auth, Multer upload, Error handler
│   │   ├── routes/             # Express API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Gemini AI, DB operations, and weather service
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, FarmCard, ImageUploader, AdvisoryCard, WeatherWidget
│   │   ├── context/            # AuthContext (Supabase Auth & Demo Session)
│   │   ├── pages/              # Landing, Auth, Dashboard, Farms, NewAdvisory, AdvisoryDetail, History
│   │   ├── services/           # API fetch client & Supabase client
│   │   ├── App.jsx             # React Router config & ProtectedLayout
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS directives
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Production PostgreSQL DDL, RLS policies, indexes
│   └── apply-migration.js          # Direct PostgreSQL migration runner
├── package.json
└── README.md
```

---

## Database Setup (Supabase PostgreSQL)

### Option A: Run migration directly using the Migration Runner

Set your `DATABASE_URL` in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Then run:
```bash
npm run migrate
```

### Option B: Copy & Paste into Supabase SQL Editor

Open your Supabase Dashboard, navigate to the **SQL Editor**, and execute the script located at:
[`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

This script:
- Enables the `uuid-ossp` extension.
- Creates `public.farms` and `public.advisories` tables.
- Enables Row Level Security (RLS) and attaches user isolation policies (`auth.uid() = user_id`).
- Creates query indexes for performance.
- Configures the `crop-images` public storage bucket.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note on Local/Demo Mode:** If environment variables are empty or contain placeholder values, AgriPulse AI seamlessly operates in **Demo/Evaluation Mode** with a built-in clinical diagnostic engine and in-memory farm store, enabling full end-to-end functionality without crashing.

---

## Running the Application

### 1. Install Dependencies

In the root folder:
```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

### 2. Start the Backend API

```bash
cd backend
npm start
```
The Express server starts on `http://localhost:5000`. You can verify health at `http://localhost:5000/api/health`.

### 3. Start the Frontend Application

```bash
cd frontend
npm run dev
```
The Vite development server runs at `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health & integration status | No |
| `POST` | `/api/advisories` | Create multimodal crop advisory (`multipart/form-data`) | Yes (Bearer Token) |
| `GET` | `/api/advisories` | List user advisories (supports `cropName`, `severity`, `farmId`) | Yes (Bearer Token) |
| `GET` | `/api/advisories/:id` | Get single advisory report | Yes (Bearer Token) |
| `DELETE` | `/api/advisories/:id` | Delete advisory record | Yes (Bearer Token) |
| `GET` | `/api/farms` | List all farm plots for user | Yes (Bearer Token) |
| `POST` | `/api/farms` | Register new farm plot | Yes (Bearer Token) |
| `GET` | `/api/farms/:id` | Get farm plot details | Yes (Bearer Token) |
| `PUT` | `/api/farms/:id` | Update farm plot details | Yes (Bearer Token) |
| `DELETE` | `/api/farms/:id` | Delete farm plot | Yes (Bearer Token) |
| `GET` | `/api/weather` | Localized agro-meteorology and spray indices | Yes (Bearer Token) |

---

## Gemini 2.5 Flash Multimodal Schema

```javascript
const cropAdvisorySchema = {
  type: "OBJECT",
  properties: {
    diagnosis_title: { type: "STRING" },
    confidence_score: { type: "NUMBER", description: "Value between 0 and 100" },
    severity_level: { type: "STRING", enum: ["Low", "Moderate", "High", "Critical"] },
    immediate_actions: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    treatment_plan: {
      type: "OBJECT",
      properties: {
        organic_options: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              treatment_name: { type: "STRING" },
              application_method: { type: "STRING" },
              dosage: { type: "STRING" }
            },
            required: ["treatment_name", "application_method", "dosage"]
          }
        },
        chemical_options: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              active_ingredient: { type: "STRING" },
              commercial_name_examples: { type: "STRING" },
              application_rate: { type: "STRING" },
              safety_precautions: { type: "STRING" }
            },
            required: ["active_ingredient", "application_rate", "safety_precautions"]
          }
        }
      },
      required: ["organic_options", "chemical_options"]
    },
    preventative_measures: {
      type: "ARRAY",
      items: { type: "STRING" }
    }
  },
  required: [
    "diagnosis_title",
    "confidence_score",
    "severity_level",
    "immediate_actions",
    "treatment_plan",
    "preventative_measures"
  ]
};
```

---

## Production Security Guardrails

- **MIME & File Size Enforced:** Multer validates files to strictly allow JPEG, PNG, and WebP formats up to 10MB.
- **Strict Zod Validations:** Incoming payload fields (`farm_id`, `crop_name`, `growth_stage`, `symptom_description`, `size_acres`) are strictly parsed and validated against Zod schemas.
- **JWT Authorization Verification:** Token verification middleware verifies Supabase Auth bearer tokens on every API endpoint.
- **API Key Segregation:** `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` remain strictly server-side and are never exposed to the frontend bundle.

---

## License

MIT License. Developed for the global agronomy and precision agriculture community.

