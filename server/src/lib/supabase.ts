import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const isConfigured = env.supabaseUrl && env.supabaseServiceKey;

if (!isConfigured) console.error('⚠️ Supabase client not initialized - missing credentials');

export const supabase = createClient(
    isConfigured ? env.supabaseUrl : 'https://placeholder.supabase.co',
    isConfigured ? env.supabaseServiceKey : 'placeholder-key',
    { auth: { persistSession: false } }
);
