// backend/src/schemas/validationSchemas.js
import { z } from 'zod';

export const createFarmSchema = z.object({
  name: z.string().min(2, "Farm name is required"),
  location: z.string().min(2, "Location is required"),
  soil_type: z.string().min(2, "Soil type is required"),
  size_acres: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive("Size must be greater than 0")
  ),
  irrigation_system: z.string().min(2, "Irrigation system is required")
});

export const updateFarmSchema = createFarmSchema.partial();

export const advisoryInputSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  crop_name: z.string().min(2, "Crop name is required"),
  growth_stage: z.string().min(2, "Growth stage is required"),
  symptom_description: z.string().min(10, "Please provide a detailed symptom description")
});

export const cropAdvisoryResultSchema = z.object({
  diagnosis_title: z.string(),
  confidence_score: z.number().min(0).max(100),
  severity_level: z.enum(['Low', 'Moderate', 'High', 'Critical']),
  immediate_actions: z.array(z.string()),
  treatment_plan: z.object({
    organic_options: z.array(z.object({
      treatment_name: z.string(),
      application_method: z.string(),
      dosage: z.string()
    })),
    chemical_options: z.array(z.object({
      active_ingredient: z.string(),
      commercial_name_examples: z.string().optional(),
      application_rate: z.string(),
      safety_precautions: z.string()
    }))
  }),
  preventative_measures: z.array(z.string())
});

