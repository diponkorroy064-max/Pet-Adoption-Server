const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('node:dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

let db;
const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const connectDB = async () => {
    if (db) return db;
    await client.connect();
    db = client.db('pet-adoption-database');
    console.log('Successfully connected to MongoDB!');
    return db;
};

const getDB = () => {
    if (!db) throw new Error('Database not initialized!');
    return db;
};

module.exports = { connectDB, getDB };
