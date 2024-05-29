const { getAccessToken } = require('./getToken');
const { readAccessToken, saveAccessToken } = require('./accessTokens');
require('dotenv').config();

// Spotify Web API and set up authentication
const SpotifyWebAPI = require('spotify-web-api-node');

const spotify = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://www.spotify.com'
});

async function getToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT) {
        // Get Spotify Tokens from token text files if present
        console.log("Retrieving Access Token...\n")
        let myToken = readAccessToken();
    
        // If tokens were present, use those
        // If not present, get new tokens
        if (myToken.length > 0) {
            console.log('Current Access Token: ', myToken, '\n');
            spotify.setAccessToken(myToken);
        } else {
            // If no token found, get another new token
            console.log('No token was found. Fetching new token...\n')
            myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
    
            // Set access token
            spotify.setAccessToken(myToken);
    
            // Save token to text file
            saveAccessToken(myToken);
            console.log('Current Access Token: ', myToken, '\n');
        }
    
        // Test Token
        // If token is expired, refresh token.
        // If token is incomplete or wrong, get a new token.
        try {
            console.log('Initial token test...\n\n')
            const test = await spotify.searchTracks('Heat Waves', { limit: 3 });
            console.log('Test Data: ', test.body, '\n');
        } catch (error) {
            if (error.statusCode === 401) {
                // Attempt to get new token because the current one is expired or incorrect
                console.log('Token was expired or broken, attempting to get new token...\n', 'Error: ', error, '\n');
                myToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);
    
                // Set access token
                spotify.setAccessToken(myToken);
    
                // Save token to text file
                saveAccessToken(myToken);
                console.log('Current Access Token: ', myToken, '\n');
    
                // Test again
                const retest1 = await spotify.searchTracks('I want it that way', { limit: 3 })
                console.log('Testing Token...\n\nTest Data: ', retest1.body, '\n');
                return myToken;
            }
        }
    
        console.log('Tests successful! Starting up playlist microservice and listening for messages...\n')
        return myToken;
};

async function refreshToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT) {
    console.log("Refreshing Access Token...\n");
        try {
            // Get new token
            const refreshToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT);

            // Set access token
            spotify.setAccessToken(refreshToken);

            // Save token to the txt file
            saveAccessToken(refreshToken);

            // Test using new token
            const retest2 = await spotify.searchTracks("Lover's Oath", { limit: 3 });
            console.log('Testing Token...\n\nTest Data: ', retest2.body, '\n');

        } catch (error) {
            console.error('Refresh did not work, error: ', error);
            return;
        }
};

module.exports = {getToken, refreshToken};