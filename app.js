if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const teacherRoutes = require('./routes/teacherRoutes'); 
const studentRoutes = require('./routes/studentRoutes'); 
const errorMiddleware = require("./middleware/error-middleware.js");
const path = require('path');
const MongoStore = require('connect-mongo');




const cookieParser = require("cookie-parser");



app.use(express.json()); 
app.use(cookieParser());



// CORS configuration
const corsOptions = {
  origin: 'https://frontend1-pq6z.onrender.com', // Frontend URL
  methods: "GET, POST, PUT, DELETE, PATCH",
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Built-in body parser

// Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/student', studentRoutes);

// Error middleware
app.use(errorMiddleware);

// MongoDB connection with additional options
mongoose
  .connect(process.env.ATLASDB_URL, {
   
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// app.use(express.static(path.join(_dirname,"/frontend/dist")));
// app.get("*" ,(req,res) => {
//   res.sendFile(path.resolve(_dirname,"frontend" , "dist", "index.html"))
// });


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

