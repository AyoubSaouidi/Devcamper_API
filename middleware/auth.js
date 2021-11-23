// JWT
const jwt = require('jsonwebtoken');
// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// User Model
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    // Check token is in Authorization header and is Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set up token in the header as Bearer token
        token = req.headers.authorization.split(' ')[1];
    }
    // Set up token in cookies
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find user with payload's ID
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };