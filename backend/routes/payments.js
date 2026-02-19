const express = require('express');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments - create payment (simulated; integrate Stripe/Razorpay in production)
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, amount, transactionId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.isFree) return res.status(400).json({ success: false, message: 'Course is free' });

    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      amount: amount || course.price,
      status: 'completed',
      transactionId: transactionId || 'SIM-' + Date.now(),
      paidAt: new Date(),
    });
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/payments/me
router.get('/me', protect, async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, payments });
});

module.exports = router;
