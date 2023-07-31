import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/',authenticateToken, async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM busDriver');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO busDriver (name, surname, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.body.name, req.body.surname, req.body.email, req.body.phone]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;
