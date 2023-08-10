import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import Company from '../models/Company.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const company = await Company.findAll();
        res.json({company: company});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newCompany = await Company.create({
            name: req.body.name,
            joinedDate: req.body.joinedDate,
            email: req.body.email,
            phone: req.body.phone,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address
        });
        await newCompany.save(); 
        res.status(200).json({users: newCompany.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedCompanyCount = await Company.destroy({
          where: {
            id: id,
          },
        });
        if (deletedCompanyCount === 0) {
          res.status(400).json({ message: 'Company not found' });
          return;
        }
        res.status(200).json({ message: 'Company deleted' });
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
      const querriedCompany = await Company.findByPk(id);
      replaceEmptyAttributes(req.body,querriedCompany);
  
      if (!querriedCompany) {
        res.status(400).json({ message: 'Company not found' });
        return;
      }
      console.log(querriedCompany.toJSON());
      const newCompany = await querriedCompany.update({
        model: req.body.model,
        companyId: req.body.companyId,
        busDriverId: req.body.busDriverId 
      });
      res.status(200).json({ message: 'Company Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})

export default router;