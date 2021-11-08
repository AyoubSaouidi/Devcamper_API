// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// User Model
const User = require('../models/User');

// @desc     Register User
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async(req, res, next) => {
    // Body data
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Response
    sendTokenResponse(user, 200, res);
});

// @desc     Login User
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async(req, res, next) => {
    // Body data
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check user by email in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check passwords match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Response
    sendTokenResponse(user, 200, res);
});

// Get Token from model, Set a Cookie , Send Response --!! HELPER !!--
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Cookie's options
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    // Production secure flag
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // Set Cookie in response
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

// @desc     Get logged in User
// @route    GET /api/v1/auth/me
// @access   Public
exports.getMe = asyncHandler(async(req, res, next) => {
    // User
    const user = await User.findById(req.user.id);

    //Response
    res.status(200).json({
        success: true,
        data: user
    });
});