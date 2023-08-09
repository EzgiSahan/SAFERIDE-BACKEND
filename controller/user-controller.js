import User from "../models/User";
import bcrypt from 'bcrypt';

// Create a new user
async function createUser(req,res) {
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
}
export default createUser;