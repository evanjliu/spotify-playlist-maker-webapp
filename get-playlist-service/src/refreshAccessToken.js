const axios = require('axios');

let expiryTime = 0;   // Store the expiry time (in milliseconds)

async function refreshAccessToken(accessToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT) {
    try {
        const response = await axios.post(TOKEN_ENDPOINT, {
            grant_type: 'refresh_token',
            refresh_token: accessToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            accessToken = response.data.access_token;
            expiryTime = Date.now() + (response.data.expires_in * 1000); // Update expiry time
            console.log('Access Token refreshed:', accessToken);
        } else {
            console.error('Failed to refresh access token:', response.statusText);
        }
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
    }
}

// Function to check if the token needs refreshing periodically
function checkTokenExpiry() {
    if (Date.now() >= expiryTime) {
        // Token expired or about to expire, refresh it
        refreshAccessToken(refreshToken);
    }
}

function isAccessTokenExpired() {
    return Date.now() >= tokenExpirationTime;
}

module.exports = {refreshAccessToken};