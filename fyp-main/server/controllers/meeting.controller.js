const Meeting = require('../models/Meeting.model');
const User = require('../models/User.model');
const Group = require('../models/Group.model');
const Project = require('../models/Project.model');

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, description, type, startTime, endTime, location, meetingLink, participants, group, project, notes } = req.body;

    // Validate time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check for conflicts
    const conflicts = await Meeting.find({
      organizer: req.user._id,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } },
      ],
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'You have a conflicting meeting at this time' });
    }

    const meeting = new Meeting({
      title,
      description,
      type,
      startTime,
      endTime,
      location,
      meetingLink,
      organizer: req.user._id,
      participants: participants?.map(p => ({ user: p, status: 'pending' })) || [],
      group,
      project,
      notes,
    });

    await meeting.save();
    await meeting.populate('organizer', 'name email role');
    await meeting.populate('participants.user', 'name email role');
    await meeting.populate('group', 'name');
    await meeting.populate('project', 'title');

    res.status(201).json({ message: 'Meeting created successfully', data: meeting });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const { startDate, endDate, type, status, group, project } = req.query;
    const query = {};

    // Filter by date range
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    if (type) query.type = type;
    if (status) query.status = status;
    if (group) query.group = group;
    if (project) query.project = project;

    // Filter based on user role
    if (req.user.role === 'student') {
      query.$or = [
        { organizer: req.user._id },
        { 'participants.user': req.user._id },
      ];
    } else if (req.user.role === 'guide') {
      query.$or = [
        { organizer: req.user._id },
        { 'participants.user': req.user._id },
      ];
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'name email role')
      .populate('participants.user', 'name email role')
      .populate('group', 'name')
      .populate('project', 'title')
      .sort({ startTime: 1 });

    res.json({ data: meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'name email role')
      .populate('participants.user', 'name email role')
      .populate('group', 'name members')
      .populate('project', 'title description');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check access
    const isOrganizer = meeting.organizer._id.toString() === req.user._id;
    const isParticipant = meeting.participants.some(p => p.user._id.toString() === req.user._id);
    const isAdmin = ['admin', 'coordinator'].includes(req.user.role);

    if (!isOrganizer && !isParticipant && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ data: meeting });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is organizer or admin
    const isOrganizer = meeting.organizer.toString() === req.user._id;
    const isAdmin = ['admin', 'coordinator'].includes(req.user.role);

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({ message: 'Only organizer or admin can update meeting' });
    }

    const { title, description, type, startTime, endTime, location, meetingLink, participants, status, notes } = req.body;

    // Validate time if being updated
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check for conflicts if time is being changed
    if (startTime || endTime) {
      const newStartTime = startTime ? new Date(startTime) : meeting.startTime;
      const newEndTime = endTime ? new Date(endTime) : meeting.endTime;

      const conflicts = await Meeting.find({
        _id: { $ne: meeting._id },
        organizer: req.user._id,
        status: { $ne: 'cancelled' },
        $or: [
          { startTime: { $lt: newEndTime, $gte: newStartTime } },
          { endTime: { $gt: newStartTime, $lte: newEndTime } },
          { startTime: { $lte: newStartTime }, endTime: { $gte: newEndTime } },
        ],
      });

      if (conflicts.length > 0) {
        return res.status(400).json({ message: 'You have a conflicting meeting at this time' });
      }
    }

    if (title) meeting.title = title;
    if (description !== undefined) meeting.description = description;
    if (type) meeting.type = type;
    if (startTime) meeting.startTime = startTime;
    if (endTime) meeting.endTime = endTime;
    if (location !== undefined) meeting.location = location;
    if (meetingLink !== undefined) meeting.meetingLink = meetingLink;
    if (participants) meeting.participants = participants.map(p => ({ user: p, status: 'pending' }));
    if (status) meeting.status = status;
    if (notes !== undefined) meeting.notes = notes;

    await meeting.save();
    await meeting.populate('organizer', 'name email role');
    await meeting.populate('participants.user', 'name email role');
    await meeting.populate('group', 'name');
    await meeting.populate('project', 'title');

    res.json({ message: 'Meeting updated successfully', data: meeting });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update participant status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const participant = meeting.participants.find(p => p.user.toString() === req.user._id);

    if (!participant) {
      return res.status(403).json({ message: 'You are not a participant of this meeting' });
    }

    participant.status = status;
    await meeting.save();

    res.json({ message: 'Status updated successfully', data: meeting });
  } catch (error) {
    console.error('Update participant status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is organizer or admin
    const isOrganizer = meeting.organizer.toString() === req.user._id;
    const isAdmin = ['admin', 'coordinator'].includes(req.user.role);

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({ message: 'Only organizer or admin can delete meeting' });
    }

    await meeting.deleteOne();

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get upcoming meetings
exports.getUpcomingMeetings = async (req, res) => {
  try {
    const query = {
      startTime: { $gte: new Date() },
      status: { $in: ['scheduled', 'ongoing'] },
    };

    // Filter based on user role
    if (req.user.role === 'student') {
      query.$or = [
        { organizer: req.user._id },
        { 'participants.user': req.user._id },
      ];
    } else if (req.user.role === 'guide') {
      query.$or = [
        { organizer: req.user._id },
        { 'participants.user': req.user._id },
      ];
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'name email role')
      .populate('participants.user', 'name email role')
      .populate('group', 'name')
      .populate('project', 'title')
      .sort({ startTime: 1 })
      .limit(10);

    res.json({ data: meetings });
  } catch (error) {
    console.error('Get upcoming meetings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
