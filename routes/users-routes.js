import express from 'express';
import pool from '../db.js';
//import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (user_name, user_surname, user_email, user_phone, user_password, user_role, user_country, user_city, user_address, user_birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [req.body.name, req.body.surname, req.body.email, req.body.phone, hashedPassword, req.body.role, req.body.country, req.body.city, req.body.address, req.body.birthdate]);
        //const getCretedUser = await pool.query('SELECT * FROM users WHERE user_email =$1', [req.body.email]);
        res.json({users: newUser.rows[0]})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', authenticateToken, async(req,res)=>{
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

router.put('/:id', authenticateToken, async(req,res)=>{
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