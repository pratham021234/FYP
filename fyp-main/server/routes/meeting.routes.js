const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Create meeting (guide, coordinator, admin)
router.post('/', authorize('guide', 'coordinator', 'admin'), meetingController.createMeeting);

// Get all meetings
router.get('/', meetingController.getAllMeetings);

// Get upcoming meetings (must be before /:id)
router.get('/upcoming', meetingController.getUpcomingMeetings);

// Get meeting by ID (must come after all static paths)
router.get('/:id', meetingController.getMeetingById);

// Update meeting (organizer or admin)
router.put('/:id', meetingController.updateMeeting);

// Update participant status
router.put('/:id/status', meetingController.updateParticipantStatus);

// Delete meeting (organizer or admin)
router.delete('/:id', meetingController.deleteMeeting);

module.exports = router;
