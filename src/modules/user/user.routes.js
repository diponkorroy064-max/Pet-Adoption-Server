const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

// GET /api/users/:id---
router.get('/:id', userController.getUserProfile);

// PATCH /api/users/:id---
router.patch('/:id', userController.updateUserProfile);

module.exports = router;
