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

router.put('/:id', async(req,res)=>{
    try {
      const id = req.params.id;
      console.log(id);  
      const querriedBusDriver = await BusDriver.findByPk(id);
      replaceEmptyAttributes(req.body,querriedBusDriver);
  
      if (!querriedBusDriver) {
        res.status(400).json({ message: 'Bus Driver not found' });
        return;
      }
      console.log(querriedBusDriver.toJSON());
      const newBusDriver = await querriedBusDriver.update({
        firstName: req.body.firstName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
      });
      res.status(200).json({ message: 'Bus Driver Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})

export default router;
