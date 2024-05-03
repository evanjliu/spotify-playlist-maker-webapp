const zmqUtils = require('../ZeroMQ Modules/zmq-pipes');

exports.createPlaylist = async (req, res) => {
    console.log("Request Received! Now processing...\n")
    try {
        const { numSongs, explicit, selectedGenres } = req.query;
        console.log(req.query)

        // Sends message to playlist-maker microservice
        const result = await zmqUtils.getPlaylist({
            numSongs,
            explicit,
            selectedGenres
        });

        // Define variables
        let playlist = [];
        let cur_track = [];
        let user_explicit = false;
        let duration = 0;
        let totalSeconds = 0;
        let minutes = 0;
        let seconds = 0;
        let final_duration = "";
        let name = "";
        let album = "";
        let artist = "";
        let link = "";


        if (explicit === 'yes'){
            user_explicit = true;
        }

        // Process result and place needed information into playlist array
        for (let i = 0; i < result.length; i++) {
            if ((!result[i].explicit) || (result[i].explicit === user_explicit)) {
                
                // Get duration
                duration = result[i].duration_ms;
                

                totalSeconds = Math.floor(duration / 1000);

                // Calculate minutes and remaining seconds
                minutes = Math.floor(totalSeconds / 60);
                seconds = totalSeconds % 60;

                final_duration = minutes.toString() + ":" + seconds.toString();

                // Get Name
                if (result[i].name){
                    name = result[i].name;
                } else {
                    name = "";
                }
                
                // Get album name
                if (result[i].album.name) {
                    album = result[i].album.name;
                } else {
                    album = "";
                }

                // Get artist_name 
                if (result[i].artists[0].name) {
                    artist = result[i].artists[0].name;
                } else {
                    artist = "";
                }

                if (result[i].external_urls.spotify) {
                    link = result[i].external_urls.spotify;
                } else {
                    link = ""
                }

                // Make current track dictionary
                cur_track = {
                    name: name,
                    album: album,
                    artist_name: artist,
                    duration: final_duration,
                    link_url: link
                };
                playlist.push(cur_track);
            }
            console.log(playlist)
        };

        // Sends status code 200 if successful
        res.status(200).json({message: 'Playlist created successfully', data: playlist});
        console.log('Playlist created successfully');

    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }
};