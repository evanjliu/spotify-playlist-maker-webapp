const zmqUtils = require('../ZeroMQ Modules/zmq-pipes');

exports.createPlaylist = async (req, res) => {
    try {
        const { selectedGenres, numSongs, explicit } = req.body;

        // Sends message to playlist-maker microservice
        const result = await zmqUtils.getPlaylist({
            selectedGenres,
            numSongs,
            explicit
        });

        // Process result here
        
        
        // Sends status code 200 if successful
        res.status(200).json({message: 'Playlist created successfully', data: result});

    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }
};