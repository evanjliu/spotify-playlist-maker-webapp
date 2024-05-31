// Define express and controller
const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist-maker-controller');

// Routes
router.get('/get-playlist', playlistController.createPlaylist);
router.get('/get-songs', playlistController.getSongList);
router.get('/get-genres', playlistController.getGenres);
router.get('/put-email', playlistController.sendEmail);

module.exports = router;