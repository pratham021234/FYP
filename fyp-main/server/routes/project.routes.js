const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// Project proposals
router.post('/proposal', authorize('student'), projectController.createProjectProposal);
router.put('/:id/update-proposal', authorize('student'), projectController.updateProposal);
router.put('/:id/approve', authorize('guide', 'coordinator', 'admin'), projectController.approveProjectProposal);
router.put('/:id/reject', authorize('guide', 'coordinator', 'admin'), projectController.rejectProjectProposal);

// Coordinator phase management
router.put('/:id/phase', authorize('coordinator', 'admin'), projectController.updatePhase);

// Fetching
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

module.exports = router;
