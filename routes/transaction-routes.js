
import express from 'express';
import { authenticateToken } from '../middleware/authorization.js';
import Transactions from '../models/Transactions.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const transactions = await Transactions.findAll();
        res.json({transactions: transactions});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newTransaction = await Transactions.create({
            type: req.body.type,
            tripId: req.body.tripId,
            userId: req.body.userId,
            childId: req.body.childId
        });
        await newTransaction.save(); 
        res.status(200).json({transactions: newTransaction.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedTransaction = await Transactions.destroy({
          where: {
            id: id,
          },
        });
        if (deletedTransaction === 0) {
          res.status(400).json({ message: 'Transaction not found' });
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
      const querriedTransactions = await Transactions.findByPk(id);
      replaceEmptyAttributes(req.body,querriedTransactions);
  
      if (!querriedTransactions) {
        res.status(400).json({ message: 'Transaction not found' });
        return;
      }
      const newTransaction = await querriedTransactions.update({
        type: req.body.type,
        tripId: req.body.tripId,
        userId: req.body.userId,
        childId: req.body.childId

      });
      res.status(200).json({ message: 'Transaction Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})

export default router;