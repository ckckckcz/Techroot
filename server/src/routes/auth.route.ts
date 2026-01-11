import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: Router = Router();
const today = () => new Date().toISOString().split('T')[0];

// GitHub OAuth helper functions
const getGitHubAccessToken = async (code: string): Promise<string | null> => {
    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: env.githubClientId,
                client_secret: env.githubClientSecret,
                code,
            }),
        });
        const data = await response.json();
        return data.access_token || null;
    } catch {
        return null;
    }
};

interface GitHubUser {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
}

const getGitHubUser = async (accessToken: string): Promise<GitHubUser | null> => {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
};

const getGitHubUserEmail = async (accessToken: string): Promise<string | null> => {
    try {
        const response = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        if (!response.ok) return null;
        const emails = await response.json();
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        return primaryEmail?.email || emails[0]?.email || null;
    } catch {
        return null;
    }
};

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
            .insert({ name, email, password_hash: passwordHash, institution: institution || null, xp: 0, streak: 1, last_active_date: today(), auth_provider: 'email' })
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

        const { data: user, error } = await supabase.from('users').select('id, name, email, password_hash, institution, avatar, xp, streak, auth_provider').eq('email', email).single();
        if (error || !user) return res.status(401).json({ success: false, message: 'Email atau password salah' });

        // Check if user registered via OAuth
        if (user.auth_provider === 'github' && !user.password_hash) {
            return res.status(400).json({ success: false, message: 'Akun ini terdaftar via GitHub. Silakan login dengan GitHub.' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ success: false, message: 'Email atau password salah' });

        await supabase.from('users').update({ last_active_date: today() }).eq('id', user.id);

        const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
        const { password_hash, auth_provider, ...userWithoutPassword } = user;

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

router.put('/update', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { name, institution, avatar } = req.body;
        const userId = req.user!.userId;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (institution !== undefined) updateData.institution = institution;
        if (avatar) updateData.avatar = avatar;

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select('id, name, email, institution, avatar, xp, streak')
            .single();

        if (error) return res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: error.message });

        res.json({ success: true, message: 'Profil berhasil diperbarui', data: { user: updatedUser } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

// ==================== GITHUB OAUTH ENDPOINTS ====================

// Initiate GitHub OAuth - returns the GitHub authorization URL
router.get('/github', (_req, res: Response) => {
    if (!env.githubClientId) {
        return res.status(503).json({ success: false, message: 'GitHub OAuth tidak dikonfigurasi' });
    }

    const params = new URLSearchParams({
        client_id: env.githubClientId,
        redirect_uri: `${env.frontendUrl}/auth/github/callback`,
        scope: 'user:email read:user',
        state: Math.random().toString(36).substring(7), // Simple state for CSRF protection
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.json({ success: true, data: { url: githubAuthUrl } });
});

// Handle GitHub OAuth callback
router.post('/github/callback', async (req, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Authorization code diperlukan' });
        }

        if (!env.githubClientId || !env.githubClientSecret) {
            return res.status(503).json({ success: false, message: 'GitHub OAuth tidak dikonfigurasi' });
        }

        // Exchange code for access token
        const accessToken = await getGitHubAccessToken(code);
        if (!accessToken) {
            return res.status(400).json({ success: false, message: 'Gagal mendapatkan access token dari GitHub' });
        }

        // Get GitHub user info
        const githubUser = await getGitHubUser(accessToken);
        if (!githubUser) {
            return res.status(400).json({ success: false, message: 'Gagal mendapatkan data user dari GitHub' });
        }

        // Get email (might need separate API call if not public)
        let email = githubUser.email;
        if (!email) {
            email = await getGitHubUserEmail(accessToken);
        }
        if (!email) {
            return res.status(400).json({ success: false, message: 'Tidak dapat mengakses email GitHub. Pastikan email Anda public atau berikan akses.' });
        }

        const githubId = String(githubUser.id);
        const name = githubUser.name || githubUser.login;
        const avatar = githubUser.avatar_url;
        const githubUsername = githubUser.login;

        // Check if user exists by GitHub ID
        let { data: existingUser } = await supabase
            .from('users')
            .select('id, name, email, institution, avatar, xp, streak, github_id')
            .eq('github_id', githubId)
            .single();

        if (existingUser) {
            // User exists with this GitHub ID - login
            await supabase.from('users').update({
                last_active_date: today(),
                avatar: avatar, // Update avatar in case it changed
                github_username: githubUsername
            }).eq('id', existingUser.id);

            const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, env.jwtSecret, { expiresIn: '7d' });
            return res.json({
                success: true,
                message: 'Login berhasil via GitHub',
                data: { user: existingUser, token, isNewUser: false }
            });
        }

        // Check if user exists by email
        const { data: userByEmail } = await supabase
            .from('users')
            .select('id, name, email, institution, avatar, xp, streak, auth_provider, github_id')
            .eq('email', email)
            .single();

        if (userByEmail) {
            // User exists with this email
            if (userByEmail.github_id) {
                // Already linked to different GitHub account
                return res.status(400).json({ success: false, message: 'Email ini sudah terhubung dengan akun GitHub lain' });
            }

            // Link GitHub to existing email account
            const { data: updatedUser, error } = await supabase
                .from('users')
                .update({
                    github_id: githubId,
                    github_username: githubUsername,
                    avatar: avatar || userByEmail.avatar,
                    last_active_date: today()
                })
                .eq('id', userByEmail.id)
                .select('id, name, email, institution, avatar, xp, streak')
                .single();

            if (error) {
                return res.status(500).json({ success: false, message: 'Gagal menghubungkan akun GitHub' });
            }

            const token = jwt.sign({ userId: updatedUser!.id, email: updatedUser!.email }, env.jwtSecret, { expiresIn: '7d' });
            return res.json({
                success: true,
                message: 'Akun GitHub berhasil dihubungkan',
                data: { user: updatedUser, token, isNewUser: false }
            });
        }

        // Create new user with GitHub
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                github_id: githubId,
                github_username: githubUsername,
                avatar,
                xp: 0,
                streak: 1,
                last_active_date: today(),
                auth_provider: 'github'
            })
            .select('id, name, email, institution, avatar, xp, streak')
            .single();

        if (error) {
            return res.status(500).json({ success: false, message: 'Gagal mendaftarkan user via GitHub', error: error.message });
        }

        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, env.jwtSecret, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'Pendaftaran via GitHub berhasil',
            data: { user: newUser, token, isNewUser: true }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
    }
});

export default router;
