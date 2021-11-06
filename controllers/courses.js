// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');
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

// @desc     Add new course
// @route    POST /api/v1/:bootcampId/courses
// @access   Private
exports.addCourse = asyncHandler(async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    // Check if Bootcamp in Database
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // No Bootcamp found with ID
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp not found with id of ${req.params.bootcampId}`,
                404
            )
        );
    }

    // Create new Course
    const course = await Course.create(req.body);

    // Response
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc     Update course
// @route    PUT /api/v1/courses/:id
// @access   Private
exports.updateCourse = asyncHandler(async(req, res, next) => {
    // Find Course in Database by Id
    let course = await Course.findById(req.params.id);

    // No Course found with ID
    if (!course) {
        return next(
            new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
        );
    }

    // Update Course
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Response
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc     Delete course
// @route    DELETE /api/v1/courses/:id
// @access   Private
exports.deleteCourse = asyncHandler(async(req, res, next) => {
    // Find Course in Database by Id
    const course = await Course.findById(req.params.id);

    // No Course found with ID
    if (!course) {
        return next(
            new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
        );
    }

    // Delete Course
    await course.remove();

    // Response
    res.status(200).json({
        success: true,
        data: {}
    });
});