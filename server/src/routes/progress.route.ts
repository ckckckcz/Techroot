import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

const router = Router();

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

// GET /api/progress - Get user's learning progress
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        console.log('Getting progress for user:', userId);

        // Get progress from user_progress table
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        // If no progress exists, create initial progress
        if (progressError && progressError.code === 'PGRST116') {
            console.log('No progress found for user, returning empty progress');
            return res.json({
                success: true,
                data: {
                    completed_lessons: [],
                    completed_modules: [],
                    current_path: null,
                    current_module: null,
                    current_lesson: null,
                    xp: 0,
                    streak: 0,
                    badges: []
                }
            });
        }

        if (progressError) {
            console.error('Progress fetch error:', progressError);
            throw progressError;
        }

        // Get user's XP and streak from users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('xp, streak, last_active_date')
            .eq('id', userId)
            .single();

        if (userError) {
            console.error('User data fetch error:', userError);
        }

        // Get user's badges (skip if table doesn't exist)
        let badgesData: any[] = [];
        try {
            const { data: badges } = await supabase
                .from('user_badges')
                .select('badge_id, badge_name, earned_at')
                .eq('user_id', userId);
            badgesData = badges || [];
        } catch (e) {
            console.log('Badges table might not exist, skipping');
        }

        res.json({
            success: true,
            data: {
                completed_lessons: progressData?.completed_lessons || [],
                completed_modules: progressData?.completed_modules || [],
                current_path: progressData?.current_path,
                current_module: progressData?.current_module,
                current_lesson: progressData?.current_lesson,
                xp: userData?.xp || 0,
                streak: userData?.streak || 0,
                last_active_date: userData?.last_active_date,
                badges: badgesData,
            }
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ success: false, message: 'Failed to get progress', error: String(error) });
    }
});

// POST /api/progress/lesson - Mark a lesson as completed
router.post('/lesson', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { lesson_key, xp_reward } = req.body;

        console.log('Completing lesson:', { userId, lesson_key, xp_reward });

        if (!lesson_key) {
            return res.status(400).json({ success: false, message: 'lesson_key is required' });
        }

        // Get current progress or create new one
        const { data: currentProgress, error: getError } = await supabase
            .from('user_progress')
            .select('id, completed_lessons')
            .eq('user_id', userId)
            .single();

        let completedLessons: string[] = [];
        let shouldInsert = false;

        if (getError) {
            if (getError.code === 'PGRST116') {
                // No record exists, will insert new one
                shouldInsert = true;
                console.log('No existing progress, will create new record');
            } else {
                console.error('Error fetching progress:', getError);
                throw getError;
            }
        } else if (currentProgress) {
            completedLessons = currentProgress.completed_lessons || [];
        }

        // Add lesson if not already completed
        if (!completedLessons.includes(lesson_key)) {
            completedLessons.push(lesson_key);

            if (shouldInsert) {
                // Insert new progress record
                const { data: insertData, error: insertError } = await supabase
                    .from('user_progress')
                    .insert({
                        user_id: userId,
                        completed_lessons: completedLessons,
                        completed_modules: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Insert progress error:', insertError);
                    throw insertError;
                }
                console.log('Created new progress record:', insertData?.id);
            } else {
                // Update existing progress
                const { error: updateError } = await supabase
                    .from('user_progress')
                    .update({
                        completed_lessons: completedLessons,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', userId);

                if (updateError) {
                    console.error('Update progress error:', updateError);
                    throw updateError;
                }
                console.log('Updated progress with completed lesson');
            }

            // Update user's XP if reward provided
            if (xp_reward && xp_reward > 0) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('xp')
                    .eq('id', userId)
                    .single();

                const newXP = (userData?.xp || 0) + xp_reward;
                const { error: xpError } = await supabase
                    .from('users')
                    .update({ xp: newXP })
                    .eq('id', userId);

                if (xpError) {
                    console.error('XP update error:', xpError);
                } else {
                    console.log('Updated XP to:', newXP);
                }
            }

            res.json({
                success: true,
                message: 'Lesson completed',
                data: { completed_lessons: completedLessons, xp_added: xp_reward || 0 }
            });
        } else {
            res.json({
                success: true,
                message: 'Lesson already completed',
                data: { completed_lessons: completedLessons, xp_added: 0 }
            });
        }
    } catch (error) {
        console.error('Complete lesson error:', error);
        res.status(500).json({ success: false, message: 'Failed to complete lesson', error: String(error) });
    }
});

// POST /api/progress/module - Mark a module as completed
router.post('/module', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { module_key, xp_reward } = req.body;

        console.log('Completing module:', { userId, module_key, xp_reward });

        if (!module_key) {
            return res.status(400).json({ success: false, message: 'module_key is required' });
        }

        // Get current progress
        const { data: currentProgress, error: getError } = await supabase
            .from('user_progress')
            .select('id, completed_modules')
            .eq('user_id', userId)
            .single();

        let completedModules: string[] = [];
        let shouldInsert = false;

        if (getError) {
            if (getError.code === 'PGRST116') {
                shouldInsert = true;
            } else {
                throw getError;
            }
        } else if (currentProgress) {
            completedModules = currentProgress.completed_modules || [];
        }

        // Add module if not already completed
        if (!completedModules.includes(module_key)) {
            completedModules.push(module_key);

            if (shouldInsert) {
                const { error: insertError } = await supabase
                    .from('user_progress')
                    .insert({
                        user_id: userId,
                        completed_lessons: [],
                        completed_modules: completedModules,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });

                if (insertError) throw insertError;
            } else {
                const { error: updateError } = await supabase
                    .from('user_progress')
                    .update({
                        completed_modules: completedModules,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', userId);

                if (updateError) throw updateError;
            }

            // Update XP
            if (xp_reward && xp_reward > 0) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('xp')
                    .eq('id', userId)
                    .single();

                await supabase
                    .from('users')
                    .update({ xp: (userData?.xp || 0) + xp_reward })
                    .eq('id', userId);
            }

            res.json({
                success: true,
                message: 'Module completed',
                data: { completed_modules: completedModules, xp_added: xp_reward || 0 }
            });
        } else {
            res.json({
                success: true,
                message: 'Module already completed',
                data: { completed_modules: completedModules, xp_added: 0 }
            });
        }
    } catch (error) {
        console.error('Complete module error:', error);
        res.status(500).json({ success: false, message: 'Failed to complete module', error: String(error) });
    }
});

// PUT /api/progress/current - Update current learning position
router.put('/current', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { current_path, current_module, current_lesson } = req.body;

        console.log('Updating current position:', { userId, current_path, current_module, current_lesson });

        // Check if progress exists
        const { data: existingProgress, error: checkError } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (checkError && checkError.code === 'PGRST116') {
            // Insert new record
            const { data, error } = await supabase
                .from('user_progress')
                .insert({
                    user_id: userId,
                    completed_lessons: [],
                    completed_modules: [],
                    current_path: current_path || null,
                    current_module: current_module || null,
                    current_lesson: current_lesson || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;

            return res.json({
                success: true,
                message: 'Current position created',
                data
            });
        }

        // Update existing record
        const { data, error } = await supabase
            .from('user_progress')
            .update({
                current_path: current_path || null,
                current_module: current_module || null,
                current_lesson: current_lesson || null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Current position updated',
            data
        });
    } catch (error) {
        console.error('Update current position error:', error);
        res.status(500).json({ success: false, message: 'Failed to update current position', error: String(error) });
    }
});

// POST /api/progress/sync - Sync all progress data
router.post('/sync', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const {
            completed_lessons,
            completed_modules,
            current_path,
            current_module,
            current_lesson,
            xp,
            streak
        } = req.body;

        console.log('Syncing progress for user:', userId);

        // Update user's XP and streak
        if (xp !== undefined || streak !== undefined) {
            const updateData: any = {
                last_active_date: new Date().toISOString().split('T')[0]
            };
            if (xp !== undefined) updateData.xp = xp;
            if (streak !== undefined) updateData.streak = streak;

            await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId);
        }

        // Check if progress exists
        const { data: existingProgress, error: checkError } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .single();

        let data;
        if (checkError && checkError.code === 'PGRST116') {
            // Insert new
            const { data: insertData, error: insertError } = await supabase
                .from('user_progress')
                .insert({
                    user_id: userId,
                    completed_lessons: completed_lessons || [],
                    completed_modules: completed_modules || [],
                    current_path: current_path || null,
                    current_module: current_module || null,
                    current_lesson: current_lesson || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (insertError) throw insertError;
            data = insertData;
        } else {
            // Update existing
            const { data: updateData, error: updateError } = await supabase
                .from('user_progress')
                .update({
                    completed_lessons: completed_lessons || [],
                    completed_modules: completed_modules || [],
                    current_path: current_path || null,
                    current_module: current_module || null,
                    current_lesson: current_lesson || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError) throw updateError;
            data = updateData;
        }

        res.json({
            success: true,
            message: 'Progress synced successfully',
            data
        });
    } catch (error) {
        console.error('Sync progress error:', error);
        res.status(500).json({ success: false, message: 'Failed to sync progress', error: String(error) });
    }
});

export default router;
