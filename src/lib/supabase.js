import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage or Vite environment variables
const SUPABASE_STORAGE_KEY_URL = 'taskflow_supabase_url';
const SUPABASE_STORAGE_KEY_ANON = 'taskflow_supabase_anon_key';

export const DEFAULT_SUPABASE_URL = 'https://fmuswojgoimfwallfpgx.supabase.co';
export const SUPABASE_PROJECT_ID = 'fmuswojgoimfwallfpgx';

export const getSupabaseCredentials = () => {
  const storedUrl = localStorage.getItem(SUPABASE_STORAGE_KEY_URL);
  const storedKey = localStorage.getItem(SUPABASE_STORAGE_KEY_ANON);
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return {
    url: storedUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: storedKey || envKey || ''
  };
};

export const saveSupabaseCredentials = (url, anonKey) => {
  if (url) localStorage.setItem(SUPABASE_STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(SUPABASE_STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(SUPABASE_STORAGE_KEY_ANON, anonKey.trim());
  else localStorage.removeItem(SUPABASE_STORAGE_KEY_ANON);
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
};

// Create client instance dynamically
let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Supabase initialization failed:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// Test active connection to Supabase
export const testSupabaseConnection = async () => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL or Anon Key is missing.' };
  }
  try {
    const { data, error } = await client.from('projects').select('count', { count: 'exact', head: true });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase PostgreSQL database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
};
