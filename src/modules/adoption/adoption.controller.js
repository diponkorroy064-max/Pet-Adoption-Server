const adoptionService = require('./adoption.service');

const createAdoption = async (req, res) => {
    try {
        const result = await adoptionService.createAdoptionRequest(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAdoptions = async (req, res) => {
    try {
        const result = await adoptionService.getAllRequests();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdoptionByPetId = async (req, res) => {
    try {
        const { ID } = req.params;
        const result = await adoptionService.getRequestsByPetId(ID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdoptionByUserEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await adoptionService.getRequestsByEmail(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAdoption = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adoptionService.cancelAdoptionRequest(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAdoptionStatus = async (req, res) => {
    try {
        const { petId } = req.params;
        const result = await adoptionService.updateStatus(petId, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdoption,
    getAllAdoptions,
    getAdoptionByPetId,
    getAdoptionByUserEmail,
    deleteAdoption,
    updateAdoptionStatus,
};
