const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseType: {
      type: String,
      enum: ['THEORY', 'LAB', 'SAS', 'OTHERS', 'PROJECT'],
      default: 'THEORY',
    },
    category: {
      type: String,
      default: 'Professional Core',
      trim: true,
    },
    credits: {
      type: Number,
      default: 3,
      min: 0,
    },
    academicYear: {
      type: String,
      default: '2026-27',
      trim: true,
    },
    semester: {
      type: String,
      default: 'Odd Semester',
      trim: true,
    },
    department: {
      type: String,
      default: 'CSE',
      trim: true,
    },
    isLab: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ courseCode: 1, department: 1, academicYear: 1 });

module.exports = mongoose.model('Course', courseSchema);
