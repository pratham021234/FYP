const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['proposal_doc', 'monthly_ftr', 'semester_report', 'semester_presentation'],
    required: true
  },
  documentUrl: {
    type: String // URL or path of uploaded file
  },
  originalFileName: {
    type: String // Original filename of uploaded file
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'graded', 'returned'],
    default: 'pending'
  },
  dueDate: {
    type: Date // Manually set by Coordinator for FTRs/Final Reports
  },
  submittedAt: {
    type: Date
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Guide / Coordinator grading
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  comments: {
    type: String
  },
  // Digital Attendance specifically for FTRs
  attendance: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isPresent: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Deliverable', deliverableSchema);
