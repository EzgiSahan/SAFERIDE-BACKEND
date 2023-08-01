import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/',authenticateToken, async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM companyAdmin');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', authenticateToken, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query(
            'INSERT INTO companyAdmin (name, surname, email, phone, password, role, country, city, address, birthdate, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [req.body.name, req.body.surname, req.body.email, req.body.phone, hashedPassword, req.body.role, req.body.country, req.body.city, req.body.address, req.body.birthdate, req.body.companyId]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;