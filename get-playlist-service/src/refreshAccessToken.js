const axios = require('axios');

async function refreshAccessToken(accessToken, CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT) {
    try {
        const response = await axios.get(TOKEN_ENDPOINT, {
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
            console.log('Access Token refreshed:', accessToken);
            return accessToken;
        } else {
            console.error('Failed to refresh access token:', response.statusText);
        }
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
    }
}

module.exports = {refreshAccessToken};