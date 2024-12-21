const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");
const Attendance = require('../models/Attendance.model');



const addStudent = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Use teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { studentName, email, phoneNo, rollNo, branch, semester } = req.body;

    if (!studentName || !email || !rollNo || !branch || !semester) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newStudent = new Student({
      studentName,
      email,
      phoneNo,
      rollNo,
      branch,
      semester,
      teacherId,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error in addStudent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




const viewstudentdataform = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { branch, semester } = req.body;

    if (!branch || !semester) {
      return res.status(400).json({ message: 'Branch and Semester are required' });
    }

    // Fetch students for the specified branch, semester, and authenticated teacher
    let students = await Student.find({
      branch,
      semester,
      teacherId, // Ensure students are only fetched for this teacher
    }).sort({ rollNo: 1 });

    if (!students.length) {
      return res.status(404).json({ message: 'No students found for the selected branch and semester.' });
    }

    // Fetch attendance records for these students
    const attendanceRecords = await Attendance.find({
      studentId: { $in: students.map((student) => student._id) },
    }).sort({ date: 1 });

    // Group attendance records by student ID
    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      if (!attendanceMap[record.studentId]) {
        attendanceMap[record.studentId] = [];
      }
      attendanceMap[record.studentId].push({
        date: record.date.toISOString().split('T')[0],
        status: record.status,
      });
    });

    // Calculate total attendance for each student
    const totalAttendance = await Attendance.aggregate([
      {
        $match: {
          studentId: { $in: students.map((student) => student._id) },
        },
      },
      {
        $group: {
          _id: '$studentId',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] },
          },
        },
      },
    ]);

    const totalAttendanceMap = {};
    totalAttendance.forEach((record) => {
      totalAttendanceMap[record._id] = {
        totalDays: record.totalDays,
        presentDays: record.presentDays,
      };
    });

    // Send the sorted data back to the front-end
    res.status(200).json({
      students,
      attendanceMap,
      totalAttendanceMap,
      branch,
      semester,
    });
  } catch (error) {
    console.error('Error in viewstudentdataform:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const attendancedataform = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { branch, semester } = req.params;

    if (!branch || !semester) {
      return res.status(400).json({ message: 'Branch and Semester are required' });
    }

    // Fetch students associated with the logged-in teacher
    const students = await Student.find({
      branch,
      semester,
      teacherId,
    }).sort({ rollNo: 1 });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this teacher' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error in attendancedataform:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { studentIds, branch, semester, date } = req.body;

    if (!date || !branch || !semester) {
      return res.status(400).json({ message: 'Date, Branch, and Semester are required' });
    }

    // Fetch all students of the logged-in teacher for the given branch and semester
    const allStudents = await Student.find({
      branch,
      semester,
      teacherId, // Ensure it's restricted to the teacher's students
    });

    if (!allStudents.length) {
      return res.status(404).json({ message: 'No students found for this teacher.' });
    }

    const presentStudents = studentIds || []; // IDs of students marked as present
    console.log('Present student IDs:', presentStudents);

    const attendanceRecords = allStudents.map((student) => {
      const isPresent = presentStudents.includes(student._id.toString()); // Compare as strings
      return {
        studentId: student._id,
        date,
        status: isPresent ? 'Present' : 'Absent', // Mark as Present or Absent
      };
    });

    // Save attendance records
    await Attendance.insertMany(attendanceRecords);

    res.status(200).json({ message: 'Attendance saved successfully.' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'Error saving attendance', error: error.message });
  }
};



// GET route to fetch students by teacher's ID, branch, and semester
const deletestudentform = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { branch, semester } = req.params;

    // Fetch students associated with the teacher, branch, and semester
    const students = await Student.find({
      branch,
      semester,
      teacherId,
    });

    if (!students.length) {
      return res.status(404).json({ message: 'No students found for this teacher.' });
    }

    // If students found, return them to the frontend
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students data.' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { studentId } = req.params; // The student ID to delete

    console.log('Deleting student with ID:', studentId);
    console.log('Teacher ID from session:', teacherId);

    // Find the student and check if the teacherId matches
    const student = await Student.findOne({ _id: studentId, teacherId });
    if (!student) {
      console.log('Student not found or unauthorized');
      return res.status(404).json({ message: 'Student not found or unauthorized.' });
    }

    console.log('Student found:', student);

    // Delete related attendance records for the student
    const attendanceDeletionResult = await Attendance.deleteMany({ studentId });
    console.log('Attendance records deleted:', attendanceDeletionResult.deletedCount);

    // Proceed with deleting the student
    const studentDeletionResult = await Student.deleteOne({ _id: studentId });
    console.log('Student deleted:', studentDeletionResult.deletedCount);

    res.status(200).json({ message: 'Student and related data deleted successfully.' });
  } catch (err) {
    console.error('Error during deletion:', err);
    res.status(500).json({ message: 'Error deleting student and related data.' });
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId; // Get teacherId from req.user
    if (!teacherId) {
      return res.status(401).json({ message: 'Teacher not authenticated' });
    }

    const { branch, semester } = req.params;

    // Delete all students for the given branch, semester, and teacher
    const result = await Student.deleteMany({ branch, semester, teacherId });
    res.status(200).json({ message: "All students deleted successfully", result });
  } catch (error) {
    console.error("Error deleting all students:", error);
    res.status(500).json({ message: "Failed to delete all students" });
  }
};


module.exports = {deletestudentform, deleteAllStudents,deleteStudent,markAttendance,attendancedataform,viewstudentdataform,addStudent} ;
