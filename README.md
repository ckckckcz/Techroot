# <img src="./client/public/assets/logo.png" width="40" height="40" valign="middle"> Techroot: Empowering Your Code Roots with AI

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![GitHub OAuth](https://img.shields.io/badge/GitHub-OAuth-181717?style=for-the-badge&logo=github)](https://docs.github.com/en/apps/oauth-apps)

**Techroot** bukan sekadar platform belajar biasa. Ia adalah ekosistem pendidikan cerdas yang dirancang untuk menumbuhkan akar keahlian Anda di dunia teknologi dari dasar hingga mahir, didorong oleh kekuatan _Large Language Models_ (LLM) terkini.

---

## 🚀 Fitur Unggulan Terkini

### 🗺️ AI Roadmap Wizard

Lupakan kurikulum kaku yang sama untuk semua orang. Dengan **AI Roadmap Wizard**, Anda hanya perlu berdialog sebentar tentang mimpi Anda, dan AI kami akan meramu jalur belajar yang presisi, lengkap dengan estimasi waktu dan sumber daya terbaik.

### 🤖 Tanya Root (The AI Tutor)

Bingung dengan konsep _Recursion_? Error _Undefined is not a function_ bikin pening? **Tanya Root** adalah asisten yang selalu siaga di setiap halaman materi. Ia menggunakan konteks modul yang sedang Anda pelajari untuk memberikan bimbingan instan.

### 📊 Dynamic Mastery Dashboard

Visualisasi progres belajar yang sepenuhnya dinamis. Menampilkan **XP**, **Level**, **Streak**, serta jumlah modul dan pelajaran yang telah diselesaikan secara real-time dari database.

### 👤 Responsive Profile Management

Kelola identitas digital Anda dengan sistem profil yang cerdas:

- **Desktop**: Dialog modal yang elegan untuk pembaruan cepat.
- **Mobile/Tablet**: _Standard-compliant bottom sheet_ (drawer) untuk aksesibilitas maksimal.
- **Avatar Customization**: Integrasi dengan **DiceBear API (Thumbs collection)** untuk ribuan variasi karakter unik.

### 🔐 GitHub OAuth Integration

Login lebih cepat dan aman dengan integrasi **GitHub OAuth 2.0**:

- **One-Click Login**: Masuk atau daftar hanya dengan satu klik menggunakan akun GitHub.
- **Account Linking**: Akun email existing dapat dihubungkan dengan GitHub untuk kemudahan login.
- **Secure Flow**: Implementasi OAuth 2.0 standard dengan PKCE-ready architecture.
- **Auto Profile Sync**: Avatar dan nama dari GitHub otomatis tersinkronisasi.

---

## 🛠️ Arsitektur & Teknologi

Techroot dibangun dengan prinsip modernitas, performa tinggi, dan skalabilitas:

### 🎨 Frontend Ecosystem

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Engine**: [React 19](https://react.dev/) dengan _Concurrent Rendering_
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) untuk fleksibilitas desain premium.
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI) yang dikustomisasi penuh.

### ⚙️ Backend & Intelligence

- **Platform**: Node.js dengan [Express 5](https://expressjs.com/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **Authentication**: JWT + GitHub OAuth 2.0
- **AI Engines**: Deepseek R1, Google Gemma 3, Nvidia Nemotron.

---

## ⚡ Quick Start & Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/NaufalPratomo/Techroot.git
cd Techroot

# Install dependencies
cd client && pnpm install
cd ../server && pnpm install
```

### 2. Environment Variables

**Server (`server/.env`):**

```env
# Server
PORT=5000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# GitHub OAuth (Optional - untuk login via GitHub)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Client (`client/.env.local`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Setup GitHub OAuth (Opsional)

1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Klik **"New OAuth App"**
3. Isi form:
   - **Application name**: `Techroot`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Klik **"Register application"**
5. Copy **Client ID** dan generate **Client Secret**
6. Masukkan ke file `server/.env`

### 4. Database Migration

Jalankan migration di Supabase SQL Editor:

```sql
-- Jalankan file-file di folder server/supabase/migrations/ secara berurutan
-- 001_create_users_table.sql
-- 002_create_user_progress_table.sql
-- 003_create_module_discussions_table.sql
-- 004_add_github_oauth.sql
```

### 5. Run Development

```bash
# Terminal 1 - Server
cd server && pnpm run dev

# Terminal 2 - Client
cd client && pnpm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` 🚀

## 📂 Struktur Folder & Fungsi (Clean Architecture)

```bash
Techroot/
│
├── 📱 client/                          # Frontend Next.js Application
│   ├── src/
│   │   ├── app/                        # [Fungsi] Root Navigasi & Halaman Utama.
│   │   │   ├── profile/                # Menangani Profile Page & Edit Logic (Modal/Sheet).
│   │   │   ├── learn/                  # Antarmuka pembelajaran interaktif (Video/Materi).
│   │   │   └── roadmap/                # Alur pembuatan Roadmap otomatis berbasis AI.
│   │   ├── components/                 # [Fungsi] Reusable UI unit.
│   │   │   ├── layout/                 # Komponen struktur global (Header, Footer, Sidebar).
│   │   │   └── ui/                     # Komponen atomik (Buttons, Dialogs) dari Shadcn.
│   │   ├── context/                    # [Fungsi] Centralized State (UserContext).
│   │   │                               # Mengatur auth, XP, & progress di seluruh aplikasi.
│   │   ├── lib/                        # [Fungsi] Utilities & Service client (API, Supabase).
│   │   └── types/                      # [Fungsi] TypeScript Definitions (Antarmuka Kontrak Data).
│   └── next.config.ts                  # Konfigurasi Next.js (Image optimization, dll).
│
├── ⚙️ server/                          # Backend Express.js API
│   ├── src/
│   │   ├── routes/                     # [Fungsi] API Endpoints (Auth, AI, Progress).
│   │   ├── middleware/                 # [Fungsi] Security Layer (JWT & Rate Limiting).
│   │   └── lib/                        # [Fungsi] Database & External Service Connection.
│   └── server.ts                       # Entry Point API.
│
└── 📄 README.md                        # Project Documentation.
```

---

## 🔄 Alur Data Dinamis (Deep Dive)

Aplikasi Techroot bekerja dengan sinkronisasi data real-time antara Client dan server melalui beberapa mekanisme utama:

### 1. Siklus Autentikasi & Sesi

- **Email/Password Login**: Autentikasi tradisional dengan JWT token.
- **GitHub OAuth Flow**:
  1. User klik "Masuk dengan GitHub" → Client request ke `/api/auth/github`
  2. Server generate GitHub authorization URL → User redirect ke GitHub
  3. User authorize di GitHub → Redirect ke `/auth/github/callback?code=xxx`
  4. Client kirim code ke `/api/auth/github/callback`
  5. Server exchange code → access token → fetch user data dari GitHub API
  6. Server create/login user, return JWT token → User masuk ke dashboard
- **Account Linking**: User dengan email yang sama dapat menghubungkan akun GitHub untuk login alternatif.
- **Persistence**: JWT disimpan di localStorage dan divalidasi di setiap request.

### 2. Gamifikasi & Sinkronisasi Progress

- **Aksi Belajar**: Setiap kali user menyelesaikan kuis atau materi, Client mengirimkan request ke `/api/progress/lesson`.
- **Logic Server**: Server memvalidasi integritas data, menghitung XP, dan memperbarui tabel `user_progress` serta data `streak` di database.
- **Live UI Update**: Response sukses dari server akan memicu update `UserContext` secara instan, sehingga bar progres dan level di dashboard berubah tanpa perlu refresh halaman.

### 3. Ekosistem AI Tutoring (Tanya Root)

- **Konteks**: Client mengirimkan pertanyaan beserta context modul yang sedang dipelajari ke `/api/ai/chat`.
- **Proxying**: Server bertindak sebagai perantara (proxy) untuk menyuntikkan API Key secara aman sebelum diteruskan ke provider LLM (Deepseek/Google/Nvidia).
- **Hasil**: Jawaban dikembalikan sebagai streaming atau JSON terstruktur untuk ditampilkan langsung di UI asisten.

### 4. Manajemen UI Responsif (Adaptive Layout)

- **Decision Engine**: Aplikasi menggunakan hook `use-mobile` untuk mendeteksi ukuran layar secara real-time.
- **Switching**: Jika layar < 1024px (Mobile/Tablet), fitur Edit Profil akan dirender sebagai `Sheet` (Bottom Drawer). Jika > 1024px, fitur tersebut akan menggunakan `Dialog` (Modal Tengah). Ini memastikan UX yang native di setiap perangkat.

---

## 👥 Tim Kontributor

- **Riovaldo Alfiyan Fahmi Rahman** ([@ckckckcz](https://github.com/ckckckcz)) - _Lead Architect & Fullstack Developer_
- **Naufal Pratomo** ([@NaufalPratomo](https://github.com/NaufalPratomo)) - _Data Researcher_

---

## 📄 Lisensi

Techroot dilisensikan di bawah [MIT License](LICENSE). Mari membangun ekosistem edukasi yang lebih cerdas bersama-sama!

---

<p align="center">
  <b>Built with ❤️ at Techroot Dev Labs</b><br>
  <i>"Growing Great Developers from Strong Roots"</i>
</p>
