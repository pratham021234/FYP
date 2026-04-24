import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { User, Mail, Lock, Camera, Save, CheckCircle, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: user?.department || '',
    year: user?.year || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || null);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        avatar: previewUrl || user?.avatar || ''
      };
      const response = await authAPI.updateProfile(payload);
      updateUser(response.data.data);
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus({ type: 'error', message: 'New passwords do not match!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveStatus({ type: 'error', message: 'Password must be at least 6 characters long!' });
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to update password. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-indigo-600" />
          Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage your account settings and preferences</p>
      </div>

      {saveStatus && (
        <div className={`flex items-start p-4 rounded-2xl ${
          saveStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
        }`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
          )}
          <p className={`font-medium ${saveStatus.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
            {saveStatus.message}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <User className="w-5 h-5 inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Lock className="w-5 h-5 inline-block mr-2" />
              Security
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-500/20">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-3xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="profile-picture"
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800">Profile Picture</h3>
                  <p className="text-sm text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <input type="text" name="department" value={profileData.department} onChange={handleProfileChange} className={`${inputClass} bg-slate-50`} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                  <input type="text" name="year" value={profileData.year} onChange={handleProfileChange} className={`${inputClass} bg-slate-50`} readOnly />
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold flex items-center shadow-button hover:shadow-button-hover transition-all"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">Change Password</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Ensure your account is using a strong password to stay secure.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password *</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={inputClass} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password *</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={inputClass} required minLength="6" />
                <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password *</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={inputClass} required />
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold flex items-center shadow-button hover:shadow-button-hover transition-all"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
