import express, { Router } from 'express';
import { env } from '../config/env';
import type { ExpressRequest, ExpressResponse } from '../types/express.d';

const router: Router = express.Router();

router.post('/chat', async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    try {
        const { message, model } = req.body as { message?: string; model?: string };

        if (!message) {
            res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
            return;
        }
        if (!env.openRouterApiKey) {
            res.status(500).json({ success: false, message: 'API Key OpenRouter tidak dikonfigurasi' });
            return;
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.openRouterApiKey}`,
                'HTTP-Referer': 'https://techroot.id',
                'X-Title': 'Techroot',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || 'google/gemma-2-9b-it:free',
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json() as { choices?: { message: { content: string } }[]; model?: string; error?: { message: string } };

        if (!response.ok) {
            res.status(response.status).json({ success: false, message: 'Terjadi kesalahan pada AI service', error: data.error?.message });
            return;
        }

        res.json({ success: true, data: { reply: data.choices?.[0]?.message?.content, model: data.model } });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: errorMessage });
    }
});

export default router;
