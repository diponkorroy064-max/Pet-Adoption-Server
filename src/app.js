const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes---
app.use('/', routes);

// Health check endpoint---
app.get('/', (req, res) => {
    res.send('PetHaven API is running operational!');
});

module.exports = app;

