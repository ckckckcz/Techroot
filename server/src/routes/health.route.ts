import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';

const router: Router = Router();

router.get('/', async (_req, res) => {
    try {
        if (!env.supabaseUrl || !env.supabaseServiceKey) {
            return res.status(500).json({ status: 'error', message: 'Konfigurasi .env belum lengkap' });
        }

        const { error } = await supabase.from('_').select('*').limit(0);
        const isConnected = !error || ['42P01', 'PGRST205', 'PGRST116'].includes(error.code);

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            config: { env_loaded: true, supabase_url: env.supabaseUrl.substring(0, 15) + '...' },
            supabase: {
                connected: isConnected,
                message: isConnected ? 'Tersambung ke Supabase' : 'Gagal menyambung ke Supabase',
                error: error ? { code: error.code, message: error.message } : null
            }
        });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', detail: err.message });
    }
});

export default router;
