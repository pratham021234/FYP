import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Mail, Lock, Eye, EyeOff, ArrowRight,
  Shield, Sparkles, GraduationCap, User, Phone,
  BookOpen, Hash, Building2, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNumber: '',
    department: '',
    year: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    
    // Sanitize payload to avoid MongoDB validation/duplicate key errors
    if (!registerData.rollNumber) delete registerData.rollNumber;
    if (!registerData.year) delete registerData.year;

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/app/dashboard');
    }
    
    setLoading(false);
  };

  const inputBaseStyle = {
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#4f46e5';
    e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══ Left Panel — Dark Navy Branding ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col justify-between"
        style={{
          background: 'linear-gradient(160deg, #0f1629 0%, #151d35 40%, #1a2342 70%, #0f1629 100%)',
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '500px', height: '500px',
            top: '-100px', right: '-150px',
            background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '400px', height: '400px',
            bottom: '-50px', left: '-100px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute animate-float"
          style={{
            width: '300px', height: '300px',
            top: '40%', left: '20%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top: Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 p-10 flex items-center gap-3"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 4px 20px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight block leading-tight">APMS</span>
            <span className="text-xs block" style={{ color: 'rgba(148,163,184,0.6)', letterSpacing: '0.05em' }}>Portal</span>
          </div>
        </motion.div>

        {/* Center: Headline */}
        <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {/* Decorative accent line */}
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#818cf8' }}>
                Academic Platform
              </span>
            </div>

            {/* Title with gradient */}
            <h1
              className="font-extrabold leading-[1.05] mb-2"
              style={{
                fontSize: 'clamp(2.4rem, 3.5vw, 3.4rem)',
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Academic
              <br />
              Project
              <br />
              Management
            </h1>

            <p
              className="text-base mt-5 mb-10 leading-relaxed"
              style={{ color: 'rgba(148,163,184,0.7)', maxWidth: '340px' }}
            >
              Streamline your academic projects with intelligent tools, real-time collaboration, and AI-powered insights.
            </p>

            {/* Badge pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'INSTITUTION VERIFIED', dot: true },
                { icon: Sparkles, label: 'AI-POWERED WORKFLOW', dot: false },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(226,232,240,0.8)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {badge.dot ? (
                    <span className="w-2 h-2 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
                  ) : (
                    <badge.icon className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                  )}
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom: Copyright & links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 px-10 pb-8 flex items-center justify-between"
        >
          <span className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
            © {new Date().getFullYear()} APMS. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="text-xs cursor-pointer hover:text-slate-300 transition-colors" style={{ color: 'rgba(148,163,184,0.4)' }}>
              Documentation
            </span>
            <span className="text-xs cursor-pointer hover:text-slate-300 transition-colors" style={{ color: 'rgba(148,163,184,0.4)' }}>
              Support
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ Right Panel — Registration Form (SCROLLABLE) ═══ */}
      <div
        className="w-full lg:w-[58%] overflow-y-auto"
        style={{ background: '#f0f2f7', height: '100vh' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center p-6 sm:p-10"
          style={{ minHeight: '100%' }}
        >
          <div className="w-full max-w-2xl py-4">
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: '#ffffff',
                boxShadow: '0 25px 60px rgba(15,23,42,0.08), 0 4px 20px rgba(15,23,42,0.04)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1"
                style={{
                  background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite',
                }}
              />

              <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1.5">
                      Create Account
                    </h2>
                    <p className="text-sm text-slate-500">
                      Join the academic project management portal.
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                    }}
                  >
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <User className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="John Doe"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        University Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <Mail className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="student@university.edu"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <Lock className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="Min 6 characters"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <Eye style={{ width: '18px', height: '18px' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <Lock className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="Re-enter password"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <Eye style={{ width: '18px', height: '18px' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Role — self-registration is student-only */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Role
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <BookOpen className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 flex items-center"
                          style={inputBaseStyle}
                        >
                          Student
                        </div>
                        <input type="hidden" name="role" value="student" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5">Guide/Coordinator accounts are created by the coordinator.</p>
                    </div>

                    {/* Roll Number — student only */}
                    {formData.role === 'student' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                          Roll Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                            <Hash className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                          </div>
                          <input
                            id="register-roll"
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                            placeholder="CS2021001"
                            style={inputBaseStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    )}

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Department
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <Building2 className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-department"
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="Computer Science"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>

                    {/* Year — student only */}
                    {formData.role === 'student' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                          Year
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                            <Calendar className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                          </div>
                          <select
                            id="register-year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm text-slate-800 outline-none transition-all duration-200 appearance-none cursor-pointer"
                            style={inputBaseStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                          <Phone className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <input
                          id="register-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                          placeholder="+1234567890"
                          style={inputBaseStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    id="register-submit"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                      boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.boxShadow = '0 6px 25px rgba(79,70,229,0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(79,70,229,0.3)';
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold transition-colors"
                      style={{ color: '#4f46e5' }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
