const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/analytics', dashboardController.getAnalytics);
router.get('/progress-analytics', dashboardController.getProgressAnalytics);

module.exports = router;
