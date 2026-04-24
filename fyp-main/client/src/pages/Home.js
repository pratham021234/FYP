import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  ClipboardCheck,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  Bell,
  BarChart3,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure access control for Students, Guides, Coordinators, and Admins.',
      color: 'blue',
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Complete project lifecycle management from proposal to completion.',
      color: 'indigo',
    },
    {
      icon: Users,
      title: 'Group Collaboration',
      description: 'Create and manage project groups with seamless team collaboration.',
      color: 'emerald',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging between students, guides, and team members.',
      color: 'amber',
    },
    {
      icon: ClipboardCheck,
      title: 'Smart Evaluations',
      description: 'Multi-criteria evaluation system with automatic grade calculation.',
      color: 'red',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Real-time project progress monitoring with visual dashboards.',
      color: 'violet',
    },
    {
      icon: BookOpen,
      title: 'Report Submissions',
      description: 'Weekly and monthly report submissions with plagiarism detection.',
      color: 'pink',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Real-time notifications for important events, deadlines, and updates.',
      color: 'orange',
    },
  ];

  const roles = [
    {
      title: 'Students',
      icon: GraduationCap,
      features: [
        'Create or join project groups',
        'Submit project proposals',
        'Upload weekly reports',
        'Track project progress',
        'Chat with team and guide',
        'View evaluations and feedback',
      ],
      color: 'blue',
    },
    {
      title: 'Guides',
      icon: Award,
      features: [
        'Review project proposals',
        'Provide feedback on reports',
        'Create evaluations',
        'Monitor student progress',
        'Chat with students',
        'View analytics dashboard',
      ],
      color: 'violet',
    },
    {
      title: 'Coordinators',
      icon: BarChart3,
      features: [
        'Manage all users',
        'Assign guides to groups',
        'Approve/reject projects',
        'System-wide analytics',
        'Monitor all activities',
        'Configure system settings',
      ],
      color: 'emerald',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '1000+', icon: Users, color: 'text-indigo-600' },
    { label: 'Projects Managed', value: '500+', icon: FolderKanban, color: 'text-emerald-600' },
    { label: 'Reports Submitted', value: '5000+', icon: BookOpen, color: 'text-amber-600' },
    { label: 'Success Rate', value: '95%', icon: TrendingUp, color: 'text-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 selection:bg-indigo-500/15">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg fixed w-full z-50 border-b border-slate-200/80 shadow-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                APMS
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl px-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, users, or features..."
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </form>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <>
                  <span className="text-sm text-slate-500 hidden lg:block font-medium">Welcome, <span className="text-slate-800 font-semibold">{user.name}</span></span>
                  <Link
                    to="/app/dashboard"
                    className="px-5 py-2.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors hover:bg-indigo-50 rounded-xl"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors hover:bg-indigo-50 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-medium transition-all hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Soft Background Orbs */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-200/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-amber-500 mr-2" />
            <span className="text-sm font-semibold text-indigo-700 tracking-wide uppercase">
              The Next Generation of APMS
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold text-slate-800 mb-8 leading-tight tracking-tight"
          >
            Transform Your <br className="hidden sm:block" />
            <span className="gradient-text">Academic Projects</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            A comprehensive, AI-powered platform for managing student projects from proposal to completion. 
            Experience seamless collaboration, smart evaluations, and real-time analytics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {user ? (
              <Link
                to="/app/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-semibold text-lg flex items-center justify-center group transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-button hover:shadow-button-hover font-semibold text-lg flex items-center justify-center group transition-all hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all font-semibold text-lg shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/60 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Everything you need to manage academic projects efficiently in one beautiful workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-8 group transition-all duration-300 hover:shadow-card-hover"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-50 border border-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-24 relative overflow-hidden bg-white/40 border-t border-slate-200/60">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[150px] animate-pulse-glow" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6 text-indigo-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Role-Based Access Control
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Designed for <span className="text-indigo-600">Every User</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Tailored experiences and specific permissions for everyone involved in the academic process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-300 hover:shadow-card-hover transition-all duration-500 shadow-sm"
              >
                {/* Background Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-${role.color}-100/40 rounded-full blur-[50px] group-hover:bg-${role.color}-200/60 transition-colors duration-500`} />
                
                <div className={`w-16 h-16 bg-${role.color}-50 border border-${role.color}-100 rounded-2xl flex items-center justify-center mb-8 relative z-10`}>
                  <role.icon className={`w-8 h-8 text-${role.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 relative z-10">
                  {role.title}
                </h3>
                <ul className="space-y-4 relative z-10">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 text-${role.color}-500 mr-3 mt-0.5 flex-shrink-0`} />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-16 border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <br/> Project Management?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students and educators using APMS to streamline their academic projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user ? (
              <Link
                to="/app/dashboard"
                className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transform hover:scale-105 transition-all font-bold text-lg shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transform hover:scale-105 transition-all font-bold text-lg shadow-xl"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-10 py-4 bg-transparent text-white rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all font-bold text-lg"
                >
                  Sign In Now
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">APMS</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Academic Project Management & Supervision System — Streamlining education through intelligent design and modern technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 tracking-wide">QUICK LINKS</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-slate-400 hover:text-indigo-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-indigo-400 transition-colors">Register</Link></li>
                <li><Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 APMS. All rights reserved. Built with ❤️ for Academic Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
