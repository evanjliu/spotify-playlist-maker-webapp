// Modules setup
const express = require('express')

// Middleware setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//--------------------------------------------------------------
// Routes
//--------------------------------------------------------------
const routes = require('./src/routes/routes');
app.use ('/', routes);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});