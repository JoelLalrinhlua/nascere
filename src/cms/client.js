import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
// Preview is a development-only, explicitly enabled sandbox. Never shipped live.
export const previewMode = !import.meta.env.SSR && import.meta.env.DEV && import.meta.env.VITE_CMS_PREVIEW === 'true';
export const cmsEnabled = configured || previewMode;
export const supabase = configured ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;
export const BUCKET = 'studio-media';
