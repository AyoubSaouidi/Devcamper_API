// Modules
const path = require('path');
const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Middlewares
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');

// Load Environement Variable
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDB();

// Routes files
const auth = require('./routes/auth');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Initialize Express
const app = express();

// Body json Parser
app.use(express.json());

// Dev logger & FileUpload middlware
if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
}
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers (- EndPoints -)
app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error Handler MiddleWare
app.use(errorHandler);

// Run Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    );
});

// Handle unhandled Rejections (promises)
process.on('unhandledRejection', (err, promise) => {
    console.error(`ERROR -- ${err.message}`.red.bold);
    // Close Server & Exit
    server.close(() => process.exit(1));
});