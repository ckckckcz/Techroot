import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health.route';
import authRoute from './routes/auth.route';
import progressRoute from './routes/progress.route';
import aiRoute from './routes/ai.route';
import discussionRoute from './routes/discussion.route';

export const app = express();

app.use(cors({ origin: true, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'] }));
app.use(express.json());

app.use('/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/progress', progressRoute);
app.use('/api/ai', aiRoute);
app.use('/api/discussions', discussionRoute);

app.get('/', (_req, res) => res.json({ message: 'Welcome to Techroot API', version: '1.0.0', docs: '/health' }));
