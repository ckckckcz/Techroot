import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

const router: Router = Router();

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'techroot-secret-key-change-in-production', (err: any, user: any) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        (req as any).user = user;
        next();
    });
};

// GET /api/discussions/:moduleId - Get all messages for a module
router.get('/:moduleId', async (req: Request, res: Response) => {
    try {
        const { moduleId } = req.params;
        console.log('Getting discussions for module:', moduleId);

        // Get messages with user information
        const { data: messages, error } = await supabase
            .from('module_discussions')
            .select(`
                id,
                module_id,
                user_id,
                content,
                images,
                created_at,
                users!module_discussions_user_id_fkey (
                    id,
                    name,
                    avatar
                )
            `)
            .eq('module_id', moduleId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching discussions:', error);
            throw error;
        }

        // Transform the data to match frontend expectations
        const transformedMessages = messages?.map((msg: any) => ({
            id: msg.id,
            module_id: msg.module_id,
            sender: {
                id: msg.users.id,
                name: msg.users.name,
                avatar: msg.users.avatar
            },
            content: msg.content,
            images: msg.images || [],
            timestamp: msg.created_at
        })) || [];

        res.json({
            success: true,
            data: transformedMessages
        });
    } catch (error) {
        console.error('Get discussions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get discussions',
            error: String(error)
        });
    }
});

// POST /api/discussions/:moduleId - Send a new message
router.post('/:moduleId', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { moduleId } = req.params;
        const userId = (req as any).user.userId;
        const { content, images } = req.body;

        console.log('Creating new message:', { moduleId, userId, content, imagesCount: images?.length || 0 });

        // Validate - must have content or images
        if (!content && (!images || images.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Message must have content or images'
            });
        }

        // Insert message
        const { data: newMessage, error: insertError } = await supabase
            .from('module_discussions')
            .insert({
                module_id: moduleId,
                user_id: userId,
                content: content || null,
                images: images || [],
                created_at: new Date().toISOString()
            })
            .select(`
                id,
                module_id,
                user_id,
                content,
                images,
                created_at,
                users!module_discussions_user_id_fkey (
                    id,
                    name,
                    avatar
                )
            `)
            .single();

        if (insertError) {
            console.error('Error inserting message:', insertError);
            throw insertError;
        }

        // Transform response
        const userInfo = (newMessage as any).users;
        const transformedMessage = {
            id: newMessage.id,
            module_id: newMessage.module_id,
            sender: {
                id: userInfo?.id,
                name: userInfo?.name,
                avatar: userInfo?.avatar
            },
            content: newMessage.content,
            images: newMessage.images || [],
            timestamp: newMessage.created_at
        };

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: transformedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: String(error)
        });
    }
});

// DELETE /api/discussions/:moduleId/:messageId - Delete a message (only by owner)
router.delete('/:moduleId/:messageId', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { moduleId, messageId } = req.params;
        const userId = (req as any).user.userId;

        console.log('Deleting message:', { messageId, userId });

        // Check if message exists and belongs to user
        const { data: message, error: fetchError } = await supabase
            .from('module_discussions')
            .select('user_id')
            .eq('id', messageId)
            .eq('module_id', moduleId)
            .single();

        if (fetchError || !message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own messages'
            });
        }

        // Delete message
        const { error: deleteError } = await supabase
            .from('module_discussions')
            .delete()
            .eq('id', messageId);

        if (deleteError) {
            console.error('Error deleting message:', deleteError);
            throw deleteError;
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: String(error)
        });
    }
});

export default router;
