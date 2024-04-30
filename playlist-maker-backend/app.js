// Modules setup
const express = require('express')
require('dotenv').config();

// Middleware setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// ZeroMQ setup
const zmq = require('zeromq');
const request = new zmq.Request();


//--------------------------------------------------------------
// Routes
//--------------------------------------------------------------
const routes = require('./src/routes/routes');
app.use ('/get-playlist', routes);

/*
app.post('/get-playlist'), async (req, res) => {
    const data = req.body;
};
*/


// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});