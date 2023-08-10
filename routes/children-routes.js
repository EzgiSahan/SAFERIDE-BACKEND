import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import Children from '../models/Children.js';

const router = express.Router();

router.get('/',async(req, res) => {
    try {
        const children = await Children.findAll();
        res.json({children: children});
    } catch (error) {
          res.status(500).json({error:error.message});
    }
})

router.post('/',async(req, res) => {
    try {
        // Create a new Children record
        const newChildren = await Children.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          userId: req.body.userId,
        });
        await newChildren.save(); 
        res.status(200).json({users: newChildren.toJSON()})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedChildrenCount = await Children.destroy({
          where: {
            id: id,
          },
        });
        if (deletedChildrenCount === 0) {
          res.status(400).json({ message: 'Children not found' });
          return;
        }
        res.status(200).json({ message: 'Children deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
})

//Get children of User
router.get('/user/:id', async(req,res)=>{
    try{
        var id = req.params.id;
        const user_children = await Children.findAll({
            where: {
              userId: id,
            },
          });
        res.status(200).json({children: user_children});
    }
    catch(error){
        res.status(500).json({error: error.message});
    } 

});

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
        const children = await pool.query('SELECT * FROM children where children_id = $1', [id]);
        const querriedChildren = children.rows[0];
        console.log(querriedChildren);
        delete querriedChildren.children_id;
        if (querriedChildren === undefined){
            res.status(400).json({message: 'Children not found'});
        }
        else{
            console.log(req.body);
            console.log(querriedChildren);
            replaceEmptyAttributes(req.body,querriedChildren);
            const {children_name,children_surname,children_email,children_phone, user_id} = req.body;
            const query = `UPDATE "children" SET "children_name" = $1, "children_surname" = $2 , "children_email" = $3, "children_phone" = $4, "user_id" = $5 WHERE "children_id" = $6`;
            console.log(req.body);
            const UpdateChildren = await pool.query(query,[children_name,children_surname,children_email,children_phone,user_id,id]);
            res.status(200).json({message: "Children Updated Successfully!"});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

export default router;