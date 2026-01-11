import express, { Router } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import type { ExpressRequest, ExpressResponse } from '../types/express.d';

const router: Router = express.Router();

interface MessageData {
    id: string;
    module_id: string;
    user_id: string;
    content: string | null;
    images: string[];
    created_at: string;
    users?: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

const transformMessage = (msg: MessageData) => ({
    id: msg.id,
    module_id: msg.module_id,
    sender: { id: msg.users?.id, name: msg.users?.name, avatar: msg.users?.avatar },
    content: msg.content,
    images: msg.images || [],
    timestamp: msg.created_at
});

const selectWithUser = `id, module_id, user_id, content, images, created_at, users!module_discussions_user_id_fkey (id, name, avatar)`;

router.get('/:moduleId', async (req, res): Promise<void> => {
    const typedReq = req as unknown as ExpressRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const { data: messages, error } = await supabase
            .from('module_discussions')
            .select(selectWithUser)
            .eq('module_id', typedReq.params.moduleId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        typedRes.json({ success: true, data: (messages || []).map((msg: unknown) => transformMessage(msg as MessageData)) });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to get discussions', error: String(error) });
    }
});

router.post('/:moduleId', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const { content, images } = typedReq.body as { content?: string; images?: string[] };
        if (!content && (!images || images.length === 0)) {
            typedRes.status(400).json({ success: false, message: 'Message must have content or images' });
            return;
        }

        const { data, error } = await supabase
            .from('module_discussions')
            .insert({ module_id: typedReq.params.moduleId, user_id: typedReq.user.userId, content: content || null, images: images || [], created_at: new Date().toISOString() })
            .select(selectWithUser)
            .single();

        if (error) throw error;
        typedRes.json({ success: true, message: 'Message sent successfully', data: transformMessage(data as unknown as MessageData) });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to send message', error: String(error) });
    }
});

router.delete('/:moduleId/:messageId', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const moduleId = typedReq.params.moduleId;
        const messageId = typedReq.params.messageId;
        const { data: message, error: fetchError } = await supabase.from('module_discussions').select('user_id').eq('id', messageId).eq('module_id', moduleId).single();

        if (fetchError || !message) {
            typedRes.status(404).json({ success: false, message: 'Message not found' });
            return;
        }
        if (message.user_id !== typedReq.user.userId) {
            typedRes.status(403).json({ success: false, message: 'You can only delete your own messages' });
            return;
        }

        const { error } = await supabase.from('module_discussions').delete().eq('id', messageId);
        if (error) throw error;

        typedRes.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to delete message', error: String(error) });
    }
});

export default router;
