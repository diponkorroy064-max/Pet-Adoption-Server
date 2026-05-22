const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cors = require('cors')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URL

const express = require('express');
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

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


const JWkS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
    const authHeader = req?.headers.authorization;
    // console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized.." })
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    console.log(token);

    try {
        const { payload } = await jwtVerify(token, JWkS);
        console.log("payload", payload);
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Forbidden" })
    }
};


const run = async () => {
    try {
        // await client.connect();

        // database connection---
        const db = client.db("pet-adoption-database");
        const petsCollection = db.collection('pets');
        const adoptRequestCollection = db.collection("adoption");


        // get all data from mongodb---
        app.get('/pets/all', async (req, res) => {
            const result = await petsCollection.find().toArray();
            res.json(result);
        })


        // GET all pets with search + filter
        app.get('/pets', async (req, res) => {
            try {
                const search = req.query.search || "";
                const species = req.query.species || "";

                let query = {};

                // Search by pet name using regex
                if (search) {
                    query.petName = {
                        $regex: search,
                        $options: "i"
                    };
                }

                // Filter by species using $in
                if (species) {
                    const speciesArray = species.split(',');

                    query.species = {
                        $in: speciesArray
                    };
                }

                const result = await petsCollection.find(query).toArray();

                res.send(result);

            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        });



        // api-- geting id based data from database---
        app.get('/pets/:petId/byId', verifyToken, async (req, res) => {
            const { petId } = req.params;
            const result = await petsCollection.findOne({ _id: new ObjectId(petId) })
            res.json(result);
        })


        // get email based all data from mongodb---
        app.get('/pets/:email', verifyToken, async (req, res) => {
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
        app.patch('/pets/:petId/update', verifyToken, async (req, res) => {
            const { petId } = req.params;
            const updatedPetData = req.body;
            console.log(updatedPetData);

            const result = await petsCollection.updateOne(
                { _id: new ObjectId(petId) },
                { $set: updatedPetData });

            res.json(result);
        })


        // delete info. api---
        app.delete('/pets/:id/delete', verifyToken, async (req, res) => {
            const { id } = req.params;
            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        })


        // insert adoption request Data---
        app.post('/adoption', verifyToken, async (req, res) => {
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
        app.get('/adoption/:ID/newId', async (req, res) => {
            const { ID } = req.params;
            const result = await adoptRequestCollection.find({ petId: ID }).toArray();
            res.json(result);
        })


        // get email based adoptRequestdata ---
        app.get('/adoption/:email/userEmail', verifyToken, async (req, res) => {
            const { email } = req.params;
            const result = await adoptRequestCollection.find({ email: email }).toArray();
            res.json(result);
        })


        // cancel adoption request---
        app.delete('/adoption/:id/byPetId', verifyToken, async (req, res) => {
            const { id } = req.params;
            const result = await adoptRequestCollection.deleteOne({ petId: id });
            res.json(result);
        })


        // update api for reject and approve button action----
        app.patch('/adoption/:petId/update', verifyToken, async (req, res) => {
            const { petId } = req.params;
            const updatedReqData = req.body;
            console.log(updatedReqData);

            const result = await adoptRequestCollection.updateOne(
                { petId: petId },
                { $set: updatedReqData });

            res.json(result);
        })



        // await client.db("admin").command({ ping: 1 });
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


