const express = require('express');
const Discussion = require('../models/Discussion');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/discussions/course/:courseId
router.get('/course/:courseId', async (req, res) => {
  const discussions = await Discussion.find({ course: req.params.courseId })
    .populate('user', 'name email')
    .populate('replies.user', 'name email')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, discussions });
});

// @route   POST /api/discussions
router.post(
  '/',
  protect,
  [body('course').notEmpty(), body('title').trim().notEmpty(), body('content').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const discussion = await Discussion.create({
      ...req.body,
      user: req.user._id,
    });
    const populated = await Discussion.findById(discussion._id).populate('user', 'name email').lean();
    res.status(201).json({ success: true, discussion: populated });
  }
);

// @route   POST /api/discussions/:id/reply
router.post(
  '/:id/reply',
  protect,
  body('content').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });
    discussion.replies.push({ user: req.user._id, content: req.body.content });
    await discussion.save();
    const populated = await Discussion.findById(discussion._id)
      .populate('user', 'name email')
      .populate('replies.user', 'name email')
      .lean();
    res.json({ success: true, discussion: populated });
  }
);

module.exports = router;
