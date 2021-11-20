const express = require('express');
const router = express.Router({ mergeParams: true });
// Controllers
const { getReviews, getReview, addReview } = require('../controllers/reviews');
// Protect, role Authorization
const { protect, authorize } = require('../middleware/auth');
// Advanced Results for Pgination, Selecting, Filtering and Sorting ( Review )
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');

// Protected Routes
router.post('/', protect, authorize('user', 'admin'), addReview);
// Routes
router.get(
    '/',
    advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }),
    getReviews
);
router.get('/:id', getReview);

module.exports = router;