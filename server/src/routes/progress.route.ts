import { Router, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: Router = Router();
const now = () => new Date().toISOString();
const today = () => now().split('T')[0];

const upsertProgress = async (userId: string, data: Record<string, any>, isInsert: boolean) => {
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

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { data: progress, notFound, error } = await getProgress(userId);

        if (notFound) return res.json({ success: true, data: { completed_lessons: [], completed_modules: [], current_path: null, current_module: null, current_lesson: null, xp: 0, streak: 0, badges: [] } });
        if (error) throw error;

        const { data: user } = await supabase.from('users').select('xp, streak, last_active_date').eq('id', userId).single();

        let badgesData: any[] = [];
        try {
            const { data: badges } = await supabase.from('user_badges').select('badge_id, badge_name, earned_at').eq('user_id', userId);
            badgesData = badges || [];
        } catch { /* badges table might not exist */ }

        res.json({
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
        res.status(500).json({ success: false, message: 'Failed to get progress', error: String(error) });
    }
});

router.post('/lesson', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { lesson_key, xp_reward } = req.body;

        if (!lesson_key) return res.status(400).json({ success: false, message: 'lesson_key is required' });

        const { data: progress, notFound } = await getProgress(userId);
        const completedLessons: string[] = progress?.completed_lessons || [];

        if (completedLessons.includes(lesson_key)) {
            return res.json({ success: true, message: 'Lesson already completed', data: { completed_lessons: completedLessons, xp_added: 0 } });
        }

        completedLessons.push(lesson_key);
        await upsertProgress(userId, { completed_lessons: completedLessons }, notFound);
        await updateXP(userId, xp_reward || 0);

        res.json({ success: true, message: 'Lesson completed', data: { completed_lessons: completedLessons, xp_added: xp_reward || 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to complete lesson', error: String(error) });
    }
});

router.post('/module', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { module_key, xp_reward } = req.body;

        if (!module_key) return res.status(400).json({ success: false, message: 'module_key is required' });

        const { data: progress, notFound } = await getProgress(userId);
        const completedModules: string[] = progress?.completed_modules || [];

        if (completedModules.includes(module_key)) {
            return res.json({ success: true, message: 'Module already completed', data: { completed_modules: completedModules, xp_added: 0 } });
        }

        completedModules.push(module_key);
        await upsertProgress(userId, { completed_modules: completedModules }, notFound);
        await updateXP(userId, xp_reward || 0);

        res.json({ success: true, message: 'Module completed', data: { completed_modules: completedModules, xp_added: xp_reward || 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to complete module', error: String(error) });
    }
});

router.put('/current', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { current_path, current_module, current_lesson } = req.body;
        const { notFound } = await getProgress(userId);

        const { data, error } = await upsertProgress(userId, { current_path: current_path || null, current_module: current_module || null, current_lesson: current_lesson || null }, notFound);
        if (error) throw error;

        res.json({ success: true, message: notFound ? 'Current position created' : 'Current position updated', data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update current position', error: String(error) });
    }
});

router.post('/sync', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { completed_lessons, completed_modules, current_path, current_module, current_lesson, xp, streak } = req.body;

        if (xp !== undefined || streak !== undefined) {
            const updateData: Record<string, any> = { last_active_date: today() };
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
        res.json({ success: true, message: 'Progress synced successfully', data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to sync progress', error: String(error) });
    }
});

export default router;
