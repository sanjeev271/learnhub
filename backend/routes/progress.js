const express = require('express');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress/:enrollmentId
router.get('/:enrollmentId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      enrollment: req.params.enrollmentId,
      user: req.user._id,
    }).lean();
    if (!progress) return res.status(404).json({ success: false, message: 'Progress not found' });
    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/progress/:enrollmentId - update position and mark lesson complete
router.put('/:enrollmentId', protect, async (req, res) => {
  try {
    const { sectionIndex, lessonIndex, markComplete } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment || enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    let progress = await Progress.findOne({ enrollment: enrollment._id });
    if (!progress) {
      progress = await Progress.create({
        enrollment: enrollment._id,
        user: req.user._id,
        course: enrollment.course,
      });
    }

    if (typeof sectionIndex === 'number') progress.sectionIndex = sectionIndex;
    if (typeof lessonIndex === 'number') progress.lessonIndex = lessonIndex;
    progress.lastAccessedAt = new Date();

    if (markComplete && typeof sectionIndex === 'number' && typeof lessonIndex === 'number') {
      const exists = progress.completedLessons.some(
        (l) => l.sectionIndex === sectionIndex && l.lessonIndex === lessonIndex
      );
      if (!exists) {
        progress.completedLessons.push({
          sectionIndex,
          lessonIndex,
          completedAt: new Date(),
        });
      }
    }

    await progress.save();

    const course = await Course.findById(enrollment.course).lean();
    const totalLessons = course?.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
    const completedCount = progress.completedLessons.length;
    const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

    enrollment.progress = progressPercent;
    enrollment.lastAccessedAt = new Date();
    if (progressPercent >= 100) enrollment.status = 'completed';
    await enrollment.save();

    res.json({ success: true, progress, progressPercent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
