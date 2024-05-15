const zmqUtils = require('../ZeroMQ Modules/zmq-pipes');

exports.createPlaylist = async (req, res) => {
    console.log("Request Received! Now processing...\n")
    try {
        const { numSongs, explicit, selectedGenres } = req.query;
        console.log('Current Request: ', req.query)

        let mod_arr = [];
        let myPlaylist = [];
        let cur_track_count = 0;
        let i = 0;
        let response = [];
        let limit_songs = parseInt(numSongs);

        // If explicit is checked, request a larger amount of tracks to limit API calls.
        // The limit can be increased to a maximum of 80 unless limit_songs is already over 80.

        while (explicit === "no" && limit_songs < 70 && limit_songs < (parseInt(numSongs) * 5)) {
            limit_songs += 10;
        };

        // Sends message to playlist-maker microservice
        while ((i < 3) && (cur_track_count < numSongs)) {
            response = await zmqUtils.getPlaylist({
                limit_songs: limit_songs,
                explicit: explicit,
                selectedGenres: selectedGenres
            });

            mod_arr = makePlaylistArray(response, numSongs, explicit, myPlaylist)

            myPlaylist = mod_arr[0]
            cur_track_count = mod_arr[1]

            i++;
        }

        console.log('Playlist: ', myPlaylist, '\nNumber of Spotify API requests:' , i, '\n');

        if (cur_track_count == 0) {
            res.status(400).json({error: 'Genres are too specific, or the too many songs were explicit while the explicit filter was specified.'});
        } else if ( cur_track_count < numSongs) {
            // Sends status code 200 if successful
            res.status(200).json({message: "Playlist created successfully, but there weren't enough songs to fill the playlist.", data: myPlaylist});
            console.log('Playlist created successfully, but not enough songs to make playlist.\n');
        } else {
            // Sends status code 200 if successful
            res.status(200).json({message: 'Playlist created successfully\n', data: myPlaylist});
            console.log('Playlist created successfully\nReady for a new request...\n');
        }

    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }
};

function makePlaylistArray(result, song_limit, explicit, cur_playlist) {
            // Define variables
            let playlist = cur_playlist;
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
            let i = 0;
    
            if (explicit === 'yes'){
                user_explicit = true;
            }
    
            // Process result and place needed information into playlist array
            while ((i < result.length) && (playlist.length < song_limit)) {
                if ((!result[i].explicit) || (result[i].explicit === user_explicit)) {

                    // Get duration
                    duration = result[i].duration_ms;
                    
    
                    totalSeconds = Math.floor(duration / 1000);
    
                    // Calculate minutes and remaining seconds
                    minutes = Math.floor(totalSeconds / 60);
                    seconds = totalSeconds % 60;
    
                    final_duration = minutes.toString() + ":" + seconds.toString().padStart(2, '0');
    
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
                // Increase index
                i++;
            };

            return [playlist, playlist.length]
};