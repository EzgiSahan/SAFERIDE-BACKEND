import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import BusDriver from '../models/BusDriver.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const busdriver = await BusDriver.findAll();
        res.json({busdriver: busdriver});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newBusDriver = await BusDriver.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone
        });
        await newBusDriver.save(); 
        res.status(200).json({users: newBusDriver.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedBusDriverCount = await BusDriver.destroy({
          where: {
            id: id,
          },
        });
        if (deletedBusDriverCount === 0) {
          res.status(400).json({ message: 'Bus Driver not found' });
          return;
        }
        res.status(200).json({ message: 'Bus Driver deleted' });
      } catch (error) {
        res.status(500).json({ error: error.message });
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
        const busDriver = await pool.query('SELECT * FROM busDriver where bus_driver_id = $1', [id]);
        const querriedBusDriver = busDriver.rows[0];
        console.log(querriedBusDriver);
        delete querriedBusDriver.bus_driver_id;
        delete querriedBusDriver.surname;
        if (querriedBusDriver === undefined){
            res.status(400).json({message: 'Bus Driver not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedBusDriver);
            replaceEmptyAttributes(req.body,querriedBusDriver);
            const {name,surname,email,phone} = req.body;
            const query = `UPDATE "busDriver" SET "name" = $1, "surname" = $2 , "email" = $3, "phone" = $4 WHERE "bus_driver_id" = $5`;
            console.log(req.body);
            const UpdatedBusDriver = await pool.query(query,[name,surname,email,phone]);
            res.status(200).json({message: "Bus Driver Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


export default router;
