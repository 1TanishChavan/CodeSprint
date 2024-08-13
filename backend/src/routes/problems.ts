import express from 'express';
import { db } from '../db';
import { problems, testCases } from '../models/schema';
import { eq, and, sql } from 'drizzle-orm';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

async function searchProblems(query: string) {
    return db.select()
        .from(problems)
        .where(sql`to_tsvector('english', ${problems.title} || ' ' || ${problems.description}) @@ to_tsquery('english', ${query})`)
        .limit(20);
}

router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (typeof q !== 'string') {
        return res.status(400).json({ error: 'Invalid search query' });
    }
    try {
        const results = await searchProblems(q);
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

// Get all problems
router.get('/', async (req, res) => {
    try {
        const allProblems = await db.select().from(problems);
        res.json(allProblems);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Get a specific problem
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.select().from(problems).where(eq(problems.id, parseInt(id))).limit(1);
        if (problem.length === 0) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        const publicTestCases = await db.select().from(testCases).where(
            and(
                eq(testCases.problemId, parseInt(id)),
                eq(testCases.isPublic, true)
            )
        );
        res.json({ ...problem[0], publicTestCases });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch problem' });
    }
});

// Create a new problem (only for creators and admins)
router.post('/', authenticateToken, authorizeRole(['creator', 'admin']), async (req, res) => {
    const { title, description, difficulty, testCases } = req.body;
    const creatorId = req.user?.userId;

    try {
        const [newProblem] = await db.insert(problems).values({ title, description, difficulty, creatorId }).returning();

        const testCasesWithProblemId = testCases.map((tc: any) => ({ ...tc, problemId: newProblem.id }));
        await db.insert(testCases).values(testCasesWithProblemId);

        res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create problem' });
    }
});

// Update a problem (only for creators and admins)
router.put('/:id', authenticateToken, authorizeRole(['creator', 'admin']), async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty } = req.body;

    try {
        const [updatedProblem] = await db.update(problems)
            .set({ title, description, difficulty, updatedAt: new Date() })
            .where(eq(problems.id, parseInt(id)))
            .returning();

        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json({ message: 'Problem updated successfully', problem: updatedProblem });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update problem' });
    }
});

// Delete a problem (only for admins)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // First, delete associated test cases
        await db.delete(testCases).where(eq(testCases.problemId, parseInt(id)));

        // Then, delete the problem
        const [deletedProblem] = await db.delete(problems)
            .where(eq(problems.id, parseInt(id)))
            .returning();

        if (!deletedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json({ message: 'Problem deleted successfully', problem: deletedProblem });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete problem' });
    }
});

export default router;