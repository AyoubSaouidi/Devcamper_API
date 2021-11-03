// Modules
const path = require('path');
const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Middlewares
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Load Environement Variable
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDB();

// Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Initialize Express
const app = express();

// Body json Parser
app.use(express.json());

// Dev logger middlware
if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
}

// Mount Routers (- EndPoints -)
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