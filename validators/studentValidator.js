const { z } = require('zod');

const studentValidator = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 characters').max(15, 'Phone number is too long'),
  rollNo: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Branch is required'),
  semester: z.string().min(1, 'Semester is required'),
  teacherId: z.string().min(1, 'Teacher ID is required'), // assuming it's a string or ObjectId
});

// Export the schema for use in route validation
module.exports = studentValidator;
