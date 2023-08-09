import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/',authenticateToken,async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
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

    console.log('User created:', newUser.toJSON());
    res.status(200).json({users: newUser.toJSON()})
  } 
  catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.delete('/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        console.log(id);
        const DeleteUser = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
        res.status(200).json({message: 'User deleted'});
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
        const users = await pool.query('SELECT * FROM users where user_id = $1', [id]);
        const querriedUser = users.rows[0];
        console.log(querriedUser);
        delete querriedUser.user_id;
        delete querriedUser.user_password;
        if (querriedUser === undefined){
            res.status(400).json({message: 'User not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedUser);
            replaceEmptyAttributes(req.body,querriedUser);
            const {user_name,user_surname,user_country,user_phone,user_email,user_birthdate,user_address,user_role,user_city} = req.body;
            const query = `UPDATE "users" SET "user_name" = $1, "user_surname" = $2 , "user_country" = $3, "user_phone" = $4,
                             "user_email" = $5, "user_birthdate" = $6, "user_address" = $7, "user_role" = $8, "user_city" = $9 WHERE "user_id" = $10`;
            console.log(req.body);
            const UpdatedUser = await pool.query(query,[user_name,user_surname,user_country,user_phone,user_email,user_birthdate,user_address,user_role,user_city,id]);
            res.status(200).json({message: "User Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


export default router;