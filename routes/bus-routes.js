import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const bus = await pool.query('SELECT * FROM bus');
        res.json({bus: bus.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO bus (bus_model, company_id, bus_driver_id) VALUES ($1, $2, $3) RETURNING *',
        [req.body.model, req.body.companyId, req.body.driverId]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        console.log(id);
        const DeleteBus = await pool.query('DELETE FROM bus WHERE bus_id = $1', [id]);
        res.status(200).json({message: 'Bus deleted'});
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

router.put('/:id', authenticateToken, async(req,res)=>{
    try{
        var id = req.params.id;
        const bus = await pool.query('SELECT * FROM bus where bus_id = $1', [id]);
        const querriedBus = bus.rows[0];
        console.log(querriedBus);
        delete querriedBus.bus_id;
        if (querriedBus === undefined){
            res.status(400).json({message: 'Bus not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedBus);
            replaceEmptyAttributes(req.body,querriedBus);
            const {bus_model,company_id,bus_driver_id} = req.body;
            const query = `UPDATE "bus" SET "bus_model" = $1, "company_id" = $2 , "bus_driver_id" = $3 WHERE "bus_id" = $4`;
            console.log(req.body);
            const UpdatedBus = await pool.query(query,[bus_model,company_id,bus_driver_id,id]);
            res.status(200).json({message: "Bus Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

export default router;