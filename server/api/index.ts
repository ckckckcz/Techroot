import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

// Import routes
import healthRoute from '../src/routes/health.route';
import authRoute from '../src/routes/auth.route';
import progressRoute from '../src/routes/progress.route';

const app: Application = express();

// CORS Configuration - Allow all origins for development
const corsOptions = {
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/progress', progressRoute);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Techroot API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            progress: '/api/progress'
        }
    });
});

// Export for Vercel serverless
export default app;
