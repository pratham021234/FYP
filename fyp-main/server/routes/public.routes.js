const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Public project search routes
router.get('/projects/search', publicController.searchProjects);
router.get('/projects/autocomplete', publicController.autocompleteProjects);
router.get('/projects/:id/preview', publicController.previewProject);

module.exports = router;
