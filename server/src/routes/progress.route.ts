import express, { Router } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import type { ExpressResponse } from '../types/express.d';

const router: Router = express.Router();
const now = () => new Date().toISOString();
const today = () => now().split('T')[0];

const upsertProgress = async (userId: string, data: Record<string, unknown>, isInsert: boolean) => {
    const timestamp = { updated_at: now(), ...(isInsert && { created_at: now() }) };
    return isInsert
        ? supabase.from('user_progress').insert({ user_id: userId, completed_lessons: [], completed_modules: [], ...data, ...timestamp }).select().single()
        : supabase.from('user_progress').update({ ...data, ...timestamp }).eq('user_id', userId).select().single();
};

const getProgress = async (userId: string) => {
    const { data, error } = await supabase.from('user_progress').select('*').eq('user_id', userId).single();
    return { data, notFound: error?.code === 'PGRST116', error };
};

const updateXP = async (userId: string, amount: number) => {
    if (amount <= 0) return;
    const { data } = await supabase.from('users').select('xp').eq('id', userId).single();
    await supabase.from('users').update({ xp: (data?.xp || 0) + amount }).eq('id', userId);
};

router.get('/', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const userId = typedReq.user.userId;
        const { data: progress, notFound, error } = await getProgress(userId);

        if (notFound) {
            typedRes.json({ success: true, data: { completed_lessons: [], completed_modules: [], current_path: null, current_module: null, current_lesson: null, xp: 0, streak: 0, badges: [] } });
            return;
        }
        if (error) throw error;

        const { data: user } = await supabase.from('users').select('xp, streak, last_active_date').eq('id', userId).single();

        let badgesData: unknown[] = [];
        try {
            const { data: badges } = await supabase.from('user_badges').select('badge_id, badge_name, earned_at').eq('user_id', userId);
            badgesData = badges || [];
        } catch { /* badges table might not exist */ }

        typedRes.json({
            success: true,
            data: {
                completed_lessons: progress?.completed_lessons || [],
                completed_modules: progress?.completed_modules || [],
                current_path: progress?.current_path,
                current_module: progress?.current_module,
                current_lesson: progress?.current_lesson,
                xp: user?.xp || 0,
                streak: user?.streak || 0,
                last_active_date: user?.last_active_date,
                badges: badgesData
            }
        });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to get progress', error: String(error) });
    }
});

router.post('/lesson', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const userId = typedReq.user.userId;
        const { lesson_key, xp_reward } = typedReq.body as { lesson_key?: string; xp_reward?: number };

        if (!lesson_key) {
            typedRes.status(400).json({ success: false, message: 'lesson_key is required' });
            return;
        }

        const { data: progress, notFound } = await getProgress(userId);
        const completedLessons: string[] = (progress?.completed_lessons as string[]) || [];

        if (completedLessons.includes(lesson_key)) {
            typedRes.json({ success: true, message: 'Lesson already completed', data: { completed_lessons: completedLessons, xp_added: 0 } });
            return;
        }

        completedLessons.push(lesson_key);
        await upsertProgress(userId, { completed_lessons: completedLessons }, notFound);
        await updateXP(userId, xp_reward || 0);

        typedRes.json({ success: true, message: 'Lesson completed', data: { completed_lessons: completedLessons, xp_added: xp_reward || 0 } });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to complete lesson', error: String(error) });
    }
});

router.post('/module', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const userId = typedReq.user.userId;
        const { module_key, xp_reward } = typedReq.body as { module_key?: string; xp_reward?: number };

        if (!module_key) {
            typedRes.status(400).json({ success: false, message: 'module_key is required' });
            return;
        }

        const { data: progress, notFound } = await getProgress(userId);
        const completedModules: string[] = (progress?.completed_modules as string[]) || [];

        if (completedModules.includes(module_key)) {
            typedRes.json({ success: true, message: 'Module already completed', data: { completed_modules: completedModules, xp_added: 0 } });
            return;
        }

        completedModules.push(module_key);
        await upsertProgress(userId, { completed_modules: completedModules }, notFound);
        await updateXP(userId, xp_reward || 0);

        typedRes.json({ success: true, message: 'Module completed', data: { completed_modules: completedModules, xp_added: xp_reward || 0 } });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to complete module', error: String(error) });
    }
});

router.put('/current', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const userId = typedReq.user.userId;
        const { current_path, current_module, current_lesson } = typedReq.body as { current_path?: string; current_module?: string; current_lesson?: string };
        const { notFound } = await getProgress(userId);

        const { data, error } = await upsertProgress(userId, { current_path: current_path || null, current_module: current_module || null, current_lesson: current_lesson || null }, notFound);
        if (error) throw error;

        typedRes.json({ success: true, message: notFound ? 'Current position created' : 'Current position updated', data });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to update current position', error: String(error) });
    }
});

router.post('/sync', authenticateToken as express.RequestHandler, async (req, res): Promise<void> => {
    const typedReq = req as unknown as AuthRequest;
    const typedRes = res as unknown as ExpressResponse;
    try {
        const userId = typedReq.user.userId;
        const { completed_lessons, completed_modules, current_path, current_module, current_lesson, xp, streak } = typedReq.body as {
            completed_lessons?: string[];
            completed_modules?: string[];
            current_path?: string;
            current_module?: string;
            current_lesson?: string;
            xp?: number;
            streak?: number;
        };

        if (xp !== undefined || streak !== undefined) {
            const updateData: Record<string, unknown> = { last_active_date: today() };
            if (xp !== undefined) updateData.xp = xp;
            if (streak !== undefined) updateData.streak = streak;
            await supabase.from('users').update(updateData).eq('id', userId);
        }

        const { notFound } = await getProgress(userId);
        const { data, error } = await upsertProgress(userId, {
            completed_lessons: completed_lessons || [],
            completed_modules: completed_modules || [],
            current_path: current_path || null,
            current_module: current_module || null,
            current_lesson: current_lesson || null
        }, notFound);

        if (error) throw error;
        typedRes.json({ success: true, message: 'Progress synced successfully', data });
    } catch (error) {
        typedRes.status(500).json({ success: false, message: 'Failed to sync progress', error: String(error) });
    }
});

export default router;
