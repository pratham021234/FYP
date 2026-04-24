const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['project_review', 'presentation', 'discussion', 'evaluation', 'other'],
      default: 'discussion',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined'],
          default: 'pending',
        },
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
    reminders: [
      {
        time: Date,
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
meetingSchema.index({ startTime: 1, endTime: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ 'participants.user': 1 });
meetingSchema.index({ status: 1 });

// Virtual for duration
meetingSchema.virtual('duration').get(function () {
  return this.endTime - this.startTime;
});

module.exports = mongoose.model('Meeting', meetingSchema);
