// Mongoose
const mongoose = require('mongoose');
// JWT
const jwt = require('jsonwebtoken');
// BcryptJS
const bcrypt = require('bcryptjs');
// Crypto
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password with bycryptjs ON-SAVE
UserSchema.pre('save', async function(next) {
    // Check if password Modified
    if (!this.isModified('password')) {
        next();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Save Hashed Password
    this.password = hashedPassword;
});

// Sign to Json Web Token
UserSchema.methods.getSignedJwtToken = function() {
    const payload = { id: this._id };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token && set reset fields
UserSchema.methods.getResetPasswordToken = function() {
    // Random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash Token & define expiring Date
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    const expireDate = Date.now() + 10 * 60 * 1000;

    // Set ResetPassword (Token Expire) fileds
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpire = expireDate;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);