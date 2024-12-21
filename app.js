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



const session = require('express-session'); 
const cookieParser = require("cookie-parser");




app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,  // Secret for signing the session ID cookie
  resave: false,               // Don't save the session if it wasn't modified
  saveUninitialized: false,    // Don't save an uninitialized session
  store: MongoStore.create({ mongoUrl: process.env.ATLASDB_URL }),
  cookie: {
    secure: false,             // Set to true only if using HTTPS
  }
}));

// CORS configuration
const corsOptions = {
  origin: 'https://frontend1-pq6z.onrender.com', // Frontend URL
  methods: "GET, POST, PUT, DELETE, PATCH",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // Built-in body parser

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

