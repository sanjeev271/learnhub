const express = require('express');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments - enroll in course
router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled' });

    if (!course.isFree && course.price > 0) {
      const paid = await Payment.findOne({ user: req.user._id, course: courseId, status: 'completed' });
      if (!paid) return res.status(402).json({ success: false, message: 'Payment required' });
    }

    const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
    await Progress.create({
      enrollment: enrollment._id,
      user: req.user._id,
      course: courseId,
    });
    course.enrollmentCount += 1;
    await course.save();

    const populated = await Enrollment.findById(enrollment._id)
      .populate('course', 'title thumbnail')
      .populate('user', 'name email');
    res.status(201).json({ success: true, enrollment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/enrollments/me - include full course with sections so Learning page has lessons
router.get('/me', protect, async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course') // full course including sections & lessons for learning page
    .sort({ enrolledAt: -1 })
    .lean();
  res.json({ success: true, enrollments });
});

// @route   GET /api/enrollments/check/:courseId
router.get('/check/:courseId', protect, async (req, res) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId,
  }).populate('course');
  res.json({ success: true, enrolled: !!enrollment, enrollment: enrollment || null });
});

module.exports = router;
