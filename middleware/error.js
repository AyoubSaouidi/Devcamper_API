// Error Response
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    // Log to console for Dev
    console.log(err.stack.red);

    let error = {...err };
    error.message = err.message;

    // Check CastError (Mongoose bad ObjectId)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;

        // Error
        error = new ErrorResponse(message, 404);
    }

    // Check MongoServerError (Mongoose duplicate key)
    if (err.code === 11000) {
        const message = `Resource already exists with same ${
      Object.keys(err.keyValue)[0]
    }`;

        // Error
        error = new ErrorResponse(message, 400);
    }

    // Check ValidarionError (Mongoose validation)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message);

        // Error
        error = new ErrorResponse(message, 400);
    }

    // Error Response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;