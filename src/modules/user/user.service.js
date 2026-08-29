const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');

// Collection reference helper---
const getUserCollection = () => {
    const db = getDB();
    return db.collection('user');
};

// Fetch user profile by ID---
const getUserFromDB = async (id) => {
    const query = { _id: new ObjectId(id) };
    const result = await getUserCollection().findOne(query, {
        projection: { password: 0 } // Exclude sensitive fields
    });
    return result;
};

// Update user profile---
const updateUserInDB = async (id, payload) => {
    const filter = { _id: new ObjectId(id) };

    // Construct dynamic update object
    const updateDoc = {
        $set: {
            ...payload,
            updatedAt: new Date()
        }
    };

    const options = { returnDocument: 'after', projection: { password: 0 } };
    const result = await getUserCollection().findOneAndUpdate(filter, updateDoc, options);

    return result;
};

module.exports = {
    getUserFromDB,
    updateUserInDB
};
