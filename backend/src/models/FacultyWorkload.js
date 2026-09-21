const mongoose = require('mongoose');

const teachingItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      default: null,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    allocation: {
      type: String,
      default: null,
      trim: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const responsibilityItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: 'RESPONSIBILITY',
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    allocation: {
      type: String,
      default: null,
      trim: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const facultyWorkloadSchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: [true, 'Faculty ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    facultyName: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    teaching: {
      ugTheory1: { type: [teachingItemSchema], default: [] },
      ugTheory2: { type: [teachingItemSchema], default: [] },
      lab1: { type: [teachingItemSchema], default: [] },
      lab2: { type: [teachingItemSchema], default: [] },
      pg: { type: [teachingItemSchema], default: [] },
      others: { type: [teachingItemSchema], default: [] },
    },
    responsibilities: {
      type: [responsibilityItemSchema],
      default: [],
    },
    sourceTotalHours: {
      type: Number,
      default: null,
    },
    calculatedTeachingHours: {
      type: Number,
      required: true,
      default: 0,
    },
    calculatedResponsibilityHours: {
      type: Number,
      required: true,
      default: 0,
    },
    calculatedTotalHours: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['MATCHED', 'REVIEW REQUIRED', 'INCOMPLETE SOURCE DATA'],
      default: 'MATCHED',
      index: true,
    },
    isIncomplete: {
      type: Boolean,
      default: false,
    },
    incompleteReason: {
      type: String,
      default: null,
    },
    discrepancyNote: {
      type: String,
      default: null,
    },
    sourceVersion: {
      type: String,
      default: 'v1.0-master-register',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
facultyWorkloadSchema.index({ facultyId: 1, status: 1 });
facultyWorkloadSchema.index({ 'teaching.ugTheory1.courseCode': 1 });
facultyWorkloadSchema.index({ 'responsibilities.role': 1 });

module.exports = mongoose.model('FacultyWorkload', facultyWorkloadSchema);
