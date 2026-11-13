// backend/src/services/advisoryService.js
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { getFarmById } from './farmService.js';
import { analyzeCropIssue } from './geminiService.js';
import crypto from 'crypto';

// Local storage fallback for dev/demo mode
let localAdvisories = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    user_id: '00000000-0000-4000-8000-000000000001',
    farm_id: 'f1111111-1111-4111-8111-111111111111',
    crop_name: 'Tomato',
    growth_stage: 'Fruiting',
    symptom_description: 'Dark water-soaked concentric lesions on lower leaves with yellow halos. Fruit has sunken leathery black spots.',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a41?w=800&auto=format&fit=crop&q=80',
    diagnosis_title: 'Tomato Early Blight (Alternaria solani)',
    confidence_score: 96.5,
    severity_level: 'High',
    immediate_actions: [
      'Prune and safely burn or bury infected lower foliage showing concentric target spots.',
      'Cease all overhead watering; ensure drip lines do not splash soil onto low-hanging fruit.',
      'Sanitize pruning tools with 70% isopropyl alcohol between every plant row.'
    ],
    treatment_plan: {
      organic_options: [
        {
          treatment_name: 'Liquid Copper Octanoate (Copper Soap Fungicide)',
          application_method: 'Apply thoroughly to upper and lower leaves in early morning',
          dosage: '10 to 15 ml per liter of water at 7-day intervals until lesions cease spreading'
        },
        {
          treatment_name: 'Trichoderma harzianum Bio-inoculant',
          application_method: 'Soil drench around root flare to suppress soil-borne fungal inoculum',
          dosage: '5 grams per liter of water per plant root zone'
        }
      ],
      chemical_options: [
        {
          active_ingredient: 'Chlorothalonil 75% WP',
          commercial_name_examples: 'Bravo Weather Stik, Daconil',
          application_rate: '2.0 grams per liter of water (400-500g per acre)',
          safety_precautions: 'Wear full PPE (respirator, face shield, chemical-resistant gloves). Re-entry interval (REI): 24 hours.'
        },
        {
          active_ingredient: 'Azoxystrobin 23% SC',
          commercial_name_examples: 'Quadris Flowable',
          application_rate: '0.8 ml per liter of water',
          safety_precautions: 'Do not make more than 2 consecutive applications to prevent fungal resistance.'
        }
      ]
    },
    preventative_measures: [
      'Mulch heavily with clean straw or black polyethylene to prevent soil-to-leaf spore splashing.',
      'Stake and trellis indeterminate tomatoes to maximize canopy airflow.',
      'Strict 3-year crop rotation: Avoid planting after Solanaceae family members (Potato, Pepper, Eggplant).'
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'a2222222-2222-4222-8222-222222222222',
    user_id: '00000000-0000-4000-8000-000000000001',
    farm_id: 'f2222222-2222-4222-8222-222222222222',
    crop_name: 'Wheat',
    growth_stage: 'Vegetative',
    symptom_description: 'Interveinal yellowing on younger leaves with stunted tiller growth and pale green canopy.',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    diagnosis_title: 'Nitrogen & Sulfur Deficiency Chlorosis',
    confidence_score: 93.8,
    severity_level: 'Moderate',
    immediate_actions: [
      'Conduct swift top-dress fertigation with available nitrogen and sulfur.',
      'Check soil pH and moisture profile to ensure root uptake is not locked by compaction.',
      'Verify tiller count before second irrigation schedule.'
    ],
    treatment_plan: {
      organic_options: [
        {
          treatment_name: 'Hydrolyzed Fish & Kelp Emulsion',
          application_method: 'Foliar spray across crop canopy during moderate sunlight',
          dosage: '5 ml per liter of water (2.5 liters per acre)'
        },
        {
          treatment_name: 'Compost Tea with Humic Acid',
          application_method: 'Soil drench via center pivot or drip irrigation',
          dosage: '20 liters per acre diluted in irrigation flow'
        }
      ],
      chemical_options: [
        {
          active_ingredient: 'Ammonium Sulfate (21-0-0-24S) or Urea (46-0-0)',
          commercial_name_examples: 'YaraBela, Koch Agro Sulf-N',
          application_rate: '25-35 kg N per acre split into two vegetative irrigations',
          safety_precautions: 'Incorporate or irrigate immediately within 24 hours to prevent ammonia volatilization.'
        }
      ]
    },
    preventative_measures: [
      'Incorporate leguminous cover crops (hairy vetch or crimson clover) in fall cycle.',
      'Annual pre-plant soil sampling for nitrate and available sulfate down to 24 inches depth.',
      'Variable rate fertilizer application based on NDVI satellite mapping.'
    ],
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function uploadImageToStorage(fileBuffer, mimeType, userId) {
  if (!isSupabaseConfigured() || !supabase) {
    // Return base64 data URI in demo/offline mode
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }

  try {
    const fileExt = mimeType.split('/')[1] || 'jpg';
    const filePath = `${userId}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('crop-images')
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.warn('Storage upload warning, fallback to base64:', error.message);
      return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }

    const { data: publicData } = supabase.storage
      .from('crop-images')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (err) {
    console.warn('Upload error:', err.message);
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }
}

export async function createAdvisory({ userId, farmId, cropName, growthStage, symptomDescription, imageBuffer, mimeType }) {
  // 1. Fetch farm context to enrich prompt
  const farm = await getFarmById(farmId, userId);
  const farmContext = farm
    ? `Farm: ${farm.name}\nLocation: ${farm.location}\nSoil Type: ${farm.soil_type}\nIrrigation: ${farm.irrigation_system}`
    : `Farm ID: ${farmId}`;

  const promptContext = `
AgriPulse AI Diagnostic Request:
Crop: ${cropName}
Growth Stage: ${growthStage}
Symptom Description: ${symptomDescription}
${farmContext}
`;

  // 2. Multimodal AI Analysis with Gemini 2.5 Flash
  const diagnosisResult = await analyzeCropIssue({
    imageBuffer,
    mimeType,
    promptContext,
    cropName,
    growthStage,
    symptoms: symptomDescription
  });

  // 3. Handle image storage
  let imageUrl = null;
  if (imageBuffer && mimeType) {
    imageUrl = await uploadImageToStorage(imageBuffer, mimeType, userId);
  }

  // 4. Record to Database
  const advisoryRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    farm_id: farmId,
    crop_name: cropName,
    growth_stage: growthStage,
    symptom_description: symptomDescription,
    image_url: imageUrl,
    diagnosis_title: diagnosisResult.diagnosis_title,
    confidence_score: diagnosisResult.confidence_score,
    severity_level: diagnosisResult.severity_level,
    immediate_actions: diagnosisResult.immediate_actions,
    treatment_plan: diagnosisResult.treatment_plan,
    preventative_measures: diagnosisResult.preventative_measures,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('advisories')
        .insert([advisoryRecord])
        .select()
        .single();

      if (error) throw error;
      return { ...data, farm };
    } catch (err) {
      console.warn('Supabase insert advisory failed, saving to local store:', err.message);
    }
  }

  localAdvisories.unshift(advisoryRecord);
  return { ...advisoryRecord, farm };
}

export async function getAdvisoriesByUser(userId, filters = {}) {
  let list = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('advisories')
        .select(`
          *,
          farms:farm_id (id, name, location, soil_type, irrigation_system)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters.cropName) {
        query = query.ilike('crop_name', `%${filters.cropName}%`);
      }
      if (filters.severity) {
        query = query.eq('severity_level', filters.severity);
      }
      if (filters.farmId) {
        query = query.eq('farm_id', filters.farmId);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) return data;
    } catch (err) {
      console.warn('Supabase fetch advisories failed, fallback to local store:', err.message);
    }
  }

  list = localAdvisories.filter(a => a.user_id === userId || userId === '00000000-0000-4000-8000-000000000001');

  if (filters.cropName) {
    list = list.filter(a => a.crop_name.toLowerCase().includes(filters.cropName.toLowerCase()));
  }
  if (filters.severity) {
    list = list.filter(a => a.severity_level.toLowerCase() === filters.severity.toLowerCase());
  }
  if (filters.farmId) {
    list = list.filter(a => a.farm_id === filters.farmId);
  }

  return list;
}

export async function getAdvisoryById(id, userId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('advisories')
        .select(`
          *,
          farms:farm_id (id, name, location, soil_type, size_acres, irrigation_system)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data;
    } catch (err) {
      console.warn('Supabase getAdvisoryById failed, using local fallback:', err.message);
    }
  }

  return localAdvisories.find(a => a.id === id) || null;
}

export async function deleteAdvisory(id, userId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('advisories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete advisory failed, using local store:', err.message);
    }
  }

  const initial = localAdvisories.length;
  localAdvisories = localAdvisories.filter(a => a.id !== id);
  return localAdvisories.length < initial;
}

