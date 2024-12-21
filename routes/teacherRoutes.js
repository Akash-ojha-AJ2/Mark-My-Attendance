const express = require('express');
const router = express.Router();
const routess = require('../controllers/teacher-controller');
const student = require('../controllers/student-controller');
const validate = require("../middleware/validate-middleware");
const registerSchema = require("../validators/teacherValidator");
const authMiddleware = require('../middleware/authenticateTeacher.js.js');



  



// Register route with validation middleware
router
    .route('/register')
    .post(validate(registerSchema), routess.register);

router.route('/login').post(routess.login);
router.route('/logout').post(authMiddleware,routess.logout);
router.route('/profile').get(routess.profile);

module.exports = router;
