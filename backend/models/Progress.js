const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sectionIndex: { type: Number, default: 0 },
  lessonIndex: { type: Number, default: 0 },
  completedLessons: [{
    sectionIndex: Number,
    lessonIndex: Number,
    completedAt: Date,
  }],
  lastAccessedAt: { type: Date, default: Date.now },
}, { timestamps: true });

progressSchema.index({ enrollment: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
