// backend/middleware/authenticateTeacher.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in cookies

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.teacherId = decoded.teacherId; // Attach decoded teacherId to the request
    next();
  });
};

module.exports = authMiddleware;
