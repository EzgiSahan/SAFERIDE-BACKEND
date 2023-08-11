import { generateEmailTemplate, sendVerificationEmail } from '../utils/email-helpers.js';
import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CompanyAdmin from '../models/CompanyAdmin.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }
        const existingUserAdmin = await CompanyAdmin.findOne({ where: { email: req.body.email } });
        if (existingUserAdmin) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            birthdate: req.body.birthdate,
            verified: false
        });
        const verificationToken = jwt.sign({ userId: newUser.id }, process.env.EMAIL_VERIFICATION_SECRET, {
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
        jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET, async (error, decodedToken) => {
            if (error) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }
            const { userId } = decodedToken;
            await User.update({ verified: true }, { where: { id: userId } });
            return res.redirect('/verified.html');
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;