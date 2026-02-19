const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// @route   GET /api/stats - public stats for landing page (no auth required)
router.get('/', async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalInstructors] = await Promise.all([
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
    ]);
    res.json({
      success: true,
      totalCourses,
      totalStudents,
      totalInstructors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
