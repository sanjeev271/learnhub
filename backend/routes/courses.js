const express = require('express');
const Course = require('../models/Course');
const { protect, role } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/courses - list courses (public: no login required; all users see same catalog)
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, sort = 'popularity' } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search && search.trim()) {
      const term = search.trim().replace(/\s+/g, ' ').split(' ').map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      filter.$or = [
        { title: new RegExp(term, 'i') },
        { description: new RegExp(term, 'i') },
      ];
    }

    let query = Course.find(filter).populate('instructor', 'name email');
    if (sort === 'popularity') query = query.sort({ enrollmentCount: -1 });
    if (sort === 'newest') query = query.sort({ createdAt: -1 });
    if (sort === 'rating') query = query.sort({ rating: -1 });

    const courses = await query.lean();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/courses/categories
router.get('/categories', async (req, res) => {
  const categories = await Course.distinct('category', { isPublished: true });
  res.json({ success: true, categories });
});

// @route   GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio')
      .lean();
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/courses - teacher/admin create course
router.post(
  '/',
  protect,
  role('teacher', 'admin'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

      const slug = req.body.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const course = await Course.create({
        ...req.body,
        slug,
        instructor: req.user._id,
        price: req.body.price ? Number(req.body.price) : 0,
        isFree: req.body.isFree !== false && !req.body.price,
        isPublished: true, // instructor-created courses always appear in catalog; they can unpublish from dashboard
      });
      res.status(201).json({ success: true, course });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// @route   PUT /api/courses/:id
router.put('/:id', protect, role('teacher', 'admin'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const allowed = ['title', 'description', 'shortDescription', 'category', 'difficulty', 'thumbnail', 'price', 'isFree', 'isPublished', 'sections'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) course[key] = req.body[key]; });
    await course.save();
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/courses/instructor/mine
router.get('/instructor/mine', protect, role('teacher', 'admin'), async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { instructor: req.user._id };
  const courses = await Course.find(query).populate('instructor', 'name email').sort({ createdAt: -1 }).lean();
  res.json({ success: true, courses });
});

module.exports = router;
