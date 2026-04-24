import React, { useState, useEffect } from 'react';
import { evaluationAPI } from '../utils/api';
import { ClipboardCheck } from 'lucide-react';
import { getGradeColor, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      const response = await evaluationAPI.getAll();
      setEvaluations(response.data.data);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <ClipboardCheck className="w-8 h-8 mr-3 text-indigo-600" />
          Evaluations
        </h1>
        <p className="text-slate-500 mt-1">Review grades and evaluation results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluations.length > 0 ? (
          evaluations.map((evaluation, i) => (
            <motion.div
              key={evaluation._id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <span className={`text-2xl font-bold ${getGradeColor(evaluation.grade)}`}>
                  {evaluation.grade}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">{evaluation.type.replace('_', ' ').toUpperCase()}</h3>
                <p className="text-sm text-slate-500">Project: {evaluation.project?.title}</p>
                <p className="text-sm text-slate-500">Group: {evaluation.group?.name}</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-600">
                    Score: <span className="font-semibold text-indigo-600">{evaluation.totalScore}/{evaluation.maxTotalScore}</span> ({evaluation.percentage?.toFixed(1)}%)
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(evaluation.evaluationDate)}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400">No evaluations found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Evaluations;
