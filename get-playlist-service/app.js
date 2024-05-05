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
    const sock = new zmq.Reply();
    await sock.bind('tcp://*:5555');
    

    // Spotify Token Get
    console.log("Retreiving Access Token...\n")
    let myToken = readAccessToken();
    
    
    if (myToken.length > 0) {
        console.log('Current Token: ', myToken, '\n')
        spotify.setAccessToken(myToken);
    } else {
        // If no token found, get another token, set, and save
        console.log('No token was found. Fetching new token...\n')
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
                // Attempt refresh token because current one is expired or doesn't work
                console.log("Access token expired or incorrect, attempting to refresh token.\n");
                newToken = await refreshAccessToken(myToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT)
                myToken = newToken.body['access_token']

                // Set refreshed token as current token and save
                spotify.setAccessToken(myToken);
                saveAccessToken(myToken)

                // Test again
                const retest1 = await spotify.searchTracks('I want it that way', {limit: 3})
                console.log('Testing Token...\n\nTest Data: ', retest1.body, '\n');

        }
        } catch (error) {
            console.error(error.body)
            console.log('Token was incorrect. Retreiving new token.')

            // Get new token because current one is broken and then set and save token
            myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
            spotify.setAccessToken(myToken);
            saveAccessToken(myToken);

            // Test again
            const retest2 = await spotify.searchTracks('Ruler in my heart', {limit: 3})
            console.log('Testing Token...\n\nTest Data: ', retest2.body, '\n');
        }
    }

    console.log('Tests successful! Starting up playlist microservice and listening for messages...\n')

    // Token Refresh every hour
    setInterval( async () => {
        console.log("Refreshing Access Token...\n");
        try {
        const refreshedToken = await refreshAccessToken(myToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);

        // Set access token
        spotify.setAccessToken(refreshedToken);
        saveAccessToken(refreshedToken);
        myToken = refreshAccessToken;

        } catch (error) {
            console.error(error);
            // Get new token because current one is broken and then set and save token
            myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
            spotify.setAccessToken(myToken);
            saveAccessToken(myToken);

            // Test again
            const retest3 = await spotify.searchTracks("Lover's Oath", {limit: 3});
            console.log('Testing Token...\n\nTest Data: ', retest3.body, '\n');
        }

        console.log("Token Refreshed!\n")
    }, 3600000); // Refresh token every hour

    //-------------------------------------------------
    // Recieve messages and process
    //-------------------------------------------------
    
    // Define variables
    let numSongs = 5;
    let explicit = 'no';
    let genres = ['anime']

    for await (const [msg] of sock) {

        let request = JSON.parse(msg);
        console.log('Recieved Message' + ': ' + msg + '\n');

        // Set User parameters to values to be used to make API call
        numSongs = (request.limit_songs);
        explicit = (request.explicit);
        genres = [request.selectedGenres];

        // Spotify Routes and API Calls
        spotify.getRecommendations({
            seed_genres: genres,
            limit: numSongs
        })
            .then(function(data) {

                const items = data.body.tracks;

                for(let i = 0; i < items.length; i++) {
                    console.log(items[i].name)
                };

                // Send back the playlist with tracks only
                sock.send(JSON.stringify(items));

            }), function(err) {
                console.log('Something went wrong.', err);
            }
    }
};

createPlaylist();