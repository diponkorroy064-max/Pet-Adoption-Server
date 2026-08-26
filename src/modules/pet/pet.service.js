const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');

const getCollection = () => getDB().collection('pets');

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
    return await getCollection().findOne({ _id: new ObjectId(id) });
};

const getPetsByEmail = async (email) => {
    return await getCollection().find({ email }).toArray();
};

const createPet = async (petData) => {
    return await getCollection().insertOne(petData);
};

const updatePet = async (id, updateData) => {
    return await getCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
};

const deletePet = async (id) => {
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
