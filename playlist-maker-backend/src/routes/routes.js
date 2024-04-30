// Define express and controller
const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist-maker-controller');

// Routes
router.post('/get-playlist', playlistController.createPlaylist);

module.exports = router;