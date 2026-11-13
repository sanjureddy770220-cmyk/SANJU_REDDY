// backend/src/services/farmService.js
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

// Local store for dev/demo mode
let localFarms = [
  {
    id: 'f1111111-1111-4111-8111-111111111111',
    user_id: '00000000-0000-4000-8000-000000000001',
    name: 'Green Oasis Farm - Plot 1',
    location: 'Central Valley, California (36.7783° N, 119.4179° W)',
    soil_type: 'Clay Loam (Rich Organic Matter)',
    size_acres: 45.5,
    irrigation_system: 'Automated Drip Irrigation with fertigation',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'f2222222-2222-4222-8222-222222222222',
    user_id: '00000000-0000-4000-8000-000000000001',
    name: 'Highland Orchard & Field 3',
    location: 'Yakima Valley, Washington (46.6021° N, 120.5059° W)',
    soil_type: 'Silt Loam (Volcanic Ash origin)',
    size_acres: 28.0,
    irrigation_system: 'Micro-sprinkler & Center Pivot',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function getFarmsByUser(userId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch failed for farms, falling back to memory store:', err.message);
    }
  }

  return localFarms.filter(f => f.user_id === userId || userId === '00000000-0000-4000-8000-000000000001');
}

export async function getFarmById(farmId, userId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('id', farmId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data;
    } catch (err) {
      console.warn('Supabase getFarmById failed, falling back to memory store:', err.message);
    }
  }

  return localFarms.find(f => f.id === farmId) || null;
}

export async function createFarm({ userId, name, location, soil_type, size_acres, irrigation_system }) {
  const newFarm = {
    id: crypto.randomUUID(),
    user_id: userId,
    name,
    location,
    soil_type,
    size_acres: Number(size_acres),
    irrigation_system,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .insert([newFarm])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase insert farm failed, using memory store fallback:', err.message);
    }
  }

  localFarms.unshift(newFarm);
  return newFarm;
}

export async function updateFarm(farmId, userId, updateData) {
  const updatedFields = {
    ...updateData,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .update(updatedFields)
        .eq('id', farmId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase update farm failed, falling back to memory store:', err.message);
    }
  }

  const index = localFarms.findIndex(f => f.id === farmId);
  if (index !== -1) {
    localFarms[index] = { ...localFarms[index], ...updatedFields };
    return localFarms[index];
  }
  return null;
}

export async function deleteFarm(farmId, userId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('farms')
        .delete()
        .eq('id', farmId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete farm failed, falling back to memory store:', err.message);
    }
  }

  const initialLen = localFarms.length;
  localFarms = localFarms.filter(f => f.id !== farmId);
  return localFarms.length < initialLen;
}

