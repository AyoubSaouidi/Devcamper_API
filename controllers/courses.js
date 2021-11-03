// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// Bootcamp Model
const Course = require('../models/Course');

// @desc     Get courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
// @access   Public
exports.getCourses = asyncHandler(async(req, res, next) => {
    let query;

    // Check if bootcampId in params
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        // Populate Bootcamp
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    // Execute Query
    const courses = await query;

    // Response
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @desc     Get single course
// @route    GET /api/v1/courses/:id
// @access   Public
exports.getCourse = asyncHandler(async(req, res, next) => {
    // Fetch Course from Database by ID
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    // No Course found
    if (!course) {
        return next(
            new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
        );
    }

    // Response
    res.status(200).json({
        success: true,
        data: course
    });
});