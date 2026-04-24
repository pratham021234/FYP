import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../utils/api';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import GuideDashboard from '../components/dashboards/GuideDashboard';
import CoordinatorDashboard from '../components/dashboards/CoordinatorDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  if (user.role === 'student') {
    return <StudentDashboard stats={stats} />;
  }

  if (user.role === 'guide') {
    return <GuideDashboard stats={stats} />;
  }

  if (user.role === 'coordinator' || user.role === 'admin') {
    return <CoordinatorDashboard stats={stats} />;
  }

  return null;
};

export default Dashboard;
