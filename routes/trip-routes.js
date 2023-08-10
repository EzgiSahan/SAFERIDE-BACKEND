import express from 'express';
import { authenticateToken } from '../middleware/authorization.js';
import Trips from '../models/Trips.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const trips = await Trips.findAll();
        res.json({trips: trips});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newTrip = await Trips.create({
            model: req.body.model,
            companyId: req.body.companyId,
            busDriverId: req.body.busDriverId 
        });
        await newBus.save(); 
        res.status(200).json({users: newBus.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedTrip = await Trips.destroy({
          where: {
            id: id,
          },
        });
        if (deletedTrip === 0) {
          res.status(400).json({ message: 'Trip not found' });
          return;
        }
    
        res.status(200).json({ message: 'Trip deleted' });
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
      const querriedTrip = await Trips.findByPk(id);
      replaceEmptyAttributes(req.body,querriedTrip);
  
      if (!querriedBus) {
        res.status(400).json({ message: 'Bus not found' });
        return;
      }
      console.log(querriedTrip.toJSON());
      const newTrip = await querriedTrip.update({
        model: req.body.model,
        companyId: req.body.companyId,
        busDriverId: req.body.busDriverId 
      });
      res.status(200).json({ message: 'Trip Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})

export default router;