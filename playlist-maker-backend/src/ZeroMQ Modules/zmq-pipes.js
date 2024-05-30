const zmq = require('zeromq');

//-------------------------------------------
// GET PLAYLIST
//-------------------------------------------
exports.getPlaylist = async (message) => {
    // Create new socket and to a new port
    const sock = new zmq.Request();
    sock.connect('tcp://localhost:5555'); 

    // Convert message to string (or any other format required)
    const stringifiedMessage = JSON.stringify(message);

    // Send message and await response
    sock.send(stringifiedMessage);
    const [response] = await sock.receive();

    // Parse response (if necessary) and return
    return JSON.parse(response.toString());
};

//-------------------------------------------
// GET SONGS
//-------------------------------------------
exports.getSongs = async (message) => {
    // Create new socket and to a new port
    const sock = new zmq.Request();
    sock.connect('tcp://localhost:4444'); 

    // Convert message to string (or any other format required)
    const stringifiedMessage = JSON.stringify(message);

    // Send message and await response
    sock.send(stringifiedMessage);
    const [response] = await sock.receive();

    // Parse response (if necessary) and return
    return JSON.parse(response.toString());
};

//-------------------------------------------
// GET GENRES
//-------------------------------------------
exports.getGenres = async (message) => {
    // Create new socket and to a new port
    const sock = new zmq.Request();
    sock.connect('tcp://localhost:3333'); 

    // Convert message to string (or any other format required)
    const stringifiedMessage = JSON.stringify(message);

    // Send message and await response
    sock.send(stringifiedMessage);
    const [response] = await sock.receive();

    // Parse response (if necessary) and return
    return JSON.parse(response.toString());
};