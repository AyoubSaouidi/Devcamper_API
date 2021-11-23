// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

// @desc     Get reviews
// @route    GET /api/v1/reviews
// @route    GET /api/v1/bootcamps/:bootcampId/reviews
// @access   Public
exports.getReviews = asyncHandler(async(req, res, next) => {
    // Check if bootcampId in params
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        // Response
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }

    // If no bootcampId
    res.status(200).json(res.advancedResults);
});

// @desc     Get single review
// @route    GET /api/v1/reviews/:id
// @access   Public
exports.getReview = asyncHandler(async(req, res, next) => {
    // Fetch Review from Database by ID
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    // No Review found
    if (!review) {
        return next(
            new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
        );
    }

    // Response
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc     Add new review
// @route    POST /api/v1/:bootcampId/review
// @access   Private
exports.addReview = asyncHandler(async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

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

    // Create new Review
    const review = await Review.create(req.body);

    // Response
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc     Update review
// @route    PUT /api/v1/reviews/:id
// @access   Private
exports.updateReview = asyncHandler(async(req, res, next) => {
    // Find Review in Database by Id
    let review = await Review.findById(req.params.id);

    // No Review found with ID
    if (!review) {
        return next(
            new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure that the User owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this review`,
                401
            )
        );
    }

    // Update Review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Response
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc     Delete review
// @route    DELETE /api/v1/reviews/:id
// @access   Private
exports.deleteReview = asyncHandler(async(req, res, next) => {
    // Find Review in Database by Id
    const review = await Review.findById(req.params.id);

    // No Review found with ID
    if (!review) {
        return next(
            new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure that the User owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this review`,
                401
            )
        );
    }

    // Delete Review
    await review.remove();

    // Response
    res.status(200).json({
        success: true,
        data: {}
    });
});