import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { Search, Users as UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      
      const response = await userAPI.getAll(params);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <UsersIcon className="w-8 h-8 mr-3 text-indigo-600" />
          Users
        </h1>
        <p className="text-slate-500 mt-1">Manage system users and roles</p>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="guide">Guide</option>
            <option value="coordinator">Coordinator</option>
          </select>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {user.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Users;
