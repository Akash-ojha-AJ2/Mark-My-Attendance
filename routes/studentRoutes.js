const express = require('express');
const router = express.Router();
const student = require('../controllers/student-controller');
const authMiddleware = require('../middleware/authenticateTeacher.js.js');



// Routes for adding and managing students
router.route("/addstudent").post(authMiddleware,student.addStudent);
router.route("/viewstudentdataform").post(student.viewstudentdataform);
router.route("/attendancedataform").post(student.attendancedataform);
router.route('/attendancedataform/:branch/:semester').get(student.attendancedataform);
router.route('/:branch/:semester').get(student.deletestudentform);
router.route('/delete/:studentId').delete(student.deleteStudent);
router.route('/deleteall/:branch/:semester').delete(student.deleteAllStudents);

// Route for marking attendance
router.route('/attendance').post(student.markAttendance);

module.exports = router;

