// Express
const express = require('express');
const router = express.Router({ mergeParams: true });
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

// Routes
router.get(
    '/',
    advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }),
    getCourses
);
router.post('/', addCourse);
router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;