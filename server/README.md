# Techroot Backend API

Backend API for Techroot learning platform, built with Express.js and deployed on Vercel.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Deployment**: Vercel Serverless

## API Endpoints

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/`                     | API info                       |
| GET    | `/health`               | Health check & Supabase status |
| POST   | `/api/auth/register`    | User registration              |
| POST   | `/api/auth/login`       | User login                     |
| GET    | `/api/auth/me`          | Get current user               |
| GET    | `/api/progress`         | Get user progress              |
| POST   | `/api/progress/lesson`  | Complete a lesson              |
| POST   | `/api/progress/module`  | Complete a module              |
| PUT    | `/api/progress/current` | Update current position        |
| POST   | `/api/progress/sync`    | Sync all progress              |

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your frontend URL)
4. Deploy!

## Project Structure

```
server/
├── api/
│   └── index.ts        # Vercel serverless entry point
├── src/
│   ├── config/
│   │   └── database.ts # Environment config
│   ├── lib/
│   │   └── supabase.ts # Supabase client
│   ├── routes/
│   │   ├── auth.route.ts
│   │   ├── health.route.ts
│   │   └── progress.route.ts
│   ├── app.ts          # Express app setup
│   └── server.ts       # Local dev server
├── supabase/
│   └── migrations/     # SQL migrations
├── vercel.json         # Vercel config
└── package.json
```
