import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../utils/api';
import { ArrowLeft, CheckCircle, XCircle, Code, Target, Users, User, ClipboardList, AlertCircle, Pencil } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';
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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', domain: '', researchPapersLink: '' });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectAPI.getById(id);
      setProject(response.data.data);
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await projectAPI.approveProposal(id);
      toast.success('Project approved successfully');
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve project');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await projectAPI.rejectProposal(id, { reason: rejectionReason });
      toast.success('Project rejected');
      setShowRejectModal(false);
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject project');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm">
        <ClipboardList className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Project not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">Go Back</button>
      </div>
    );
  }

  const canApprove = ['guide', 'coordinator', 'admin'].includes(user.role) && project.phase === 'PROPOSAL' && project.proposalStatus === 'pending';

  // Leader can edit if proposal is pending or rejected
  const isLeader = user.role === 'student' && project.group?.leader === user.id;
  const canEdit = isLeader && (project.proposalStatus === 'pending' || project.proposalStatus === 'rejected');

  const handleOpenEdit = () => {
    setEditData({
      title: project.title || '',
      description: project.description || '',
      domain: project.domain || '',
      researchPapersLink: (project.researchPapers || []).join(', ')
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        title: editData.title,
        description: editData.description,
        domain: editData.domain,
        researchPapers: editData.researchPapersLink
          ? editData.researchPapersLink.split(',').map(l => l.trim())
          : []
      };
      await projectAPI.updateProposal(id, payload);
      toast.success(project.proposalStatus === 'rejected' ? 'Proposal resubmitted for review!' : 'Proposal updated successfully');
      setShowEditModal(false);
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update proposal');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group px-2 py-1"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Projects</span>
      </button>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-8 relative overflow-hidden">
        {/* Soft background glow based on status */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-10 ${
          project.proposalStatus === 'approved' ? 'bg-indigo-400' :
          project.phase === 'PROPOSAL' ? 'bg-amber-400' :
          project.phase === 'FINAL' ? 'bg-emerald-400' :
          project.proposalStatus === 'rejected' ? 'bg-red-400' : 'bg-violet-400'
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-slate-200/60">
          <div className="space-y-3 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
              {project.title}
            </h1>
            <div className="flex items-center space-x-3 text-slate-600 font-medium">
              <span className="px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
                Domain: <span className="text-indigo-600 font-semibold">{project.domain}</span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide uppercase border flex items-center ${
              project.proposalStatus === 'approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
              project.phase === 'PROPOSAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              project.phase === 'FINAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              project.proposalStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                project.proposalStatus === 'approved' ? 'bg-indigo-500' :
                project.phase === 'PROPOSAL' ? 'bg-amber-500' :
                project.phase === 'FINAL' ? 'bg-emerald-500' :
                project.proposalStatus === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              {(project.proposalStatus || project.phase || '').replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          {/* Description */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-indigo-600" />
              Description
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg bg-slate-50 p-6 rounded-xl border border-slate-100">
              {project.description}
            </p>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tech & Objectives */}
            <div className="space-y-8">
              {project.technologies?.length > 0 && (
                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-indigo-600" />
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {project.objectives?.length > 0 && (
                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-emerald-600" />
                    Objectives
                  </h3>
                  <ul className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {project.objectives.map((obj, index) => (
                      <li key={index} className="flex items-start text-slate-600">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 border border-emerald-200">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Team & Progress */}
            <div className="space-y-6">
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200/60 p-5 rounded-xl hover:border-indigo-200 transition-colors group shadow-sm">
                  <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-indigo-600" />
                    Project Group
                  </h3>
                  <p className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {project.group?.name || 'Unassigned'}
                  </p>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-xl hover:border-violet-200 transition-colors group shadow-sm">
                  <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-violet-600" />
                    Project Guide
                  </h3>
                  <p className="text-lg font-semibold text-slate-800 group-hover:text-violet-600 transition-colors truncate">
                    {project.guide?.name || 'Unassigned'}
                  </p>
                </div>
              </motion.div>

              {project.progressPercentage !== undefined && (
                <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="bg-white border border-slate-200/60 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Overall Progress</h3>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 border border-slate-200/60 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progressPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full"
                    />
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {project.rejectionReason && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 border border-red-200 rounded-xl p-5"
                  >
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Rejection Reason
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{project.rejectionReason}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          {canApprove && (
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="pt-8 mt-8 border-t border-slate-200/60 flex flex-wrap gap-4">
              <button
                onClick={handleApprove}
                className="flex items-center px-6 py-3 bg-emerald-600 text-white border border-emerald-700 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-bold shadow-button"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve Project
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-300 font-medium"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject
              </button>
            </motion.div>
          )}

          {/* Edit Proposal Button - for group leader */}
          {canEdit && (
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className={`${canApprove ? '' : 'pt-8 mt-8 border-t border-slate-200/60'} flex flex-wrap gap-4`}>
              <button
                onClick={handleOpenEdit}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-bold shadow-button"
              >
                <Pencil className="w-5 h-5 mr-2" />
                {project.proposalStatus === 'rejected' ? 'Revise & Resubmit Proposal' : 'Edit Proposal'}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
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
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-ambient"
            >
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold">Reject Project</h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                Please provide a detailed reason for rejecting this project proposal to help the students improve it.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason here..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none mb-6 resize-none h-32"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-button"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Proposal Modal */}
      <AnimatePresence>
        {showEditModal && (
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
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full shadow-ambient"
            >
              <div className="flex items-center text-indigo-600 mb-4">
                <Pencil className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold">
                  {project.proposalStatus === 'rejected' ? 'Revise & Resubmit' : 'Edit Proposal'}
                </h3>
              </div>
              {project.proposalStatus === 'rejected' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
                  Your proposal was rejected. Make the changes and resubmit — it will go back to "pending" for review.
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
                  <select
                    value={editData.domain}
                    onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Research Papers (comma separated links)</label>
                  <input
                    type="text"
                    value={editData.researchPapersLink}
                    onChange={(e) => setEditData({ ...editData, researchPapersLink: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                    placeholder="https://..., https://..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-button"
                >
                  {project.proposalStatus === 'rejected' ? 'Resubmit Proposal' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetails;
