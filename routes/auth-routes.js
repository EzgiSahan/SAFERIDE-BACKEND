import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js';
import User from '../models/User.js';
import CompanyAdmin from '../models/CompanyAdmin.js';

const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        let role = "";
        let tokens = "";
        const user = await User.findOne({ where: { email: email } });
        const companyAdmin = await CompanyAdmin.findOne({where: {email: email}});
        if (!user && !companyAdmin) {
            return res.status(401).json({ error: 'Email not Found!' });
        }
        role = user ? "User" : companyAdmin && "CompanyAdmin" ;
        if(role =="User"){
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            tokens = jwtTokens(user);
        }
        if(role =="CompanyAdmin"){
            const validCompanyAdminPassword = await bcrypt.compare(password, companyAdmin.password);
            if (!validCompanyAdminPassword) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            tokens = jwtTokens(companyAdmin);
        }
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

router.get('/refresh_token', (req,res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(refreshToken == null) return res.status(401).json({error: 'Null refresh token'});
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if(error) return res.status(403).json({error: error.message});
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            res.json(tokens);
        })
    } catch (error) {
        res.status(401).json({error: error.message});
    }
})

router.delete('/refresh_token', (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message: 'Refresh token deleted'});
    } catch (error) {
        res.status(401).json({error: error.message});
    }
})
export default router;