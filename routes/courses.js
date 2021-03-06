// Express
const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');
// Advanced Results for Pgination, Selecting, Filtering and Sorting ( Course )
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

// Pretected Routes
router.post('/', protect, authorize('publisher', 'admin'), addCourse);
router.put('/:id', protect, authorize('publisher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse);
// Routes
router.get(
    '/',
    advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }),
    getCourses
);
router.get('/:id', getCourse);

module.exports = router;