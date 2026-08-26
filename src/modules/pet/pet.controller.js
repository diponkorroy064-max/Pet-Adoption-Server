const petService = require('./pet.service');

const getAllPets = async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFilteredPets = async (req, res) => {
    try {
        const { search, species } = req.query;
        const result = await petService.getFilteredPets(search, species);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPetById = async (req, res) => {
    try {
        const { petId } = req.params;
        const result = await petService.getPetById(petId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPetsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await petService.getPetsByEmail(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPet = async (req, res) => {
    try {
        const result = await petService.createPet(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePet = async (req, res) => {
    try {
        const { petId } = req.params;
        const result = await petService.updatePet(petId, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await petService.deletePet(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPets,
    getFilteredPets,
    getPetById,
    getPetsByEmail,
    createPet,
    updatePet,
    deletePet,
};
