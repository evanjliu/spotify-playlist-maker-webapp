// ZeroMQ and other modules
const zmq = require('zeromq');
const fs = require('fs');

// Import get token functions
const {getAccessToken} = require('./src/getToken');
const {refreshAccessToken} = require('./src/refreshAccessToken');
const {readAccessToken, saveAccessToken} = require('./src/accessTokens');

// Define Spotify credentials
const CLIENT_ID = '4941ac63e50843f8871d981fc9fc72e8';
const CLIENT_SECRET = '47d120af57df4f8099ea8c0fe2e7b88d';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Spotify Web API
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
    console.log('Microservice is up and Running. \n\nNow waiting for messages...\n');

    // ZeroMQ sockets
    /*
    const sock = new zmq.Reply();
    await sock.bing('tcp://*:1111');
    */

    // Spotify Token Get
    console.log("Retreiving Access Token...\n")
    let myToken = readAccessToken();
    
    console.log('Current Token: ', myToken, '\n')
    
    if (myToken.length > 0) {
        console.log('Access Token Found.\n');
        spotify.setAccessToken(myToken);
    } else {
        myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
        spotify.setAccessToken(myToken);
        saveAccessToken(myToken)
    }

    // Test Token
    // If token is expired, refresh token. 
    // If token is incomplete or wrong, gets a new token.
    try {
        const test = await spotify.searchTracks('Heat Waves', {limit: 3})
        console.log('Testing Token...\n\nTest Data: ', test.body, '\n');
        
    } catch (error) {
        try {
            if (error.statusCode === 401) {
                console.log("Access token expired or incorrect, attempting to refresh token.\n");
                newToken = await refreshAccessToken(myToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT)
                myToken = newToken.body['access_token']
        }
        } catch (error) {
            console.error(error.body)
            console.log('Token was incorrect. Retreiving new token.')
            myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
            spotify.setAccessToken(myToken);
            saveAccessToken(myToken);
        }
    }

    // Token Refresh every hour
    setInterval( async () => {
        console.log("Refreshing Access Token...\n");
        const refreshedToken = await refreshAccessToken(myToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);

        // Set access token
        spotify.setAccessToken(refreshedToken);
        console.log("Token Refreshed!\n")
    }, 3600000); // Refresh token every hour

    // Spotify Routes and API Calls
    spotify.getRecommendations({
        seed_genres: ['classical', 'pop'],
        limit: 3
    })
        .then(function(data) {
            const recs = data.body;
            console.log('Recommended Tracks Object: ', recs);

            const items = data.body.tracks;
            console.log(items);

            for(let i = 0; i < items.length; i++) {
                console.log(items[i].name)
            };

        }), function(err) {
            console.log('Something went wrong.', err);
        }
};

createPlaylist();