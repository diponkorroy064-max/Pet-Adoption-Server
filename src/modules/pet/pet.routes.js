const express = require('express');
const router = express.Router();
const petController = require('./pet.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { verifyRole } = require('../../middlewares/role.middleware');


// Public endpoints---
router.get('/all', petController.getAllPets);
router.get('/', petController.getFilteredPets);

// Protected endpoints---
router.get('/:petId/byId', verifyToken, petController.getPetById);
router.get('/:email', verifyToken, petController.getPetsByEmail);

// Role-based operations (Pet Owners or Admins can post/update/delete pets)---
router.post('/', verifyToken, verifyRole('owner', 'admin'), petController.createPet);
router.patch('/:petId/update', verifyToken, verifyRole('owner', 'admin'), petController.updatePet);
router.delete('/:id/delete', verifyToken, verifyRole('owner', 'admin'), petController.deletePet);

module.exports = router;
