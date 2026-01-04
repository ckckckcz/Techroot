import { Router, Response } from 'express';
import { env } from '../config/env';

const router: Router = Router();

router.post('/chat', async (req, res: Response) => {
    try {
        const { message, model } = req.body;

        if (!message) return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
        if (!env.openRouterApiKey) return res.status(500).json({ success: false, message: 'API Key OpenRouter tidak dikonfigurasi' });

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

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ success: false, message: 'Terjadi kesalahan pada AI service', error: data.error?.message });
        }

        res.json({ success: true, data: { reply: data.choices[0].message.content, model: data.model } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

export default router;
