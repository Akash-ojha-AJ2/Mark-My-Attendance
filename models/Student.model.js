const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Attendance = require('./Attendance.model'); // Import Attendance model

// Student Schema
const studentSchema = new Schema({
  studentName: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true
},
phoneNo: {
    type: String,
    required: true
},
rollNo: {
    type: String,
    required: true,
    unique: true,
},
branch: {
    type: String,
    required: true
},
semester: {
    type: String,
    required: true
},
teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
},
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance', // Referencing Attendance model
  }], // Array of attendance records linked to the student
});

// Model Creation
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
