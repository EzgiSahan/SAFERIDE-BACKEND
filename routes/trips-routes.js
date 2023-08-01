import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/' ,async(req, res) => {
    try {
        const trips = await pool.query('SELECT * FROM trips');
        res.json({trips: trips.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', authenticateToken,async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO trips (date_started, bus_id, bus_driver_id, passenger) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.body.date, req.body.busId, req.body.driverId ,req.body.passenger]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;