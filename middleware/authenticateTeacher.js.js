// backend/middleware/authenticateTeacher.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Verify token
    req.user = { teacherId: decoded.teacherId }; // Attach teacherId to req.user
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
module.exports = authMiddleware;
