import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import Bus from '../models/Bus.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const bus = await Bus.findAll();
        res.json({bus: bus});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newBus = await Bus.create({
            model: req.body.model,
            companyId: req.body.companyId,
            busDriverId: req.body.busDriverId 
        });
        await newBus.save(); 
        res.status(200).json({buses: newBus.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedBusCount = await Bus.destroy({
          where: {
            id: id,
          },
        });
        if (deletedBusCount === 0) {
          res.status(400).json({ message: 'Bus not found' });
          return;
        }
    
        res.status(200).json({ message: 'Bus deleted' });
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
      const querriedBus = await Bus.findByPk(id);
      replaceEmptyAttributes(req.body,querriedBus);
  
      if (!querriedBus) {
        res.status(400).json({ message: 'Bus not found' });
        return;
      }
      console.log(querriedBus.toJSON());
      const newBus = await querriedBus.update({
        model: req.body.model,
        companyId: req.body.companyId,
        busDriverId: req.body.busDriverId 
      });
      res.status(200).json({ message: 'Bus Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})

export default router;