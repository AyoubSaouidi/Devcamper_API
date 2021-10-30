// Modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

// Routes files
const bootcamps = require('./routes/bootcamps');

// Load Environement Variable
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

// Initialize Express
const app = express();

// Dev logger middlware
if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
}

// Mount Routers (- EndPoints -)
app.use('/api/v1/bootcamps', bootcamps);

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});