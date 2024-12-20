// backend/middleware/authenticateTeacher.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authenticateTeacher = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your secret
    req.teacherId = decoded.teacherId;  // Attach teacherId to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateTeacher;
