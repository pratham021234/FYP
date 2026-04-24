const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'project_approved',
      'project_rejected',
      'proposal_approved',
      'proposal_rejected',
      'project_proposal',
      'report_submitted',
      'report_reviewed',
      'evaluation_added',
      'group_invitation',
      'group_removal',
      'guide_assigned',
      'deadline_reminder',
      'meeting_scheduled',
      'message_received',
      'general'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  relatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  relatedGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
