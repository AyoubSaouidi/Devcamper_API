const express = require('express');
const router = express.Router({ mergeParams: true });
// Controllers
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');
// Protect, role Authorization
const { protect, authorize } = require('../middleware/auth');
// Advanced Results for Pgination, Selecting, Filtering and Sorting ( Review )
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');

// Protected Routes
router.post('/', protect, authorize('user', 'admin'), addReview);
router.put('/:id', protect, authorize('user', 'admin'), updateReview);
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);
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