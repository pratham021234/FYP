import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { meetingAPI, userAPI, groupAPI, projectAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Video,
  Users,
  FolderKanban,
  X,
  Edit2,
  Trash2,
  Check,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const Schedule = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'discussion',
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: '',
    participants: [],
    group: '',
    project: '',
    notes: '',
  });

  useEffect(() => {
    loadMeetings();
    loadUsers();
    loadGroups();
    loadProjects();
  }, [currentMonth]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      
      const response = await meetingAPI.getAll({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setMeetings(response.data.data);
    } catch (error) {
      console.error('Failed to load meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data.data || []);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreateMeeting = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      type: 'discussion',
      startTime: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(addDays(selectedDate, 0), "yyyy-MM-dd'T'HH:mm"),
      location: '',
      meetingLink: '',
      participants: [],
      group: '',
      project: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEditMeeting = (meeting) => {
    setModalMode('edit');
    setSelectedMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      type: meeting.type,
      startTime: format(parseISO(meeting.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(parseISO(meeting.endTime), "yyyy-MM-dd'T'HH:mm"),
      location: meeting.location || '',
      meetingLink: meeting.meetingLink || '',
      participants: meeting.participants.map(p => p.user._id),
      group: meeting.group?._id || '',
      project: meeting.project?._id || '',
      notes: meeting.notes || '',
    });
    setShowModal(true);
  };

  const handleViewMeeting = (meeting) => {
    setModalMode('view');
    setSelectedMeeting(meeting);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        await meetingAPI.create(formData);
        toast.success('Meeting created successfully');
      } else if (modalMode === 'edit') {
        await meetingAPI.update(selectedMeeting._id, formData);
        toast.success('Meeting updated successfully');
      }
      
      setShowModal(false);
      loadMeetings();
    } catch (error) {
      console.error('Failed to save meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to save meeting');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    
    try {
      await meetingAPI.delete(id);
      toast.success('Meeting deleted successfully');
      setShowModal(false);
      loadMeetings();
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      toast.error('Failed to delete meeting');
    }
  };

  const handleUpdateStatus = async (meetingId, status) => {
    try {
      await meetingAPI.updateStatus(meetingId, status);
      toast.success(`Meeting ${status}`);
      loadMeetings();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const renderCalendarHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {['guide', 'coordinator', 'admin'].includes(user?.role) && (
          <button
            onClick={handleCreateMeeting}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule Meeting
          </button>
        )}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-200 rounded-t-lg overflow-hidden">
        {days.map((day) => (
          <div
            key={day}
            className="bg-slate-50 py-3 text-center text-sm font-semibold text-slate-600"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const getMeetingsForDate = (date) => {
    return meetings.filter((meeting) =>
      isSameDay(parseISO(meeting.startTime), date)
    );
  };

  const renderCalendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayMeetings = getMeetingsForDate(currentDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day}
            onClick={() => setSelectedDate(currentDay)}
            className={`min-h-[120px] bg-white p-2 cursor-pointer transition-colors ${
              !isCurrentMonth ? 'bg-slate-50 text-slate-400' : ''
            } ${isSelected ? 'ring-2 ring-indigo-500' : ''} hover:bg-slate-50`}
          >
            <div
              className={`text-sm font-medium mb-1 ${
                isToday ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''
              }`}
            >
              {format(currentDay, 'd')}
            </div>
            <div className="space-y-1">
              {dayMeetings.slice(0, 3).map((meeting) => (
                <div
                  key={meeting._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMeeting(meeting);
                  }}
                  className={`text-xs p-1 rounded truncate ${
                    meeting.type === 'project_review'
                      ? 'bg-blue-100 text-blue-800'
                      : meeting.type === 'presentation'
                      ? 'bg-purple-100 text-purple-800'
                      : meeting.type === 'evaluation'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {format(parseISO(meeting.startTime), 'HH:mm')} {meeting.title}
                </div>
              ))}
              {dayMeetings.length > 3 && (
                <div className="text-xs text-slate-400 pl-1">
                  +{dayMeetings.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-px bg-slate-100">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="border-x border-b border-slate-200 rounded-b-lg overflow-hidden">{rows}</div>;
  };

  const renderMeetingModal = () => {
    if (!showModal) return null;

    if (modalMode === 'view' && selectedMeeting) {
      const isOrganizer = selectedMeeting.organizer._id === user?.id;
      const participant = selectedMeeting.participants.find(p => p.user._id === user?.id);
      const canEdit = isOrganizer || ['admin', 'coordinator'].includes(user?.role);

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800">{selectedMeeting.title}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                    selectedMeeting.type === 'project_review'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedMeeting.type === 'presentation'
                      ? 'bg-purple-100 text-purple-800'
                      : selectedMeeting.type === 'evaluation'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedMeeting.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedMeeting.description && (
                <div>
                  <p className="text-slate-600">{selectedMeeting.description}</p>
                </div>
              )}

              <div className="flex items-center text-slate-600">
                <Clock className="w-5 h-5 mr-3 text-slate-400" />
                <div>
                  <div className="font-medium">
                    {format(parseISO(selectedMeeting.startTime), 'PPP')}
                  </div>
                  <div className="text-sm text-slate-400">
                    {format(parseISO(selectedMeeting.startTime), 'p')} - {format(parseISO(selectedMeeting.endTime), 'p')}
                  </div>
                </div>
              </div>

              {selectedMeeting.location && (
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                  <span>{selectedMeeting.location}</span>
                </div>
              )}

              {selectedMeeting.meetingLink && (
                <div className="flex items-center text-slate-600">
                  <Video className="w-5 h-5 mr-3 text-slate-400" />
                  <a
                    href={selectedMeeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              {selectedMeeting.group && (
                <div className="flex items-center text-slate-600">
                  <Users className="w-5 h-5 mr-3 text-slate-400" />
                  <span>Group: {selectedMeeting.group.name}</span>
                </div>
              )}

              {selectedMeeting.project && (
                <div className="flex items-center text-slate-600">
                  <FolderKanban className="w-5 h-5 mr-3 text-slate-400" />
                  <span>Project: {selectedMeeting.project.title}</span>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Organizer</h4>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <span className="text-indigo-700 font-semibold text-sm">
                      {selectedMeeting.organizer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{selectedMeeting.organizer.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{selectedMeeting.organizer.role}</div>
                  </div>
                </div>
              </div>

              {selectedMeeting.participants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Participants</h4>
                  <div className="space-y-2">
                    {selectedMeeting.participants.map((p) => (
                      <div key={p.user._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-2">
                            <span className="text-slate-600 font-semibold text-sm">
                              {p.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{p.user.name}</div>
                            <div className="text-xs text-slate-400 capitalize">{p.user.role}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          p.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMeeting.notes && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Notes</h4>
                  <p className="text-slate-600 text-sm">{selectedMeeting.notes}</p>
                </div>
              )}

              {participant && participant.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateStatus(selectedMeeting._id, 'accepted')}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMeeting._id, 'declined')}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Decline
                  </button>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() => handleDeleteMeeting(selectedMeeting._id)}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
                <button
                  onClick={() => handleEditMeeting(selectedMeeting)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                {modalMode === 'create' ? 'Schedule New Meeting' : 'Edit Meeting'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="discussion">Discussion</option>
                <option value="project_review">Project Review</option>
                <option value="presentation">Presentation</option>
                <option value="evaluation">Evaluation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Room 101, Building A"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Meeting Link
              </label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Participants
              </label>
              <select
                multiple
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: Array.from(e.target.selectedOptions, option => option.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                size="5"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Group (Optional)
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a group</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Project (Optional)
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Additional notes or agenda"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {modalMode === 'create' ? 'Schedule Meeting' : 'Update Meeting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderUpcomingMeetings = () => {
    const upcomingMeetings = meetings
      .filter(m => new Date(m.startTime) >= new Date())
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);

    if (upcomingMeetings.length === 0) {
      return (
        <div className="text-center py-8 text-slate-400">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p>No upcoming meetings</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {upcomingMeetings.map((meeting) => (
          <div
            key={meeting._id}
            onClick={() => handleViewMeeting(meeting)}
            className="p-4 border border-slate-200 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800">{meeting.title}</h4>
                <div className="flex items-center text-sm text-slate-400 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(parseISO(meeting.startTime), 'PPp')}
                </div>
                {meeting.location && (
                  <div className="flex items-center text-sm text-slate-400 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {meeting.location}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                meeting.type === 'project_review'
                  ? 'bg-blue-100 text-blue-800'
                  : meeting.type === 'presentation'
                  ? 'bg-purple-100 text-purple-800'
                  : meeting.type === 'evaluation'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {meeting.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Schedule & Meetings</h1>
          <p className="text-slate-500 mt-1">Manage your meetings and deadlines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderCalendarHeader()}
            {renderCalendarDays()}
            {renderCalendarCells()}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Meetings</h3>
            {renderUpcomingMeetings()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                <span className="text-sm text-slate-600">Project Review</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 rounded mr-2"></div>
                <span className="text-sm text-slate-600">Presentation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
                <span className="text-sm text-slate-600">Evaluation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                <span className="text-sm text-slate-600">Discussion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderMeetingModal()}
    </div>
  );
};

export default Schedule;
