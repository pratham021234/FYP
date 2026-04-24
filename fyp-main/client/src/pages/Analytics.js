import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Activity,
  Users,
  Target,
  Calendar,
  BarChart3,
} from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getProgressAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Progress Analytics</h1>
        <p className="text-slate-500 mt-1">Comprehensive overview of team performance and project progress</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Projects</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {analytics.overallStats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Average Completion</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {analytics.overallStats.averageCompletion}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.overallStats.averageCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {analytics.overallStats.inProgressProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {analytics.overallStats.completedProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Progress Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.progressDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Progress Trend */}
      {analytics.monthlyProgressTrend && analytics.monthlyProgressTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Progress Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyProgressTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgProgress"
                stroke="#10b981"
                strokeWidth={2}
                name="Average Progress (%)"
              />
              <Line
                type="monotone"
                dataKey="projectCount"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Project Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Performing Teams */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Top Performing Teams</h3>
          <Award className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {analytics.topPerformingTeams.map((team, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-slate-50 text-slate-700' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{team.projectTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800">{team.groupName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-400">
                      <Users className="w-4 h-4 mr-1" />
                      {team.memberCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-slate-100 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${team.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{team.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      (team.status || team.phase) === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : (team.status || team.phase) === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-50 text-slate-700'
                    }`}>
                      {(team.status || team.phase || 'N/A').replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overdue Projects */}
      {analytics.overdueProjects && analytics.overdueProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Overdue Projects</h3>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Guide
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {analytics.overdueProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{project.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-800">{project.groupName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-800">{project.guideName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">
                        {format(new Date(project.deadline), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {project.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-100 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guide Performance (Coordinator/Admin only) */}
      {analytics.guidePerformance && analytics.guidePerformance.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Guide Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Guide Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Avg Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {analytics.guidePerformance.map((guide, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{guide.guideName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{guide.totalProjects}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{guide.completedProjects}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-100 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${guide.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{guide.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {guide.avgProgress >= 70 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : guide.avgProgress >= 40 ? (
                          <Activity className="w-4 h-4 text-yellow-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className="text-sm font-medium text-slate-800">{guide.avgProgress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{activity.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{activity.groupName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{activity.progress}%</div>
                  <div className="text-xs text-slate-400">
                    {format(new Date(activity.lastUpdated), 'MMM dd, HH:mm')}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  (activity.status || activity.phase) === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : (activity.status || activity.phase) === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-50 text-slate-700'
                }`}>
                  {(activity.status || activity.phase || 'N/A').replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
