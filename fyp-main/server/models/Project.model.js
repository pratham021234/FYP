const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String, // Acts as abstract
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  researchPapers: [{
    title: String,
    url: String // Link to the paper
  }],
  phase: {
    type: String,
    enum: ['PROPOSAL', 'DEVELOPMENT', 'SEM1_EVAL', 'SEM2_CONT'],
    default: 'PROPOSAL'
  },
  proposalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for searching
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  domain: 'text'
});

module.exports = mongoose.model('Project', projectSchema);
