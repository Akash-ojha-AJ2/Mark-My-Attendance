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
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Store the teacher's ID in session
    req.session.teacherId = teacher._id;

    console.log("Session after login:", req.session);  // Log session here to check if teacherId is set

    res.status(200).json({ message: 'Login successful', teacherId: teacher._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error logging out:', err);
          return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.send('Logout successful');
      console.log("'Logout successful'")
  });
};

// In the routess controller
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
