import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // TODO:
  // 1. Get the token from the Authorization header (should be "Bearer <token>").
  //    If no Authorization header exists or if it doesn't start with "Bearer",
  //    throw/return a 401 Unauthorized error (e.g. via next() or throwing an error
  //    to be caught by the Express 5 global error handler).
  // 2. Verify the JWT token using jwt.verify and process.env.JWT_SECRET.
  //    If verification fails (invalid token, expired), pass/throw a 401 error.
  // 3. Extract the userId from the decoded payload { userId, username }.
  // 4. Fetch the User from the database using User.findById(userId).lean().
  //    If no user is found, pass/throw a 401 error.
  // 5. Attach the fetched user object (or at least { id: user._id, username: user.username })
  //    to req.user so that downstream route handlers can access it.
  // 6. Call next() to proceed to the next middleware or controller function.
};
