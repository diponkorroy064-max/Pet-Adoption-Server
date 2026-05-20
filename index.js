const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cors = require('cors')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URL

const express = require('express')

const app = express()
const port = process.env.PORT


// middleware
app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



const run = async () => {
    try {
        await client.connect();

        // database connection---
        const db = client.db("pet-adoption-database");
        const petsCollection = db.collection('pets');
        const adoptRequestCollection = db.collection("adoption");


        // get all data from mongodb---
        app.get('/pets', async (req, res) => {
            const result = await petsCollection.find().toArray();
            res.json(result);
        })


        // api-- geting id based data from database---
        app.get('/pets/:petId/byId', async (req, res) => {
            const { petId } = req.params;
            const result = await petsCollection.findOne({ _id: new ObjectId(petId) })
            res.json(result);
        })


        // get email based all data from mongodb---
        app.get('/pets/:email', async (req, res) => {
            const { email } = req.params;
            const result = await petsCollection.find({ email: email }).toArray();
            res.json(result);
        })


        // insert pets Data---
        app.post('/pets', async (req, res) => {
            const petsData = req.body;
            console.log(petsData);

            const result = await petsCollection.insertOne(petsData);
            res.json(result);
        })


        // update api---
        app.patch('/pets/:petId/update', async (req, res) => {
            const { petId } = req.params;
            const updatedPetData = req.body;
            console.log(updatedPetData);

            const result = await petsCollection.updateOne(
                { _id: new ObjectId(petId) },
                { $set: updatedPetData });

            res.json(result);
        })


        // delete info. api---
        app.delete('/pets/:id/delete', async (req, res) => {
            const { id } = req.params;
            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        })


        // insert adoption request Data---
        app.post('/adoption', async (req, res) => {
            const adoptionData = req.body;
            console.log(adoptionData);

            const result = await adoptRequestCollection.insertOne(adoptionData);
            res.json(result);
        })


        // get all adoptRequestdata from mongodb---
        app.get('/adoption', async (req, res) => {
            const result = await adoptRequestCollection.find().toArray();
            res.json(result);
        })


        // get petName based adoptRequestdata from mongodb---
        app.get('/adoption/:petName', async (req, res) => {
            const { petName } = req.params;
            const result = await adoptRequestCollection.find({ name: petName }).toArray();
            res.json(result);
        })


        // get email based adoptRequestdata from mongodb---
        app.get('/adoption/:email/userEmail', async (req, res) => {
            const { email } = req.params;
            const result = await adoptRequestCollection.find({ email: email }).toArray();
            res.json(result);
        })


        // cancel adoption request---
        app.delete('/adoption/:id/byPetId', async (req, res) => {
            const { id } = req.params;
            const result = await adoptRequestCollection.deleteOne({ petId: id });
            res.json(result);
        })


        // update api---
        app.patch('/adoption/:petId/update', async (req, res) => {
            const { petId } = req.params;
            const updatedReqData = req.body;
            console.log(updatedReqData);

            const result = await adoptRequestCollection.updateOne(
                { petId: petId },
                { $set: updatedReqData });

            res.json(result);
        })







        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Diponkor..........!')
})

app.listen(port, () => {
    console.log(`Srver is running on port ${port}`)
})


