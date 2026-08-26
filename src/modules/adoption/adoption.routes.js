const express = require('express');
const router = express.Router();
const adoptionController = require('./adoption.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { verifyRole } = require('../../middlewares/role.middleware');

// Public or standard user reads
router.get('/', adoptionController.getAllAdoptions);
router.get('/:ID/newId', adoptionController.getAdoptionByPetId);

// Protected user routes
router.post('/', verifyToken, adoptionController.createAdoption);
router.get('/:email/userEmail', verifyToken, adoptionController.getAdoptionByUserEmail);
router.delete('/:id/byPetId', verifyToken, adoptionController.deleteAdoption);

// Pet Owners / Admin approve or reject routes
router.patch(
    '/:petId/update',
    verifyToken,
    verifyRole('owner', 'admin'),
    adoptionController.updateAdoptionStatus
);

module.exports = router;
