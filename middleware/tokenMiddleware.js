// tokenMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Assuming token is passed as 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'No token provided, please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.teacherId = decoded.teacherId;  // Save the teacherId from the decoded token
    next();  // Proceed to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
