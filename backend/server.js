require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require('./routes/progress');
const paymentRoutes = require('./routes/payments');
const certificateRoutes = require('./routes/certificates');
const discussionRoutes = require('./routes/discussions');
const adminRoutes = require('./routes/admin');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes);

// Public stats for landing page (must be before any catch-all)
app.get('/api/stats', async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalInstructors] = await Promise.all([
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
    ]);
    res.json({ success: true, totalCourses, totalStudents, totalInstructors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ success: true, message: 'LearnHub API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
