import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

export const registerUser = async (req, res, next) => {

  const validation = registerSchema.safeParse(req.body)
  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message)
    return res.status(400).json({ message: errors.join(', ') })
  }

  const {username, password} = validation.data;

  const existingUser = await User.findOne({username}).lean()

  if(existingUser){
    return res.status(409).json({message: 'User already exists'})
  }

  await User.create({username, password}); // hashind done in the model layer.
  return res.status(201).json({message: 'User registered successfully'})

};

export const loginUser = async (req, res, next) => {

  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message)
    return res.status(400).json({ message: errors.join(', ') })
  }

  const {username, password} = validation.data;
  const user = await User.findOne({username});

  if (!user) {
    return res.status(401).json({ message: 'User does not exist'})
  }

  const isPasswordValid = await user.comparePassword(password);

  if(!isPasswordValid){
    return res.status(401).json({message: 'Incorrect password'})
  }

  const token = jwt.sign(
    {userId: user._id, username: user.username},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
  )

  return res.status(200).json({token, username: user.username});
};
