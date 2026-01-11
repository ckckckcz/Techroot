import 'dotenv/config';

const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    OPENROUTER_API_KEY,
    JWT_SECRET,
    PORT,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    FRONTEND_URL
} = process.env;

if (!SUPABASE_URL) console.error('❌ SUPABASE_URL not set');
if (!SUPABASE_SERVICE_ROLE_KEY) console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
if (!GITHUB_CLIENT_ID) console.warn('⚠️ GITHUB_CLIENT_ID not set - GitHub OAuth disabled');
if (!GITHUB_CLIENT_SECRET) console.warn('⚠️ GITHUB_CLIENT_SECRET not set - GitHub OAuth disabled');

export const env = {
    port: Number(PORT) || 5000,
    supabaseUrl: SUPABASE_URL || '',
    supabaseServiceKey: SUPABASE_SERVICE_ROLE_KEY || '',
    openRouterApiKey: OPENROUTER_API_KEY || '',
    jwtSecret: JWT_SECRET || 'techroot-secret-key-change-in-production',
    githubClientId: GITHUB_CLIENT_ID || '',
    githubClientSecret: GITHUB_CLIENT_SECRET || '',
    frontendUrl: FRONTEND_URL || 'http://localhost:3000',
};
