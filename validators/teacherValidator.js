const { z } = require('zod');

const teacherValidationSchema = z.object({
    teacherName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    institutionName: z.string().min(1, { message: "Institution Name is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

module.exports = teacherValidationSchema;
