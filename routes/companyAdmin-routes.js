import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

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
  
      console.log('CompanyAdmin created:', newCompanyAdmin.toJSON());
      res.status(200).json({users: newCompanyAdmin.toJSON()})
    } 
    catch (error) {
      res.status(500).json({error: error.message});
    }
})

export default router;