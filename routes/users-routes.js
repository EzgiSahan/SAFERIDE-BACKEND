import express from 'express';
import pool from '../db.js';
//import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (user_name, user_surname, user_email, user_phone, user_password, user_role, user_country, user_city, user_address, user_birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [req.body.name, req.body.surname, req.body.email, req.body.phone, hashedPassword, req.body.role, req.body.country, req.body.city, req.body.address, req.body.birthdate]);
        //const getCretedUser = await pool.query('SELECT * FROM users WHERE user_email =$1', [req.body.email]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;