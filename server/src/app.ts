import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health.route';
import authRoute from './routes/auth.route';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Techroot API',
        version: '1.0.0',
        docs: '/health'
    });
});

