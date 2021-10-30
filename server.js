// Modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load Environement Variable
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

// Initialize Express
const app = express();

// Routes

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});