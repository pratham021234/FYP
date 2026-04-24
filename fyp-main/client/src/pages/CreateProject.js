import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FolderKanban, ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    researchPapersLink: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.domain) {
      return toast.error('Please fill in all required fields');
    }

    setSubmitting(true);
    try {
      // In Phase 2, we updated the project controller workflow: Project Proposal Flow
      const payload = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        group: user.group,
        researchPapers: formData.researchPapersLink 
          ? formData.researchPapersLink.split(',').map(link => link.trim())
          : []
      };

      await projectAPI.createProposal(payload);
      toast.success('Project Proposal Submitted Successfully');
      navigate('/app/projects');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 lg:p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <FolderKanban className="w-6 h-6 mr-2 text-indigo-600" />
            Submit Project Proposal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Provide your details to transition into the Proposal Phase.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="e.g. Smart Academic Management System"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Domain *</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            >
              <option value="">Select Domain...</option>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Describe your project's main objectives and methodology..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Base Research Papers (Links)</label>
            <p className="text-xs text-slate-500 mb-2">Comma separated URLs for standard IEEE/ACM papers</p>
            <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-400">
              <Upload className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                name="researchPapersLink"
                value={formData.researchPapersLink}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-slate-700"
                placeholder="https://ieeexplore.ieee.org/document/xxx, https://dl.acm.org/doi/xxx"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow font-medium transition-all"
            >
              {submitting ? 'Submitting Proposal...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProject;
