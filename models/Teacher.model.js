const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Teacher Schema

const teacherSchema = new Schema({
    teacherName: {
        type: String,
        required: [true, 'Name is required'],  // Custom error message
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    institutionName: {
        type: String,
        required: [true, 'Institution Name is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
   students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'  // Reference to the Student model
}]});

// Create Teacher model
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;