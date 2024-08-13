import express from 'express';
import { db } from '../db';
import { users, problems } from '../models/schema';
import { seed } from '../models/seed';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const router = express.Router();

const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, role: string };
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    } catch (error: any) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/', async (req, res) => {
    try {
        await seed(db)
        res.status(201).json({ "success": "seeded the database" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// router.put('/users/:id/role', adminAuth, async (req, res) => {
//     const { id } = req.params;
//     const { role } = req.body;

//     try {
//         const [updatedUser] = await db.update(users)
//             .set({ role, updatedAt: new Date() })
//             .where(eq(users.id, parseInt(id)))
//             .returning();
//         res.json(updatedUser);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/problems', adminAuth, async (req, res) => {
//     const { title, description, difficulty, creatorId, testCases } = req.body;

//     try {
//         const [newProblem] = await db.insert(problems)
//             .values({ title, description, difficulty, creatorId })
//             .returning();

//         // Insert test cases
//         await db.insert(testCases).values(
//             testCases.map((tc: any) => ({ ...tc, problemId: newProblem.id }))
//         );

//         res.status(201).json(newProblem);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/problems', adminAuth, async (req, res) => {
//     const { title, description, difficulty, creatorId, testCases } = req.body;

//     try {
//         const [newProblem] = await db.insert(problems)
//             .values({ title, description, difficulty, creatorId })
//             .returning();

//         // Insert test cases
//         await db.insert(testCases).values(
//             testCases.map((tc: any) => ({ ...tc, problemId: newProblem.id }))
//         );

//         res.status(201).json(newProblem);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

export default router;