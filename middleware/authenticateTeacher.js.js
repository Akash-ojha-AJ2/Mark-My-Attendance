// backend/middleware/authenticateTeacher.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send("Token is required");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid or expired token");
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
