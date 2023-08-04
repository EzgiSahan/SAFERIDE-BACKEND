import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const company = await pool.query('SELECT * FROM company');
        res.json({company: company.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const newUser = await pool.query(
            'INSERT INTO company (company_name, date_joined, company_email, company_phone, company_country, company_city, company_address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [req.body.name, req.body.date, req.body.email, req.body.phone, req.body.country, req.body.city, req.body.address]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        console.log(id);
        const DeleteCompany = await pool.query('DELETE FROM company WHERE company_id = $1', [id]);
        res.status(200).json({message: 'Company deleted'});
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