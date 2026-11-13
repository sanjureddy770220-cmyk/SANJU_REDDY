// backend/src/config/gemini.js
import { GoogleGenAI } from '@google/genai';
import { ENV } from './env.js';

let aiInstance = null;

const isValidGeminiKey = 
  ENV.GEMINI_API_KEY && 
  ENV.GEMINI_API_KEY !== 'your-google-gemini-api-key' &&
  ENV.GEMINI_API_KEY.length > 10;

if (isValidGeminiKey) {
  try {
    aiInstance = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
    console.log('✅ Google GenAI SDK initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Google GenAI SDK:', err.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY is not configured or is a placeholder. Mock diagnosis engine ready for fallback.');
}

export const ai = aiInstance;
export const isGeminiConfigured = () => !!aiInstance;

export const cropAdvisorySchema = {
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

export const AGRONOMIST_SYSTEM_PROMPT = 
  "You are an expert Principal Agronomist and Plant Pathologist with 25+ years of field experience in crop health diagnosis, integrated pest management (IPM), and sustainable soil nutrition. Your task is to analyze crop leaf/soil imagery and farmer symptom descriptions with extreme clinical precision. Provide accurate identifications, realistic confidence scores, actionable immediate remedies, safe chemical/organic treatment dosages, and preventative measures tailored to the specified crop growth stage. Always prioritize agricultural safety, environmental stewardship, and economic viability for the farmer.";

