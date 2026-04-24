import React, { useState, useEffect } from 'react';
import { deliverableAPI, projectAPI } from '../utils/api';
import { FileText, Calendar, Upload, Award } from 'lucide-react';
import { getStatusColor, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuth();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation this would fetch all deliverables for the user's role
    loadDeliverables();
  }, [user]);

  const loadDeliverables = async () => {
    try {
      // Mocking fetch or assuming API structure:
      // const res = await deliverableAPI.getProjectDeliverables(projectId);
      // For now, keep state empty as simulation
      setLoading(false);
    } catch (error) {
      console.error('Failed to load deliverables:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            Deliverables & FTRs
          </h1>
          <p className="text-slate-500 mt-1">Manage project milestones, reports, and FTR scheduling</p>
        </div>
        {user.role === 'coordinator' && (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow cursor-pointer font-medium hover:bg-indigo-700">
            + Schedule FTR
          </button>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {deliverables.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {deliverables.map((item) => (
              <div key={item._id} className="p-6 hover:bg-indigo-50/30 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500">Due: {formatDate(item.dueDate)}</p>
                </div>
                {user.role === 'student' && (
                  <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm">
                    Submit
                  </button>
                )}
                {user.role === 'guide' && (
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-medium text-sm">
                    Grade
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No deliverables or FTRs scheduled yet.</p>
            {user.role === 'coordinator' && (
              <p className="text-sm mt-2 text-indigo-500 cursor-pointer">Click "Schedule FTR" to add one.</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;
