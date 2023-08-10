import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import CompanyAdmin from '../models/CompanyAdmin.js';


const router = express.Router();

router.get('/', async(req, res) => {
  try {
      const companyadmin = await CompanyAdmin.findAll();
      res.json({companyadmin: companyadmin});
  } catch (error) {
        res.status(500).json({error:error.message});
  }
})

router.post('/', async(req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newCompanyAdmin = await CompanyAdmin.create({
        firstName: req.body.name,
        lastName: req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
        birthdate: req.body.birthdate,
        role: req.body.role,
        password: hashedPassword,
        companyId: req.body.companyId
      });
      await newCompanyAdmin.save(); 
      res.status(200).json({users: newCompanyAdmin.toJSON()})
    } 
    catch (error) {
      res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
  try {
      const id = req.params.id;
      const deletedCompanyAdminCount = await CompanyAdmin.destroy({
        where: {
          id: id,
        },
      });
      if (deletedCompanyAdminCount === 0) {
        res.status(400).json({ message: 'Company Admin not found' });
        return;
      }
      res.status(200).json({ message: 'Company Admin deleted' });
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
    const querriedCompanyAdmin = await CompanyAdmin.findByPk(id);
    replaceEmptyAttributes(req.body,querriedCompanyAdmin);

    if (!querriedCompanyAdmin) {
      res.status(400).json({ message: 'Company Admin not found' });
      return;
    }
    console.log(querriedCompanyAdmin.toJSON());
    const newCompanyAdmin = await querriedCompanyAdmin.update({
      firstName: req.body.name,
      lastName: req.body.surname,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      birthdate: req.body.birthdate,
      role: req.body.role,
      password: hashedPassword,
      companyId: req.body.companyId
    });
    res.status(200).json({ message: 'Company Admin Updated Successfully!' });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

export default router;