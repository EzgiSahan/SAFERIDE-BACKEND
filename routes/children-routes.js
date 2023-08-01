import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/',async(req, res) => {
    try {
        const children = await pool.query('SELECT * FROM children');
        res.json({children: children.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', authenticateToken,async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO children (children_name, children_surname, children_email, children_phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.body.name, req.body.surname, req.body.email, req.body.phone]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;