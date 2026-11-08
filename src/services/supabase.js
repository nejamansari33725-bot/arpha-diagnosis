import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistence storage helper for standalone mode
export const storage = {
  get: (key, defaultVal) => {
    try {
      const data = localStorage.getItem(`arpha_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn(`Storage get error for ${key}:`, e);
      return defaultVal;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(`arpha_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn(`Storage set error for ${key}:`, e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(`arpha_${key}`);
    } catch (e) {}
  }
};
