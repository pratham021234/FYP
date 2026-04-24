const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

router.get('/', userController.getAllUsers);
router.get('/guides', userController.getAllGuides);
router.get('/:id', userController.getUserById);

// Coordinator/Admin routes
router.post('/', authorize('coordinator', 'admin'), userController.createUser);
router.put('/:id', authorize('admin', 'coordinator'), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
