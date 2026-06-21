import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

export const registerUser = async (req, res, next) => {
  // TODO:
  // 1. Validate the request body (req.body) using registerSchema.safeParse().
  //    If validation fails, extract validation errors and throw/pass a 400 Bad Request error.
  // 2. Check if a User with the given username already exists in the database.
  //    Use User.findOne({ username }).lean().
  //    If the user exists, throw/pass a 409 Conflict error.
  // 3. Hash the plain text password from the request body using bcrypt.hash(password, 10).
  // 4. Create and save the new User in the database with the hashed password.
  // 5. Send a 201 Created response containing a message, e.g., { message: 'User registered successfully' }.
};

export const loginUser = async (req, res, next) => {
  // TODO:
  // 1. Validate the request body (req.body) using loginSchema.safeParse().
  //    If validation fails, extract validation errors and throw/pass a 400 Bad Request error.
  // 2. Query the database to find the user by username.
  //    Use User.findOne({ username }).lean() to get the password hash.
  //    If the user does not exist, throw/pass a 401 Unauthorized error.
  // 3. Compare the request password with the hashed password from the database using bcrypt.compare(password, user.password).
  //    If they don't match, throw/pass a 401 Unauthorized error.
  // 4. Sign a JWT token using jwt.sign.
  //    Payload shape: { userId: user._id, username: user.username }.
  //    Secret: process.env.JWT_SECRET.
  //    Expires: process.env.JWT_EXPIRES_IN (default to '7d' if not specified).
  // 5. Return a 200 OK response with the generated token, e.g., { token, username: user.username }.
};
