// Modules import
const fs = require('fs');
const TOKEN_PATH = './token/token.txt';

function saveAccessToken (token){
    try {
        fs.writeFileSync(TOKEN_PATH, token)

        console.log('Access Token Saved!\n')
    } catch (error) {
        console.log('Error saving to file. Error: ', error)
    }
};

function readAccessToken () {
    return fs.readFileSync(TOKEN_PATH, 'utf8')
};

module.exports = { saveAccessToken, readAccessToken }