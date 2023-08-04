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

router.post('/',async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO trips (date_started, bus_id, passenger) VALUES ($1, $2, $3) RETURNING *',
        [req.body.date, req.body.busId ,req.body.passenger]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        console.log(id);
        const DeleteTrip = await pool.query('DELETE FROM trips WHERE trip_id = $1', [id]);
        res.status(200).json({message: 'Trip deleted'});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

function replaceEmptyAttributes(jsonObject, replacementObject) {
    const stack = [{ jsonObject, replacementObject }];
    while (stack.length) {
      const { jsonObject, replacementObject } = stack.pop();
      for (let key in jsonObject) {
        if (jsonObject[key] === "") {
          jsonObject[key] = replacementObject[key];
        } else if (
          typeof jsonObject[key] === "object" &&
          typeof replacementObject[key] === "object"
        ) {
          stack.push({
            jsonObject: jsonObject[key],
            replacementObject: replacementObject[key],
          });
        }
      }
    }
    return 
  }

router.put('/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        const trips = await pool.query('SELECT * FROM trips where trip_id = $1', [id]);
        const querriedTrip = trips.rows[0];
        console.log(querriedTrip);
        delete querriedTrip.trip_id;
        if (querriedTrip === undefined){
            res.status(400).json({message: 'Trip not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedTrip);
            replaceEmptyAttributes(req.body,querriedTrip);
            const {date_started,bus_id,passenger} = req.body;
            const query = `UPDATE "trips" SET "date_started" = $1, "bus_id" = $2 , "passenger" = $3 WHERE "trip_id" = $4`;
            console.log(req.body);
            const UpdateTrip = await pool.query(query,[date_started,bus_id,passenger,id]);
            res.status(200).json({message: "Trip Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


export default router;