const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluation.controller');
const { authenticate, isGuideOrCoordinator } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

router.get('/', evaluationController.getAllEvaluations);
router.get('/:id', evaluationController.getEvaluationById);

// Guide/Coordinator only
router.post('/', isGuideOrCoordinator, evaluationController.createEvaluation);
router.put('/:id', isGuideOrCoordinator, evaluationController.updateEvaluation);
router.delete('/:id', isGuideOrCoordinator, evaluationController.deleteEvaluation);

module.exports = router;
