import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../utils/api';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  const loadProjects = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const response = await projectAPI.getAll(params);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.domain.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
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
            <FolderKanban className="w-8 h-8 mr-3 text-indigo-600" />
            Projects
          </h1>
          <p className="text-slate-500 mt-1">Browse and manage academic projects</p>
        </div>
        {user.role === 'student' && user.group && (
          <Link
            to="/app/projects/create"
            className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-medium w-full sm:w-auto justify-center transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="proposed">Proposed</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project._id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              to={`/app/projects/${project._id}`}
              className="block h-full bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-6 hover:border-indigo-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(project.proposalStatus || project.phase)}`}>
                    {(project.proposalStatus || project.phase || '').replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-3 flex-grow">
                  {project.description}
                </p>
                
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="inline-block px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-700 font-medium tracking-wide">
                    {project.domain}
                  </div>
                  
                  {project.progressPercentage !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium text-indigo-600">{project.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-16 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm"
        >
          <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No projects found matching your criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Projects;
