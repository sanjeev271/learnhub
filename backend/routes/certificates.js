const express = require('express');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

const router = express.Router();

function generateCertificateId() {
  return 'LHB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// @route   POST /api/certificates - issue certificate (when course completed)
router.post('/', protect, async (req, res) => {
  try {
    const { enrollmentId, score } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId).populate('course');
    if (!enrollment || enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    if (enrollment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Complete all lessons first' });
    }
    const totalLessons = enrollment.course?.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
    if (totalLessons === 0) {
      return res.status(400).json({ success: false, message: 'This course has no lessons. Certificate is available after the instructor adds content and you complete it.' });
    }

    let cert = await Certificate.findOne({ user: req.user._id, course: enrollment.course._id });
    if (cert) return res.json({ success: true, certificate: cert });

    cert = await Certificate.create({
      user: req.user._id,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      certificateId: generateCertificateId(),
      score: score ?? null,
    });
    const populated = await Certificate.findById(cert._id)
      .populate('course', 'title')
      .populate('user', 'name email');
    res.status(201).json({ success: true, certificate: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/certificates/me
router.get('/me', protect, async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id })
    .populate('course', 'title thumbnail')
    .sort({ issuedAt: -1 })
    .lean();
  res.json({ success: true, certificates });
});

// @route   GET /api/certificates/verify/:certificateId
router.get('/verify/:certificateId', async (req, res) => {
  const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
    .populate('course', 'title')
    .populate('user', 'name email')
    .lean();
  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
  res.json({ success: true, certificate: cert });
});

module.exports = router;
