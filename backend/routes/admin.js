const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect, role } = require('../middleware/auth');

const router = express.Router();

router.use(protect, role('admin'));

// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  res.json({ success: true, users });
});

// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [userCount, courseCount, enrollmentCount] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
  ]);
  res.json({ success: true, stats: { userCount, courseCount, enrollmentCount } });
});

// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  ).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

// @route   PUT /api/admin/courses/:id/publish
router.put('/courses/:id/publish', async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { isPublished: req.body.isPublished !== false },
    { new: true }
  );
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, course });
});

module.exports = router;
