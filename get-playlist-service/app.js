// ZeroMQ
const zmq = require('zeromq');

// Import get token functions
const {getAccessToken} = require('./src/getToken');
const {refreshAccessToken} = require('./src/refreshAccessToken');

// Define Spotify credentials
const CLIENT_ID = '4941ac63e50843f8871d981fc9fc72e8';
const CLIENT_SECRET = '47d120af57df4f8099ea8c0fe2e7b88d';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
let cur_tok = 'BQBeYCm_hWLCdk1CVadCJp2yzOuYg44UKRu1bKlezQh9UUzhCVKVfyV41GPUS0UXuKYcBnt-hyDSR1vG2XfSlZ_COiC2aP5n3MsJCrBLLfbg2OLPddc';

// Spotify web api
const SpotifyWebAPI = require('spotify-web-api-node');
const spotify = new SpotifyWebAPI ({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'http://www.spotify.com'
});

// ---------------------------------------
// FUNCTION
// ---------------------------------------
async function createPlaylist() {
    console.log('Microservice is up and Running. \nNow waiting for messages...\n');

    // ZeroMQ sockets
    /*
    const sock = new zmq.Reply();
    await sock.bing('tcp://*:1111');
    */

    // Spotify Token
    if (!cur_tok) {
        console.log("Retreiving Access Token...\n")
        let myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
        spotify.setAccessToken(myToken);
    } else {
        myToken = cur_tok;
        spotify.setAccessToken(myToken);
    }
    
    // Token Refresh every hour
    setInterval( async () => {
        console.log("Refreshing Access Token...\n");
        const refreshedToken = await refreshAccessToken(myToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);

        // Set access token
        spotify.setAccessToken(refreshedToken);
        console.log("Token Refreshed!")
    }, 3600000); // Refresh token every hour

    console.log('My Token: ', myToken, '\n')

    // Spotify Routes and API
    spotify.searchTracks('Ruler in my Heart', { limit:10 })
        .then(function(data) {
            console.log('Searching by "Ruler in my Heart');

            // Testing
            const items = data.body.tracks.items;
            for(let i = 0; i < items.length; i++) {
                console.log(items[i].name)
            };
        }, function(err) {
            console.error(err);
        });
};

createPlaylist();