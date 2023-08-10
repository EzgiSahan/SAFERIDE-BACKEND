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
    try {
      const id = req.params.id;
      console.log(id);  
      const querriedChildren = await Children.findByPk(id);
      replaceEmptyAttributes(req.body,querriedChildren);
  
      if (!querriedChildren) {
        res.status(400).json({ message: 'Children not found' });
        return;
      }
  
      console.log(querriedChildren.toJSON());
      const newChildren = await querriedChildren.update({
        firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            userId: req.body.userId, 
      });
      res.status(200).json({ message: 'Children Updated Successfully!' });
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
})
  
export default router;