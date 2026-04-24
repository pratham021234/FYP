import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupAPI, userAPI } from '../utils/api';
import { ArrowLeft, UserMinus, UserPlus, UserX, Crown, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState('');

  useEffect(() => {
    loadGroup();
    if (user?.role === 'coordinator' || user?.role === 'admin') {
      loadGuides();
    }
  }, [id, user]);

  const loadGuides = async () => {
    try {
      const res = await userAPI.getGuides();
      setAvailableGuides(res.data.data);
    } catch (error) {
      console.error('Failed to fetch guides', error);
    }
  };

  const loadGroup = async () => {
    try {
      const response = await groupAPI.getById(id);
      setGroup(response.data.data);
    } catch (error) {
      console.error('Failed to load group:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLeader = () => {
    const leaderId = group?.leader?._id || group?.leader;
    const firstMemberId = group?.members?.[0]?._id || group?.members?.[0];
    const userId = user?.id || user?._id;
    return leaderId === userId || firstMemberId === userId;
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      return;
    }
    try {
      await groupAPI.removeMember(id, memberId);
      toast.success(`${memberName} has been removed from the group`);
      loadGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('⚠️ WARNING: Are you sure you want to DELETE this entire group?\n\nThis will:\n- Remove ALL members from the group\n- Delete all group data\n- Remove access to group chat and files\n\nThis action CANNOT be undone!')) {
      return;
    }
    if (!window.confirm('Final confirmation: Type YES in your mind and click OK to permanently delete this group.')) {
      return;
    }
    try {
      await groupAPI.delete(id);
      toast.success('Group deleted successfully');
      navigate('/app/groups');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  const handleAssignGuide = async () => {
    if (!selectedGuideId) return toast.error('Please select a guide first');
    try {
      await groupAPI.assignGuide({ groupId: id, guideId: selectedGuideId });
      toast.success('Guide assigned successfully');
      loadGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign guide');
    }
  };

  const handleApproveRequest = async (userId, userName) => {
    try {
      await groupAPI.approveRequest(id, userId);
      toast.success(`${userName} has been added to the group`);
      loadGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (userId, userName) => {
    try {
      await groupAPI.rejectRequest(id, userId);
      toast.success(`Request from ${userName} has been declined`);
      loadGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!group) {
    return <div className="text-center p-8 text-slate-400">Group not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
        
        {isLeader() && (
          <button
            onClick={handleDeleteGroup}
            className="flex items-center px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold transition-colors shadow-button"
            title="Delete this group permanently"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Entire Group
          </button>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-800">{group.name}</h1>
          {isLeader() && (
            <span className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
              <Crown className="w-4 h-4 mr-1" />
              Group Leader
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-1">Department</h3>
              <p className="text-slate-600">{group.department}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-1">Year</h3>
              <p className="text-slate-600">{group.year}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">
                Members ({group.members?.length}/{group.maxMembers})
              </h3>
              {isLeader() && (
                <div className="flex items-center text-sm text-indigo-600">
                  <Crown className="w-4 h-4 mr-1" />
                  <span className="font-medium">You are the leader</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {group.members?.map((member, index) => {
                const memberId = member._id || member;
                const leaderId = group.leader?._id || group.leader;
                const userId = user?.id || user?._id;
                const isMemberLeader = (leaderId === memberId) || (index === 0);
                const canRemove = isLeader() && !isMemberLeader && memberId !== userId;
                
                return (
                  <div key={member._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50/30 transition-colors border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-800">{member.name}</p>
                          {member._id === user?.id && (
                            <span className="text-xs text-emerald-600 font-medium">(You)</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{member.email}</p>
                        {member.rollNumber && (
                          <p className="text-xs text-slate-400">Roll: {member.rollNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isMemberLeader && (
                        <span className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                          <Crown className="w-3 h-3 mr-1" />
                          Leader
                        </span>
                      )}
                      {!isMemberLeader && memberId !== userId && isLeader() && (
                        <button
                          onClick={() => handleRemoveMember(memberId, member.name)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-bold transition-all shadow-button"
                          title="Remove this member from the group"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {isLeader() && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-indigo-800">
                    <p className="font-medium">Leader Privileges</p>
                    <p className="text-indigo-600 mt-1">
                      As the group leader, you can remove members from the group. 
                      The leader role cannot be transferred or removed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Join Requests Section - visible to leader only */}
          {isLeader() && group.joinRequests?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-amber-600" />
                Pending Join Requests ({group.joinRequests.length})
              </h3>
              <div className="space-y-2">
                {group.joinRequests.map((request) => {
                  const reqUser = request.user;
                  if (!reqUser || typeof reqUser === 'string') return null;
                  return (
                    <div key={reqUser._id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100/60 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {reqUser.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{reqUser.name}</p>
                          <p className="text-sm text-slate-500">{reqUser.email}</p>
                          {reqUser.rollNumber && (
                            <p className="text-xs text-slate-400">Roll: {reqUser.rollNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveRequest(reqUser._id, reqUser.name)}
                          className="flex items-center px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-sm font-bold transition-all shadow-sm"
                          title="Approve this join request"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(reqUser._id, reqUser.name)}
                          className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-sm font-bold transition-all"
                          title="Decline this join request"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {group.guide ? (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Guide</h3>
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{group.guide.name}</p>
                  <p className="text-sm text-slate-500">{group.guide.email}</p>
                </div>
                {['coordinator', 'admin'].includes(user?.role) && (
                  <span className="text-xs text-violet-600 bg-violet-100 px-2 py-1 rounded border border-violet-200">Assigned</span>
                )}
              </div>
            </div>
          ) : (
            ['coordinator', 'admin'].includes(user?.role) && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Assign Guide</h3>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
                  <select
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
                    value={selectedGuideId}
                    onChange={(e) => setSelectedGuideId(e.target.value)}
                  >
                    <option value="">Select a guide...</option>
                    {availableGuides.map(g => (
                      <option key={g._id} value={g._id}>{g.name} ({g.department})</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignGuide}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow font-medium"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )
          )}

          {group.project && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Project</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-medium text-slate-800">{group.project.title}</p>
                <p className="text-sm text-slate-500 mt-1">{group.project.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupDetails;
