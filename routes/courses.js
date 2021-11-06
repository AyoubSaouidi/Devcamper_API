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

// Routes
router.get('/', getCourses);
router.post('/', addCourse);
router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;