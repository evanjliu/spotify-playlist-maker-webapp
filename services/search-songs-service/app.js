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
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
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
    // Set up reply server, which replies to all messages send to port 4444 on local device
    const sock = new zmq.Reply();
    await sock.bind('tcp://*:4444');

    // Get token from text file and check
    let token = await getToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
    spotify.setAccessToken(token);

    // Token Refresh every hour
    // Spotify Tokens expire every hour, so it checks every hour to refresh.
    setInterval(async () => {
        token = await refreshToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
        console.log("Token Refreshed!\n\nReady for incoming requests on port 4444...\n\n");

    }, 3500000); // Refresh token every hour

    //-------------------------------------------------
    // Receive messages and process
    //-------------------------------------------------

    // Define variables
    let songName = "Gurenge";


    // Recieves ZeroMQ messages on port 4444.
    // For every message recieved, processes it and replies in the same port.
    for await (const [msg] of sock) {

        let request = JSON.parse(msg);
        console.log('Received Message' + ': ' + msg + '\n');

        // Set User parameters to values to be used to make API call
        songName = (request.song_name);
        // Spotify Routes and API Calls
        try {
            spotify.searchTracks(songName, { limit: 15 })
                .then(function (data) {

                    const items = data.body.tracks;
                    // Prints song name to console
                    for (let i = 0; i < items.items.length; i++) {
                        console.log(i + 1, ': Song Name - ', items.items[i].name)
                    };
                    
                    // Send back the playlist with tracks info only. See:
                    // https://developer.spotify.com/documentation/web-api/reference/get-recommendations
                    // for how the tracks object is formatted.
                    sock.send(JSON.stringify(items));

                }), function (err) {
                    console.error('Something went wrong.', err);
                }
        } catch(error) {
            console.log('Attempting to get new token...\n')
            token = await refreshToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
            
            // After getting token, retries the request
            spotify.searchTracks(songName, { limit: 15 })
                    .then(function (data) {
                        // Send back the playlist with tracks info only. See:
                        // https://developer.spotify.com/documentation/web-api/reference/get-recommendations
                        // for how the tracks object is formatted.
                        const items = data.body.tracks;
    
                        // Prints song name to console
                        for (let i = 0; i < items.length; i++) {
                            console.log(i + 1, ': Song Name - ', items[i].name)
                        };

                        // Send back song list with song info.
                        sock.send(JSON.stringify(songsList[0]));
    
                    }), function (err) {
                        console.error('Something went wrong.', err);
                        sock.send(JSON.stringify({error: error}));
                    }
        }
    };

}

createPlaylist();
