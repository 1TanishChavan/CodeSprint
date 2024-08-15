import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import submissionRoutes from './routes/submissions';
import adminRoutes from './routes/admin';
import userDashboardRoutes from './routes/userDashboard';
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        message: "Working as expected🦄🌈✨👋🌎🌍🌏✨🌈🦄",
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userDashboardRoutes);

export default app;