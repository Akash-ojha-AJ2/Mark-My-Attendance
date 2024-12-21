// backend/middleware/authenticateTeacher.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Verify token
    req.teacherId = decoded.teacherId; // Attach teacherId to request
    next(); // Continue to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
