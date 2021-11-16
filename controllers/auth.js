// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// User Model
const User = require('../models/User');
// Send Mail Utility
const sendEmail = require('../utils/sendEmail');
// Crypto
const crypto = require('crypto');

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

// @desc     Update user details
// @route    PUT /api/v1/auth/updatedetails
// @access   Private
exports.updateDetails = asyncHandler(async(req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    // User
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    //Response
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc     Update user password
// @route    PUT /api/v1/auth/updatepassword
// @access   Private
exports.updatePassword = asyncHandler(async(req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    // User
    const user = await User.findById(req.user.id).select('+password');

    // Check if Match Current Password
    const isMatch = await user.matchPassword(currentPassword);

    // No Match
    if (!isMatch) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    // Match
    user.password = newPassword;
    await user.save();

    //Response
    sendTokenResponse(user, 200, res);
});

// @desc     Forgot Password
// @route    POST /api/v1/auth/forgotpassword
// @access   Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    // User
    const user = await User.findOne({ email: req.body.email });

    // Check if user exists with given email
    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Generate Reset Password Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested a reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // Send Email
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        //Response
        res.status(200).json({
            success: true,
            data: 'Email sent...'
        });
    } catch (err) {
        console.error(err.message);
        // Reset user passwords reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc     Reset Password
// @route    PUT /api/v1/auth/resetpassword/:resetToken
// @access   Public
exports.resetPassword = asyncHandler(async(req, res, next) => {
    const resetTokenHashed = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    // User
    const user = await User.findOne({
        resetPasswordToken: resetTokenHashed,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    });

    // No User found in Database
    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // User found in Database --> Reset Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    //Response
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