import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const company = await pool.query('SELECT * FROM company');
        res.json({company: company.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', authenticateToken, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query(
            'INSERT INTO company (company_name, date_joined, company_email, company_phone, company_password, company_role, company_country, company_city, company_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [req.body.name, req.body.date, req.body.email, req.body.phone, hashedPassword, req.body.role, req.body.country, req.body.city, req.body.address, req.body.birthdate]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;