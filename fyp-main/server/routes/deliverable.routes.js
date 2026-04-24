const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverable.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(protect);

// Coordinator FTR/Deliverable Scheduling
router.post('/schedule', authorize('coordinator', 'admin'), deliverableController.scheduleDeliverable);

// Get Project Deliverables
router.get('/project/:projectId', deliverableController.getProjectDeliverables);

// Student Submit Deliverable (supports file upload via multer)
router.put('/:id/submit', authorize('student'), upload.single('file'), deliverableController.submitDeliverable);

// Guide / Coordinator Grade Deliverable
router.put('/:id/grade', authorize('guide', 'coordinator', 'admin'), deliverableController.gradeDeliverable);

module.exports = router;
