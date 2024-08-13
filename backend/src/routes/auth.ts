import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { db } from '../db';
import { users } from '../models/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const generateToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: 'solver',
        }).returning();

        const token = generateToken(newUser.id, newUser.role);
        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { name, email } = req.body;
        const [updatedUser] = await db.update(users)
            .set({ name, email, updatedAt: new Date() })
            .where(eq(users.id, decoded.userId))
            .returning();
        res.json(updatedUser);
    } catch (error: any) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;