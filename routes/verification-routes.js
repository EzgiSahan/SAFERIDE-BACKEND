import { generateEmailTemplate, sendVerificationEmail } from '../utils/email-helpers.js';
import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const EMAIL_VERIFICATION_SECRET="eidfödlffşjrfp4jfj49dflkf";
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE user_email = $1', [req.body.email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query(
            'INSERT INTO users (user_name, user_surname, user_email, user_phone, user_password, user_role, user_country, user_city, user_address, user_birthdate, verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [req.body.name, req.body.surname, req.body.email, req.body.phone, hashedPassword, req.body.role, req.body.country, req.body.city, req.body.address, req.body.birthdate, false]
        );
        const verificationToken = jwt.sign({ userId: result.rows[0].user_id }, EMAIL_VERIFICATION_SECRET, {
            expiresIn: '1d',
        });
        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        const emailTemplate = generateEmailTemplate(req.body.name, verificationLink);
        await sendVerificationEmail(req.body.email, 'Account Verification', emailTemplate);
        res.json({ message: 'Signup successful. Please check your email for verification.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        jwt.verify(token, EMAIL_VERIFICATION_SECRET, async (error, decodedToken) => {
            if (error) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }
            const { userId } = decodedToken;
            await pool.query('UPDATE users SET verified = true WHERE user_id = $1', [userId]);
            return res.redirect('/verified.html');
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;