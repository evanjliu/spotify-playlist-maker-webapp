// ZeroMQ and other modules
const zmq = require('zeromq');

// Import get token functions
// Currently refresh token does not work and is unused
const {getToken, refreshToken} = require('./src/checkTokens');
require('dotenv').config();

// -----------------------------------------------------------------------------------------------------------
// Define Spotify credentials here
// INSTRUCTIONS TO GET SPOTIFY CLIENT CREDENTIALS: 
// URL: https://developer.spotify.com/documentation/web-api 
// 
// 1: Log into spotify account.
// 2: Create a developer app and select "Web API" when asked about which API you want to use.
// 3: Navigate to your account dashboard and copy/paste your CLIENT_ID and CLIENT_SECRET into these variables.
// -----------------------------------------------------------------------------------------------------------
const CLIENT_ID = '4941ac63e50843f8871d981fc9fc72e8';
const CLIENT_SECRET = 'dd1e38cefac245d892cab1e05eb92737';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Spotify Web API and set up authentication
const SpotifyWebAPI = require('spotify-web-api-node');
const spotify = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://www.spotify.com'
});

// ---------------------------------------
// FUNCTION TO CREATE PLAYLIST
// ---------------------------------------
async function createPlaylist() {
    console.log('Microservice is up and Running. \n');

    // ZeroMQ sockets
    // Set up reply server, which replies to all messages send to port 3333 on local device
    const sock = new zmq.Reply();
    await sock.bind('tcp://*:3333');

    // Get token from text file and check
    let token = await getToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
    spotify.setAccessToken(token);

    // Token Refresh every hour
    // Spotify Tokens expire every hour, so it checks every hour to refresh.
    setInterval(async () => {
        token = await refreshToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
        console.log("Token Refreshed!\n\nReady for incoming requests on port 3333...\n\n");

    }, 3500000); // Refresh token every hour

    //-------------------------------------------------
    // Receive messages and process
    //-------------------------------------------------

    // Define variables
    let songId = "0qMip0B2D4ePEjBJvAtYre";
    let artistId = "0blbVefuxOGltDBa00dspv";
    let genres = [];

    // Recieves ZeroMQ messages on port 3333.
    // For every message recieved, processes it and replies in the same port.
    for await (const [msg] of sock) {
        let request = JSON.parse(msg);
        console.log('Received Message' + ': ' + msg + '\n');

        // Set User parameters to values to be used to make API call
        songId = (request.song_id);

        // Spotify Routes and API Calls
        try {
            // Get track for album ID
            spotify.getTrack(songId)
                .then(function (data) {

                    artistId = data.body.artists[0].id;
                    console.log("Artist ID: ", artistId);

                    spotify.getArtist(artistId)
                        .then(function (data) {

                            genres = data.body.genres;
                            console.log("Genres: ", genres);

                            // Send back the playlist with tracks info only. See:
                            // https://developer.spotify.com/documentation/web-api/reference/get-recommendations
                            // for how the tracks object is formatted.
                            sock.send(JSON.stringify(genres));

                            }), function (err) {
                            console.error('Something went wrong.', err);
                        }
                    }), function (err) {
                    console.error('Something went wrong.', err);
                }


        } catch(error) {
            console.log('Something went wrong with first attempt...Attempting to get new token...\n');
            token = await refreshToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
            
            // After getting token, retries the request
            spotify.getTrack(songId)
                    .then(function (data) {
                        // Send back the playlist with tracks info only. See:
                        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations
                        // for how the tracks object is formatted.
                        const items = data.body.album.id;
                        console.log("Items: ", items);

                        // Send back song list with song info.
                        sock.send(JSON.stringify(items));
    
                    }), function (err) {
                        console.error('Something went wrong.', err);
                        sock.send(JSON.stringify({error: error}));
                    }
        }
    };

}

createPlaylist();
