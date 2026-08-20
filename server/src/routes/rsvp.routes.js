const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvp.controller');

// Public routes
router.post('/', rsvpController.submit);
router.get('/wishes', rsvpController.getWishes);

// Admin-only routes (protected by passcode check middleware)
router.get('/admin/list', rsvpController.authorizeAdmin, rsvpController.getAll);
router.get('/admin/stats', rsvpController.authorizeAdmin, rsvpController.getStats);

module.exports = router;
