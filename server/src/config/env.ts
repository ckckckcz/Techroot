import 'dotenv/config';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY, JWT_SECRET, PORT } = process.env;

if (!SUPABASE_URL) console.error('❌ SUPABASE_URL not set');
if (!SUPABASE_SERVICE_ROLE_KEY) console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');

export const env = {
    port: Number(PORT) || 5000,
    supabaseUrl: SUPABASE_URL || '',
    supabaseServiceKey: SUPABASE_SERVICE_ROLE_KEY || '',
    openRouterApiKey: OPENROUTER_API_KEY || '',
    jwtSecret: JWT_SECRET || 'techroot-secret-key-change-in-production',
};
