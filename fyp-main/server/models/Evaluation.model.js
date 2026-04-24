const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
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
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['proposal', 'mid_term', 'final', 'presentation', 'report'],
    required: true
  },
  criteria: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    maxScore: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxTotalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  comments: {
    type: String
  },
  strengths: [{
    type: String
  }],
  improvements: [{
    type: String
  }],
  evaluationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
evaluationSchema.pre('save', function(next) {
  if (this.totalScore && this.maxTotalScore) {
    this.percentage = (this.totalScore / this.maxTotalScore) * 100;
    
    // Assign grade based on percentage
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 85) this.grade = 'A';
    else if (this.percentage >= 80) this.grade = 'B+';
    else if (this.percentage >= 70) this.grade = 'B';
    else if (this.percentage >= 60) this.grade = 'C+';
    else if (this.percentage >= 50) this.grade = 'C';
    else if (this.percentage >= 40) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
