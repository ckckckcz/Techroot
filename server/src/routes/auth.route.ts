import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: Router = Router();
const today = () => new Date().toISOString().split('T')[0];

router.post('/register', async (req, res: Response) => {
    try {
        const { name, email, password, institution } = req.body;

        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
        if (password.length < 6) return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });

        const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
        if (existingUser) return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({ name, email, password_hash: passwordHash, institution: institution || null, xp: 0, streak: 1, last_active_date: today() })
            .select('id, name, email, institution, avatar, xp, streak')
            .single();

        if (error) return res.status(500).json({ success: false, message: 'Gagal mendaftarkan user', error: error.message });

        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, env.jwtSecret, { expiresIn: '7d' });
        res.status(201).json({ success: true, message: 'Pendaftaran berhasil', data: { user: newUser, token } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

router.post('/login', async (req, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });

        const { data: user, error } = await supabase.from('users').select('id, name, email, password_hash, institution, avatar, xp, streak').eq('email', email).single();
        if (error || !user) return res.status(401).json({ success: false, message: 'Email atau password salah' });

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ success: false, message: 'Email atau password salah' });

        await supabase.from('users').update({ last_active_date: today() }).eq('id', user.id);

        const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
        const { password_hash, ...userWithoutPassword } = user;

        res.json({ success: true, message: 'Login berhasil', data: { user: userWithoutPassword, token } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { data: user, error } = await supabase.from('users').select('id, name, email, institution, avatar, xp, streak, last_active_date').eq('id', req.user!.userId).single();

        if (error || !user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        res.json({ success: true, data: { user } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

export default router;
