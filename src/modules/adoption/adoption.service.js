const { getDB } = require('../../config/db');

const getCollection = () => getDB().collection('adoption');

const createAdoptionRequest = async (data) => {
    return await getCollection().insertOne(data);
};

const getAllRequests = async () => {
    return await getCollection().find().toArray();
};

const getRequestsByPetId = async (petId) => {
    return await getCollection().find({ petId }).toArray();
};

const getRequestsByEmail = async (email) => {
    return await getCollection().find({ email }).toArray();
};

const cancelAdoptionRequest = async (petId) => {
    return await getCollection().deleteOne({ petId });
};

const updateStatus = async (petId, updateData) => {
    return await getCollection().updateOne(
        { petId },
        { $set: updateData }
    );
};

module.exports = {
    createAdoptionRequest,
    getAllRequests,
    getRequestsByPetId,
    getRequestsByEmail,
    cancelAdoptionRequest,
    updateStatus,
};
