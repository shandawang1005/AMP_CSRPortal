// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

// GET /api/login
router.get('/me', requireAuth, async (req, res) => {
  const user = await db('csr_users').where({ id: req.user.userId }).first();
  res.json({ user });
});


// POST /api/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required.' });
        }

        const user = await db('csr_users').where({ email }).first();

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }


        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // only over HTTPS in prod
                sameSite: 'lax',
                maxAge: 2 * 60 * 60 * 1000, // 2 hours
            })
            .json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
    } catch (err) {
        next(err);
    }
});


// POST /api/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


export default router;
