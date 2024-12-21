const express = require('express');
const router = express.Router();
const student = require('../controllers/student-controller');

// Session-based authentication middleware
const checkTeacherAuth = (req, res, next) => {
  console.log('Session:', req.session);
  if (!req.session.teacherId) {
    return res.status(401).json({ message: "Teacher not authenticated" });
  }
  next(); // Proceed to the next middleware/route if authenticated
};

// Apply authentication middleware to all routes in this router
router.use(checkTeacherAuth);

// Routes for adding and managing students
router.route("/addstudent").post(student.addStudent);
router.route("/viewstudentdataform").post(student.viewstudentdataform);
router.route("/attendancedataform").post(student.attendancedataform);
router.route('/attendancedataform/:branch/:semester').get(student.attendancedataform);
router.route('/:branch/:semester').get(student.deletestudentform);
router.route('/delete/:studentId').delete(student.deleteStudent);
router.route('/deleteall/:branch/:semester').delete(student.deleteAllStudents);

// Route for marking attendance
router.route('/attendance').post(student.markAttendance);

module.exports = router;

