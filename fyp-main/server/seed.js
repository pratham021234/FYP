/**
 * =============================================================
 *  DATABASE SEED SCRIPT — FYP Project Management System
 * =============================================================
 *  
 *  Creates realistic test data so you can log in and test every
 *  feature without manually creating accounts.
 *
 *  Run:  node server/seed.js
 *
 *  ⚠️  This will CLEAR existing data first, then insert fresh data.
 *
 *  All accounts use password:  password123
 * =============================================================
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('./models/User.model');
const Group = require('./models/Group.model');
const Project = require('./models/Project.model');
const Deliverable = require('./models/Deliverable.model');
const Meeting = require('./models/Meeting.model');
const Evaluation = require('./models/Evaluation.model');
const Notification = require('./models/Notification.model');

// ─── Helpers ────────────────────────────────────────────────
const hashPassword = async (pw) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
};

const futureDate = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
};

const pastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// ─── Main Seed Function ─────────────────────────────────────
async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Group.deleteMany({}),
      Project.deleteMany({}),
      Deliverable.deleteMany({}),
      Meeting.deleteMany({}),
      Evaluation.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('   Done.\n');

    const pw = 'password123'; // The User model's pre-save hook will hash this automatically

    // ─────────────────────────────────────────────────────────
    // 1. CREATE USERS
    // ─────────────────────────────────────────────────────────
    console.log('👤 Creating users...');

    const coordinator = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'coordinator@test.com',
      password: pw,
      role: 'coordinator',
      department: 'Computer Engineering',
      phone: '9876543210',
    });

    const guide1 = await User.create({
      name: 'Prof. Anjali Desai',
      email: 'guide1@test.com',
      password: pw,
      role: 'guide',
      department: 'Computer Engineering',
      phone: '9876543211',
    });

    const guide2 = await User.create({
      name: 'Prof. Vikram Patel',
      email: 'guide2@test.com',
      password: pw,
      role: 'guide',
      department: 'Computer Engineering',
      phone: '9876543212',
    });

    // Group 1 students (4 members — full group, approved project)
    const student1 = await User.create({
      name: 'Aarav Mehta',
      email: 'student1@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022001',
      phone: '9000000001',
    });

    const student2 = await User.create({
      name: 'Priya Singh',
      email: 'student2@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022002',
      phone: '9000000002',
    });

    const student3 = await User.create({
      name: 'Rohan Joshi',
      email: 'student3@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022003',
      phone: '9000000003',
    });

    const student4 = await User.create({
      name: 'Neha Kulkarni',
      email: 'student4@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022004',
      phone: '9000000004',
    });

    // Group 2 students (3 members — pending proposal)
    const student5 = await User.create({
      name: 'Arjun Nair',
      email: 'student5@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022005',
      phone: '9000000005',
    });

    const student6 = await User.create({
      name: 'Kavya Iyer',
      email: 'student6@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022006',
      phone: '9000000006',
    });

    const student7 = await User.create({
      name: 'Siddharth Rao',
      email: 'student7@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022007',
      phone: '9000000007',
    });

    // Group 3 students (2 members — rejected proposal, has a join request)
    const student8 = await User.create({
      name: 'Ananya Verma',
      email: 'student8@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022008',
      phone: '9000000008',
    });

    // Lone student (not in any group — for testing group join)
    const student9 = await User.create({
      name: 'Manav Gupta',
      email: 'student9@test.com',
      password: pw,
      role: 'student',
      department: 'Computer Engineering',
      year: 4,
      rollNumber: 'CE2022009',
      phone: '9000000009',
    });

    console.log('   ✅ Created: 1 coordinator, 2 guides, 9 students\n');

    // ─────────────────────────────────────────────────────────
    // 2. CREATE GROUPS
    // ─────────────────────────────────────────────────────────
    console.log('👥 Creating groups...');

    const group1 = await Group.create({
      name: 'Team Alpha',
      leader: student1._id,
      members: [student1._id, student2._id, student3._id, student4._id],
      guide: guide1._id,
      maxMembers: 4,
      department: 'Computer Engineering',
      year: 4,
    });

    const group2 = await Group.create({
      name: 'Team Beta',
      leader: student5._id,
      members: [student5._id, student6._id, student7._id],
      guide: guide2._id,
      maxMembers: 4,
      department: 'Computer Engineering',
      year: 4,
    });

    const group3 = await Group.create({
      name: 'Team Gamma',
      leader: student8._id,
      members: [student8._id],
      guide: guide1._id,
      maxMembers: 4,
      department: 'Computer Engineering',
      year: 4,
      joinRequests: [{ user: student9._id, requestedAt: new Date() }],
    });

    // Update students' group references
    await User.updateMany(
      { _id: { $in: [student1._id, student2._id, student3._id, student4._id] } },
      { group: group1._id }
    );
    await User.updateMany(
      { _id: { $in: [student5._id, student6._id, student7._id] } },
      { group: group2._id }
    );
    await User.updateOne({ _id: student8._id }, { group: group3._id });

    console.log('   ✅ Created 3 groups (Team Alpha: 4/4, Team Beta: 3/4, Team Gamma: 1/4 with join request)\n');

    // ─────────────────────────────────────────────────────────
    // 3. CREATE PROJECTS (proposals)
    // ─────────────────────────────────────────────────────────
    console.log('📋 Creating project proposals...');

    // Project 1: APPROVED — in development
    const project1 = await Project.create({
      title: 'AI-Powered Student Performance Predictor',
      description: 'A machine learning system that analyzes student academic data, attendance patterns, and assignment submission history to predict semester-end performance. The system uses Random Forest and LSTM neural networks to provide early-warning alerts for at-risk students, enabling timely intervention by faculty and counselors.',
      group: group1._id,
      guide: guide1._id,
      domain: 'Artificial Intelligence',
      researchPapers: [
        { title: 'Predicting Student Performance Using ML', url: 'https://arxiv.org/abs/2201.01234' },
        { title: 'LSTM Networks for Educational Data Mining', url: 'https://arxiv.org/abs/2203.05678' },
      ],
      phase: 'DEVELOPMENT',
      proposalStatus: 'approved',
      progressPercentage: 45,
      approvedBy: guide1._id,
      approvedAt: pastDate(30),
    });

    // Project 2: PENDING approval
    const project2 = await Project.create({
      title: 'Blockchain-Based Academic Certificate Verification',
      description: 'A decentralized application (DApp) built on Ethereum that stores hashed academic certificates on the blockchain. Employers and institutions can verify the authenticity of certificates in real-time without contacting the issuing university, reducing fraud and verification time from weeks to seconds.',
      group: group2._id,
      guide: guide2._id,
      domain: 'Blockchain',
      researchPapers: [
        { title: 'Blockchain in Education: A Systematic Review', url: 'https://arxiv.org/abs/2205.09876' },
      ],
      phase: 'PROPOSAL',
      proposalStatus: 'pending',
      progressPercentage: 0,
    });

    // Project 3: REJECTED — group needs to revise
    const project3 = await Project.create({
      title: 'Smart Home Automation with IoT',
      description: 'A basic IoT project to control lights and fans from a mobile app.',
      group: group3._id,
      guide: guide1._id,
      domain: 'Internet of Things (IoT)',
      researchPapers: [],
      phase: 'PROPOSAL',
      proposalStatus: 'rejected',
      rejectionReason: 'The proposal is too vague. Please provide: (1) specific sensors/hardware to be used, (2) communication protocol (MQTT, HTTP, etc.), (3) a clear architecture diagram, and (4) at least 2 research paper references.',
      progressPercentage: 0,
    });

    // Link projects back to groups
    await Group.updateOne({ _id: group1._id }, { project: project1._id });
    await Group.updateOne({ _id: group2._id }, { project: project2._id });
    await Group.updateOne({ _id: group3._id }, { project: project3._id });

    console.log('   ✅ Created 3 proposals (1 approved, 1 pending, 1 rejected)\n');

    // ─────────────────────────────────────────────────────────
    // 4. CREATE DELIVERABLES (for the approved project)
    // ─────────────────────────────────────────────────────────
    console.log('📦 Creating deliverables...');

    await Deliverable.create({
      project: project1._id,
      group: group1._id,
      title: 'Proposal Document',
      type: 'proposal_doc',
      status: 'graded',
      dueDate: pastDate(25),
      submittedAt: pastDate(26),
      submittedBy: student1._id,
      documentUrl: 'https://docs.google.com/document/d/example-proposal',
      gradedBy: guide1._id,
      grade: 82,
      comments: 'Well-structured proposal. Good literature review. Minor improvements needed in methodology section.',
    });

    await Deliverable.create({
      project: project1._id,
      group: group1._id,
      title: 'October Monthly FTR',
      type: 'monthly_ftr',
      status: 'submitted',
      dueDate: pastDate(5),
      submittedAt: pastDate(6),
      submittedBy: student2._id,
      documentUrl: 'https://docs.google.com/presentation/d/example-ftr-oct',
    });

    await Deliverable.create({
      project: project1._id,
      group: group1._id,
      title: 'November Monthly FTR',
      type: 'monthly_ftr',
      status: 'pending',
      dueDate: futureDate(10),
    });

    await Deliverable.create({
      project: project1._id,
      group: group1._id,
      title: 'Semester 1 Report',
      type: 'semester_report',
      status: 'pending',
      dueDate: futureDate(45),
    });

    console.log('   ✅ Created 4 deliverables (1 graded, 1 submitted, 2 pending)\n');

    // ─────────────────────────────────────────────────────────
    // 5. CREATE MEETINGS
    // ─────────────────────────────────────────────────────────
    console.log('📅 Creating meetings...');

    // Past completed meeting
    await Meeting.create({
      title: 'Project Kickoff - Team Alpha',
      description: 'Initial project discussion and milestone planning',
      type: 'project_review',
      startTime: pastDate(20),
      endTime: new Date(pastDate(20).getTime() + 60 * 60 * 1000),
      location: 'Room 301, CS Building',
      organizer: guide1._id,
      participants: [
        { user: student1._id, status: 'accepted' },
        { user: student2._id, status: 'accepted' },
        { user: student3._id, status: 'accepted' },
        { user: student4._id, status: 'accepted' },
      ],
      group: group1._id,
      project: project1._id,
      status: 'completed',
      notes: 'Discussed project timeline. Dataset collection to begin next week. Assigned tasks to team members.',
    });

    // Upcoming meeting
    await Meeting.create({
      title: 'Progress Review - Team Alpha',
      description: 'Review ML model training progress and discuss next steps',
      type: 'project_review',
      startTime: futureDate(3),
      endTime: new Date(futureDate(3).getTime() + 60 * 60 * 1000),
      location: 'Room 301, CS Building',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      organizer: guide1._id,
      participants: [
        { user: student1._id, status: 'pending' },
        { user: student2._id, status: 'accepted' },
        { user: student3._id, status: 'pending' },
        { user: student4._id, status: 'accepted' },
      ],
      group: group1._id,
      project: project1._id,
      status: 'scheduled',
    });

    // Coordinator review meeting
    await Meeting.create({
      title: 'Mid-Semester Progress Check — All Groups',
      description: 'Coordinator reviews progress of all project groups',
      type: 'evaluation',
      startTime: futureDate(14),
      endTime: new Date(futureDate(14).getTime() + 2 * 60 * 60 * 1000),
      location: 'Seminar Hall',
      organizer: coordinator._id,
      participants: [
        { user: guide1._id, status: 'accepted' },
        { user: guide2._id, status: 'pending' },
        { user: student1._id, status: 'pending' },
        { user: student5._id, status: 'pending' },
      ],
      status: 'scheduled',
    });

    console.log('   ✅ Created 3 meetings (1 completed, 2 upcoming)\n');

    // ─────────────────────────────────────────────────────────
    // 6. CREATE AN EVALUATION (for the approved project)
    // ─────────────────────────────────────────────────────────
    console.log('📝 Creating evaluations...');

    await Evaluation.create({
      project: project1._id,
      group: group1._id,
      evaluator: guide1._id,
      type: 'proposal',
      criteria: [
        { name: 'Problem Definition', description: 'Clarity of the problem statement', maxScore: 20, score: 17 },
        { name: 'Literature Survey', description: 'Quality and relevance of references', maxScore: 20, score: 16 },
        { name: 'Methodology', description: 'Proposed approach and tools', maxScore: 30, score: 24 },
        { name: 'Feasibility', description: 'Is the project achievable in the timeframe?', maxScore: 15, score: 13 },
        { name: 'Presentation', description: 'Quality of oral presentation', maxScore: 15, score: 12 },
      ],
      totalScore: 82,
      maxTotalScore: 100,
      comments: 'Solid proposal. The team demonstrated good understanding of the problem domain. Methodology section could be more detailed regarding the specific ML algorithms to be used.',
      strengths: [
        'Clear problem statement with real-world relevance',
        'Thorough literature survey with 12 papers reviewed',
        'Realistic timeline with well-defined milestones',
      ],
      improvements: [
        'Elaborate on the specific ML algorithms and why they were chosen',
        'Include a preliminary system architecture diagram',
        'Define evaluation metrics more precisely',
      ],
      evaluationDate: pastDate(28),
    });

    console.log('   ✅ Created 1 proposal evaluation (82/100, Grade B+)\n');

    // ─────────────────────────────────────────────────────────
    // 7. CREATE NOTIFICATIONS
    // ─────────────────────────────────────────────────────────
    console.log('🔔 Creating notifications...');

    await Notification.create([
      {
        recipient: student1._id,
        type: 'proposal_approved',
        title: '🎉 Proposal Approved!',
        message: 'Your project proposal "AI-Powered Student Performance Predictor" has been approved by Prof. Anjali Desai.',
        relatedProject: project1._id,
        isRead: true,
      },
      {
        recipient: student1._id,
        type: 'meeting_scheduled',
        title: '📅 Upcoming Meeting',
        message: 'Progress Review meeting scheduled for ' + futureDate(3).toLocaleDateString() + ' at Room 301.',
        isRead: false,
      },
      {
        recipient: student5._id,
        type: 'general',
        title: '⏳ Proposal Under Review',
        message: 'Your proposal "Blockchain-Based Academic Certificate Verification" is being reviewed by Prof. Vikram Patel.',
        relatedProject: project2._id,
        isRead: false,
      },
      {
        recipient: student8._id,
        type: 'proposal_rejected',
        title: '❌ Proposal Rejected',
        message: 'Your proposal "Smart Home Automation with IoT" has been rejected. Please check the feedback and resubmit.',
        relatedProject: project3._id,
        isRead: false,
      },
      {
        recipient: student8._id,
        type: 'group_invitation',
        title: '📬 Join Request',
        message: 'Manav Gupta has requested to join Team Gamma.',
        relatedGroup: group3._id,
        isRead: false,
      },
      {
        recipient: guide1._id,
        type: 'general',
        title: '📋 New Project Assigned',
        message: 'You have been assigned as guide for "Team Alpha" working on AI-Powered Student Performance Predictor.',
        isRead: true,
      },
      {
        recipient: guide2._id,
        type: 'project_proposal',
        title: '📝 New Proposal to Review',
        message: 'Team Beta has submitted a proposal "Blockchain-Based Academic Certificate Verification" for your review.',
        relatedProject: project2._id,
        isRead: false,
      },
      {
        recipient: coordinator._id,
        type: 'general',
        title: '📊 Weekly Summary',
        message: '3 active groups, 1 pending approval, 1 rejected proposal. 2 upcoming meetings this week.',
        isRead: false,
      },
    ]);

    console.log('   ✅ Created 8 notifications\n');

    // ─────────────────────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅  DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('  🔑  All passwords: password123');
    console.log('');
    console.log('  ┌──────────────────────────────────────────────────┐');
    console.log('  │  COORDINATOR                                     │');
    console.log('  │  coordinator@test.com  (Dr. Rajesh Sharma)       │');
    console.log('  ├──────────────────────────────────────────────────┤');
    console.log('  │  GUIDES                                          │');
    console.log('  │  guide1@test.com  (Prof. Anjali Desai)           │');
    console.log('  │  guide2@test.com  (Prof. Vikram Patel)           │');
    console.log('  ├──────────────────────────────────────────────────┤');
    console.log('  │  STUDENTS (Team Alpha — APPROVED project, 45%)   │');
    console.log('  │  student1@test.com  Aarav Mehta   ⭐ Leader      │');
    console.log('  │  student2@test.com  Priya Singh                  │');
    console.log('  │  student3@test.com  Rohan Joshi                  │');
    console.log('  │  student4@test.com  Neha Kulkarni                │');
    console.log('  ├──────────────────────────────────────────────────┤');
    console.log('  │  STUDENTS (Team Beta — PENDING proposal)         │');
    console.log('  │  student5@test.com  Arjun Nair    ⭐ Leader      │');
    console.log('  │  student6@test.com  Kavya Iyer                   │');
    console.log('  │  student7@test.com  Siddharth Rao                │');
    console.log('  ├──────────────────────────────────────────────────┤');
    console.log('  │  STUDENTS (Team Gamma — REJECTED proposal)       │');
    console.log('  │  student8@test.com  Ananya Verma  ⭐ Leader      │');
    console.log('  ├──────────────────────────────────────────────────┤');
    console.log('  │  LONE STUDENT (no group — has pending join req)  │');
    console.log('  │  student9@test.com  Manav Gupta                  │');
    console.log('  └──────────────────────────────────────────────────┘');
    console.log('');
    console.log('  📌 Test Scenarios Ready:');
    console.log('     • Login as coordinator@test.com → see all groups & approve proposals');
    console.log('     • Login as guide1@test.com → see Team Alpha progress, review proposals');
    console.log('     • Login as guide2@test.com → approve/reject Team Beta proposal');
    console.log('     • Login as student1@test.com → see approved project, deliverables, meetings');
    console.log('     • Login as student5@test.com → see pending proposal status');
    console.log('     • Login as student8@test.com → see rejected proposal, can edit & resubmit');
    console.log('     • Login as student8@test.com → approve/decline student9 join request');
    console.log('     • Login as student9@test.com → lone student, can browse & request to join groups');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
