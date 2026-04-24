import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupAPI } from '../utils/api';
import { Plus, Users as UsersIcon, Trash2, LogOut, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', maxMembers: 4, department: 'Computer Engineering', year: 4 });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data.data);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await groupAPI.create(formData);
      toast.success('Group created successfully');
      setShowCreateModal(false);
      loadGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupAPI.join(groupId);
      toast.success('Join request sent! Waiting for leader approval.');
      loadGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send join request');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this group? You will lose access to group chat and files.')) {
      return;
    }
    try {
      await groupAPI.leave(groupId);
      toast.success('Left group successfully');
      loadGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to leave group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone and will remove all members.')) {
      return;
    }
    try {
      await groupAPI.delete(groupId);
      toast.success('Group deleted successfully');
      loadGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  const isUserInGroup = (group) => {
    return group.members?.some(member => member._id === user.id);
  };

  const isGroupCreator = (group) => {
    return group.members?.[0]?._id === user.id;
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-indigo-600" />
            Project Groups
          </h1>
          <p className="text-slate-500 mt-1">Collaborate and manage project teams</p>
        </div>
        {user.role === 'student' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-medium transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Group
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, i) => (
          <motion.div 
            key={group._id} 
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`bg-white/70 backdrop-blur-md border rounded-2xl p-6 relative overflow-hidden group/card hover:-translate-y-1 transition-all duration-300 shadow-sm ${isUserInGroup(group) ? 'border-indigo-300 shadow-card-hover' : 'border-slate-200/60 hover:border-indigo-200 hover:shadow-card-hover'}`}
          >
            {isUserInGroup(group) && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/40 rounded-full blur-[40px] pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-xl text-slate-800 mb-1 leading-tight group-hover/card:text-indigo-600 transition-colors">{group.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">{group.department}</span>
                  <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">Year {group.year}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isUserInGroup(group) ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                <UsersIcon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">Capacity</span>
                  <span className="text-slate-700 font-bold">{group.members?.length} <span className="text-slate-400 font-normal">/ {group.maxMembers}</span></span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${group.members?.length === group.maxMembers ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'}`}
                    style={{ width: `${(group.members?.length / group.maxMembers) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex -space-x-2 overflow-hidden">
                  {group.members?.slice(0, 5).map((member, idx) => (
                    <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm" title={member.name}>
                      {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  ))}
                  {(group.members?.length || 0) > 5 && (
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {group.guide && (
                <div className="flex items-center p-3 bg-violet-50 border border-violet-100 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-violet-600 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-violet-500 font-medium uppercase tracking-wider mb-0.5">Project Guide</p>
                    <p className="text-sm font-semibold text-violet-700 truncate">{group.guide.name}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Link
                  to={`/app/groups/${group._id}`}
                  className={`flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isUserInGroup(group) ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-button' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'}`}
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                
                {user.role === 'student' && (
                  <>
                    {!isUserInGroup(group) && group.members?.length < group.maxMembers && (
                      <button
                        onClick={() => handleJoinGroup(group._id)}
                        className="w-full px-4 py-2.5 border-2 border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 text-sm font-bold transition-all"
                      >
                        Request to Join
                      </button>
                    )}
                    
                    {isUserInGroup(group) && !isGroupCreator(group) && (
                      <button
                        onClick={() => handleLeaveGroup(group._id)}
                        className="w-full px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 text-sm font-semibold flex items-center justify-center transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Leave Group
                      </button>
                    )}
                    
                    {isGroupCreator(group) && (
                      <button
                        onClick={() => handleDeleteGroup(group._id)}
                        className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 text-sm font-semibold flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Group
                      </button>
                    )}
                    
                    {isUserInGroup(group) && (
                      <div className="flex items-center justify-center pt-2">
                        <div className="flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                            {isGroupCreator(group) ? 'Group Creator' : 'Group Member'}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {groups.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <UsersIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Groups Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Get started by creating a new group for your academic project team.</p>
        </motion.div>
      )}

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-ambient relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-[40px] pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Create New Group</h3>
                <p className="text-slate-500 text-sm mb-6">Set up a workspace for your project team.</p>
                
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Group Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                      placeholder="e.g. Innovators Team Alpha"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                      >
                        <option value="Computer Engineering">Computer</option>
                        <option value="IT Engineering">IT</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Year
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                      >
                        <option value={4}>BE (Final Year)</option>
                        <option value={3}>TE (Third Year)</option>
                        <option value={2}>SE (Second Year)</option>
                        <option value={1}>FE (First Year)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                      <span>Max Members</span>
                      <span className="text-indigo-600 font-bold">{formData.maxMembers}</span>
                    </label>
                    <input
                      type="range"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      min="1"
                      max="6"
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-bold flex items-center justify-center group transition-all"
                    >
                      Create
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Groups;
