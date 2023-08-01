import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/',authenticateToken, async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM bus');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', authenticateToken, async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO bus (bus_model, company_id, bus_driver_id) VALUES ($1, $2, $3) RETURNING *',
        [req.body.model, req.body.companyId, req.body.driverId]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;