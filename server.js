// Modules
const path = require('path');
const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load Environement Variable
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDB();

// Routes files
const bootcamps = require('./routes/bootcamps');

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