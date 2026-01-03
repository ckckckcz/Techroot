import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { env } from '../config/database';

const router = Router();

// Untuk JWT secret, tambahkan ke .env nanti
const JWT_SECRET = process.env.JWT_SECRET || 'techroot-secret-key-change-in-production';

// ===================== REGISTER =====================
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, institution } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password wajib diisi'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal 6 karakter'
            });
        }

        // Cek apakah email sudah terdaftar
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user baru
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password_hash: passwordHash,
                institution: institution || null,
                xp: 0,
                streak: 1,
                last_active_date: new Date().toISOString().split('T')[0]
            })
            .select('id, name, email, institution, avatar, xp, streak')
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({
                success: false,
                message: 'Gagal mendaftarkan user',
                error: insertError.message
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Pendaftaran berhasil',
            data: {
                user: newUser,
                token
            }
        });

    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
});

// ===================== LOGIN =====================
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }

        // Cari user berdasarkan email
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('id, name, email, password_hash, institution, avatar, xp, streak')
            .eq('email', email)
            .single();

        if (findError || !user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Update last_active_date dan streak
        const today = new Date().toISOString().split('T')[0];
        await supabase
            .from('users')
            .update({ last_active_date: today })
            .eq('id', user.id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Hapus password_hash dari response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
});

// ===================== GET CURRENT USER (Protected) =====================
router.get('/me', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan'
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, institution, avatar, xp, streak, last_active_date')
                .eq('id', decoded.userId)
                .single();

            if (error || !user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: { user }
            });

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

    } catch (error: any) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
});

export default router;
