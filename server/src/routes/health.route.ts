import express, { Router } from 'express';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';
import type { ExpressRequest, ExpressResponse } from '../types/express.d';

const router: Router = express.Router();

router.get('/', async (req, res): Promise<void> => {
    const typedRes = res as unknown as ExpressResponse;
    try {
        if (!env.supabaseUrl || !env.supabaseServiceKey) {
            typedRes.status(500).json({ status: 'error', message: 'Konfigurasi .env belum lengkap' });
            return;
        }

        const { error } = await supabase.from('_').select('*').limit(0);
        const isConnected = !error || ['42P01', 'PGRST205', 'PGRST116'].includes(error.code);

        typedRes.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            config: { env_loaded: true, supabase_url: env.supabaseUrl.substring(0, 15) + '...' },
            supabase: {
                connected: isConnected,
                message: isConnected ? 'Tersambung ke Supabase' : 'Gagal menyambung ke Supabase',
                error: error ? { code: error.code, message: error.message } : null
            }
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        typedRes.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', detail: errorMessage });
    }
});

export default router;
