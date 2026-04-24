import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/app/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══ Left Panel — Dark Navy Branding ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between"
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
        {/* Extra center glow */}
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
                fontSize: 'clamp(2.6rem, 4vw, 3.8rem)',
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

      {/* ═══ Right Panel — Login Form ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-10 overflow-y-auto"
        style={{ background: '#f0f2f7' }}
      >
        <div className="w-full max-w-md">
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
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1.5">
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-500">
                  Please enter your academic credentials to access the portal.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      id="login-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                      placeholder="student@university.edu"
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-600 tracking-wider uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-semibold transition-colors"
                      style={{ color: '#4f46e5' }}
                      onMouseEnter={(e) => e.target.style.color = '#6366f1'}
                      onMouseLeave={(e) => e.target.style.color = '#4f46e5'}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                      <Lock className="text-slate-400" style={{ width: '18px', height: '18px' }} />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                      placeholder="••••••••••••"
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
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

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: rememberMe ? '#4f46e5' : '#f1f5f9',
                      border: rememberMe ? '1.5px solid #4f46e5' : '1.5px solid #cbd5e1',
                    }}
                  >
                    {rememberMe && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-slate-500">Remember this device</span>
                </div>

                {/* Submit */}
                <motion.button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign into Portal
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-medium text-slate-700 transition-all duration-200"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <Shield className="w-4 h-4" style={{ color: '#4f46e5' }} />
                  Campus ID
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-medium text-slate-700 transition-all duration-200"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <Users className="w-4 h-4" style={{ color: '#4f46e5' }} />
                  Faculty SSO
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-7 text-center"
          >
            <p className="text-sm text-slate-500 mb-4">
              New to APMS?{' '}
              <Link
                to="/register"
                className="font-semibold transition-colors"
                style={{ color: '#4f46e5' }}
              >
                Create Account
              </Link>
            </p>
            <div className="flex items-center justify-center gap-6">
              <span className="text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-600 transition-colors uppercase tracking-wider">
                Privacy Policy
              </span>
              <span className="text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-600 transition-colors uppercase tracking-wider">
                System Status
              </span>
              <span className="text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-600 transition-colors uppercase tracking-wider">
                Help Desk
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
