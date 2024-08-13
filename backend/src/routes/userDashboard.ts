import express from 'express';
import { db } from '../db';
import { submissions, problems } from '../models/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userSubmissions = await db
            .select({
                submissionId: submissions.id,
                problemId: problems.id,
                problemTitle: problems.title,
                status: submissions.status,
                createdAt: submissions.createdAt,
                language: submissions.language,
            })
            .from(submissions)
            .innerJoin(problems, eq(submissions.problemId, problems.id))
            .where(eq(submissions.userId, userId))
            .orderBy(submissions.createdAt);

        res.json(userSubmissions);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch user dashboard data' });
    }
});

export default router;

// Add this to your app.ts:
// import userDashboardRoutes from './routes/userDashboard';
// app.use('/api/user', userDashboardRoutes);