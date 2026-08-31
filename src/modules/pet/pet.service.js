const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');

const getCollection = () => {
    const db = getDB();
    if (!db) {
        throw new Error('Database connection is not initialized yet.');
    }
    return db.collection('pets');
};

const getAllPets = async () => {
    return await getCollection().find().toArray();
};

const getFilteredPets = async (search, species) => {
    const query = {};
    if (search) {
        query.petName = { $regex: search, $options: 'i' };
    }
    if (species) {
        query.species = { $in: species.split(',') };
    }
    return await getCollection().find(query).toArray();
};

const getPetById = async (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId format');
    }
    return await getCollection().findOne({ _id: new ObjectId(id) });
};

const getPetsByEmail = async (email) => {
    return await getCollection().find({ email }).toArray();
};

const createPet = async (petData) => {
    return await getCollection().insertOne(petData);
};

const updatePet = async (id, updateData) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId format');
    }
    return await getCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
};

const deletePet = async (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId format');
    }
    return await getCollection().deleteOne({ _id: new ObjectId(id) });
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
