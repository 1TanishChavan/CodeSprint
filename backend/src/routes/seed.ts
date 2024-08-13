import express from 'express';
import { seeding } from '../seed';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const a = await seeding().catch((err) => {
            console.error('An error occurred:', err);
        });
        if (a) {
            res.status(201).json({ "success": "seeded the database" });
        } else {
            res.status(500).json({ "unsuccess": "didn't seeded the database" });
        }
    } catch (error: any) {
        console.log("werwerwe")
    }
});

export default router;