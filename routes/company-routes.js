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
    try{
        var id = req.params.id;
        const users = await pool.query('SELECT * FROM company where company_id = $1', [id]);
        const querriedCompany = users.rows[0];
        console.log(querriedCompany);
        delete querriedCompany.company_id;
        delete querriedCompany.company_password;
        if (querriedCompany === undefined){
            res.status(400).json({message: 'Company not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedCompany);
            replaceEmptyAttributes(req.body,querriedCompany);
            const {company_name,date_joined,company_email,company_phone,company_country,company_city,company_address} = req.body;
            const query = `UPDATE "company" SET "company_name" = $1, "date_joined" = $2 , "company_email" = $3, "company_phone" = $4, "company_country" = $5, "company_city" = $6, "company_address" = $7 WHERE "company_id" = $8`;
            console.log(req.body);
            const UpdatedCompany = await pool.query(query,[company_name,date_joined,company_email,company_phone,company_country,company_city,company_address,id]);
            res.status(200).json({message: "Company Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


export default router;