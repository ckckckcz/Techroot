import { Router, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: Router = Router();

const transformMessage = (msg: any) => ({
    id: msg.id,
    module_id: msg.module_id,
    sender: { id: msg.users?.id, name: msg.users?.name, avatar: msg.users?.avatar },
    content: msg.content,
    images: msg.images || [],
    timestamp: msg.created_at
});

const selectWithUser = `id, module_id, user_id, content, images, created_at, users!module_discussions_user_id_fkey (id, name, avatar)`;

router.get('/:moduleId', async (req, res: Response) => {
    try {
        const { data: messages, error } = await supabase
            .from('module_discussions')
            .select(selectWithUser)
            .eq('module_id', req.params.moduleId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data: messages?.map(transformMessage) || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get discussions', error: String(error) });
    }
});

router.post('/:moduleId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { content, images } = req.body;
        if (!content && (!images || images.length === 0)) {
            return res.status(400).json({ success: false, message: 'Message must have content or images' });
        }

        const { data, error } = await supabase
            .from('module_discussions')
            .insert({ module_id: req.params.moduleId, user_id: req.user!.userId, content: content || null, images: images || [], created_at: new Date().toISOString() })
            .select(selectWithUser)
            .single();

        if (error) throw error;
        res.json({ success: true, message: 'Message sent successfully', data: transformMessage(data) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send message', error: String(error) });
    }
});

router.delete('/:moduleId/:messageId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { moduleId, messageId } = req.params;
        const { data: message, error: fetchError } = await supabase.from('module_discussions').select('user_id').eq('id', messageId).eq('module_id', moduleId).single();

        if (fetchError || !message) return res.status(404).json({ success: false, message: 'Message not found' });
        if (message.user_id !== req.user!.userId) return res.status(403).json({ success: false, message: 'You can only delete your own messages' });

        const { error } = await supabase.from('module_discussions').delete().eq('id', messageId);
        if (error) throw error;

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete message', error: String(error) });
    }
});

export default router;
