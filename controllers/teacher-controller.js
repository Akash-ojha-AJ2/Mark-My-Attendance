const Teacher = require("../models/Teacher.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();


app.use((req, res, next) => {
  console.log("Session Middleware Check:", req.session);
  next();
});



// Register function
const register = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);

    const { teacherName, email, phone, institutionName, address, password } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = new Teacher({
      teacherName,
      email,
      phone,
      institutionName,
      address,
      password: hashedPassword,
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully', teacher: newTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
    next(err); // Pass the error to the middleware
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ teacherId: teacher._id }, process.env.SECRET, { expiresIn: '1h' });
    res.json({ teacherId: teacher._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
};


const logout = async(req, res) => {
  res.clearCookie('token'); // Clear token cookie
  res.clearCookie('teacherId'); // Clear other related cookies
  res.status(200).send({ message: 'Logged out successfully' });
};


const profile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.session.teacherId);
    console.log(teacher);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ name: teacher.teacherName });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};



module.exports = {
  register,
  login,
  logout,
  profile,
};
