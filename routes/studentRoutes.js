const express = require('express');
const router = express.Router();
const student = require('../controllers/student-controller');



const checkTeacherAuth = (req, res, next) => {
  console.log('Session:', req.session);
  if (!req.session.teacherId) {
    return res.status(401).json({ message: "Teacher not authenticated" });
  }
  next();
};

// Apply authentication middleware to all routes in this router
router.use(checkTeacherAuth);
  

router.route("/addstudent").post(student.addStudent);

router.route("/viewstudentdataform").post(student.viewstudentdataform);

router.route("/attendancedataform").post(student.attendancedataform);

router.route('/attendancedataform/:branch/:semester').get(student.attendancedataform);
router.route('/:branch/:semester').get(student.deletestudentform);
router.route('/delete/:studentId').delete(student.deleteStudent);
router.route('/deleteall/:branch/:semester').delete(student.deleteAllStudents);


router.route('/attendance').post(student.markAttendance);



module.exports = router;




module.exports = router;
