// Modules
const path = require('path');
const colors = require('colors');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Security Modules
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
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
const users = require('./routes/users');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');

// Initialize Express
const app = express();

// Body json Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logger & FileUpload middlware
if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
}
app.use(fileupload());

// -------- Security
// Sanitize data
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// Prevent XSS attacks (XSS: Cross Site Scripting)
app.use(xss());

// Set requests Rate Limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10min
    max: 100
});
app.use(limiter);

// Prevent Http Params Pollution (HPP)
app.use(hpp());

// Set static folder
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static(path.join(__dirname, 'public')));

// Mount Routers (- EndPoints -)
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);

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