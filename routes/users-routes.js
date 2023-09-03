import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/',async(req, res) => {
    try {
      const users = await User.findAll();
      res.json({users: users});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

router.get('/me',async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).json({error: 'Null token'});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) =>{
        if(error) return res.status(403).json({error: error.message});
        req.user = user;
        console.log(user);
        res.status(200).json({user: user})
    })
});

router.post('/', async(req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
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
    });

    await newUser.save(); 
    res.status(200).json({users: newUser.toJSON()})
  } 
  catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.delete('/:id', async(req,res)=>{
  try {
    const id = req.params.id;
    // Find the user by user_id and delete it
    const deletedUserCount = await User.destroy({
      where: {
        id: id,
      },
    });
    if (deletedUserCount === 0) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted' });
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

    // Find the user by user_id
    const querriedUser = await User.findByPk(id);

    replaceEmptyAttributes(req.body,querriedUser);


    if (!querriedUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    console.log(querriedUser.toJSON());
    const newUser = await querriedUser.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      birthdate: req.body.birthdate,
      role: req.body.role,
    });
    res.status(200).json({ message: 'User Updated Successfully!' });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})


export default router;
