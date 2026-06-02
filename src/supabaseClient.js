import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Buat client Supabase dengan schema 'social_audit' terpisah
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'social_audit'
      }
    }) 
  : null;

// Helper untuk mengecek status Supabase
export const isSupabaseConfigured = () => !!supabase;
