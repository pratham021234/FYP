import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { User, Mail, Phone, Building, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
    rollNumber: user?.rollNumber || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.data);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <User className="w-8 h-8 mr-3 text-indigo-600" />
          Profile
        </h1>
        <p className="text-slate-500 mt-1">Manage your account information</p>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-3xl text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-indigo-600 capitalize font-medium">{user?.role}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Computer Engineering"
                />
              </div>
              {user?.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || '' })}
                      className={inputClass}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. CS2021001"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-button hover:shadow-button-hover transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Building className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{user?.department || 'Not set'}</span>
            </div>
            {user?.year && (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">Year {user.year}</span>
              </div>
            )}
            {user?.rollNumber && (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <Hash className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">Roll: {user.rollNumber}</span>
              </div>
            )}
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-button hover:shadow-button-hover transition-all"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
