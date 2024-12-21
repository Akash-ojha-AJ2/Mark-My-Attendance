const express = require('express');
const router = express.Router();
const student = require('../controllers/student-controller');
const authMiddleware = require('../middleware/authenticateTeacher.js.js');



// Routes for adding and managing students
router.route("/addstudent").post(authMiddleware,student.addStudent);
router.route("/viewstudentdataform").post(authMiddleware,student.viewstudentdataform);
router.route("/attendancedataform").post(authMiddleware,student.attendancedataform);
router.route('/attendancedataform/:branch/:semester').get(authMiddleware,student.attendancedataform);
router.route('/:branch/:semester').get(authMiddleware,student.deletestudentform);
router.route('/delete/:studentId').delete(authMiddleware,student.deleteStudent);
router.route('/deleteall/:branch/:semester').delete(authMiddleware,student.deleteAllStudents);

// Route for marking attendance
router.route('/attendance').post(authMiddleware,student.markAttendance);

module.exports = router;

