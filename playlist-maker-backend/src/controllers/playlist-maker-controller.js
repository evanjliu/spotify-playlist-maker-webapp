const { response } = require('express');
const zmqUtils = require('../ZeroMQ Modules/zmq-pipes');
const fs = require('fs');
const path = require('path');

//----------------------------------------------------------------------
// GET PLAYLIST
//----------------------------------------------------------------------
exports.createPlaylist = async (req, res) => {
    console.log("Request Received! Now retrieving playlist...\n\n")
    try {
        const { numSongs, explicit, selectedGenres } = req.query;
        console.log('Current Request to Port 5555: ', req.query)

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

            mod_arr = makePlaylistArray(response, numSongs, explicit, myPlaylist);

            myPlaylist = mod_arr[0];
            cur_track_count = mod_arr[1];

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

//----------------------------------------------------------------------
// GET SONGS LIST
//----------------------------------------------------------------------
exports.getSongList = async (req, res) => {
    console.log("Request Received! Now getting list of songs...\n\n")
    try {
        const { song_name } = req.query;
        console.log('Current Request to Port 4444: ', req.query)

        let mod_arr = [];
        let myPlaylist = [];
        let cur_track_count = 0;
        let response = [];
        let numSongs = 15;

        // Sends message to song-search microservice
        response = await zmqUtils.getSongs({
            num_songs: numSongs,
            song_name: song_name,
            explicit: 'yes'
        });

        // Make playlist
        mod_arr = makeSongArray(response.items, numSongs, 'yes', myPlaylist);
        myPlaylist = mod_arr[0];
        cur_track_count = mod_arr[1];

        console.log('Playlist: ', myPlaylist, '\nNumber of Spotify API requests: 1\n');

        if (cur_track_count == 0) {
            res.status(400).json({error: 'Song does not exist, or an error occured.'});
        } else if ( cur_track_count < numSongs) {
            // Sends status code 200 if successful
            res.status(200).json({message: "Songs retreived successfully, but there weren't enough songs to fill the search.", data: myPlaylist});
            console.log('Playlist created successfully, but not enough songs matched the given name.\n');
        } else {
            // Sends status code 200 if successful
            res.status(200).json({message: 'Songs list created successfully\n', data: myPlaylist});
            console.log('Song list created successfully\nReady for a new request...\n');
        }

    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }

};

//----------------------------------------------------------------------
// GET GENRES
//----------------------------------------------------------------------
exports.getGenres = async (req, res) => {
    console.log("Request Received! Now getting list of genres...\n\n")
    try {
        const { song_id } = req.query;
        console.log('Current Request to Port 3333: ', req.query)

        // Sends message to song-search microservice
        let response = await zmqUtils.getGenres({
            song_id: song_id,
        });

        console.log('Data ', response, '\nNumber of Spotify API requests: 1\n');
        let genres = response;

        if (!genres) {
            res.status(400).json({error: 'No genres are available for this song, or an error occured.'});
        } else {
            // Sends status code 200 if successful
            res.status(200).json({message: 'Genres retreived successfully\n', data: genres});
            console.log('\nReady for a new request...\n');
        }
    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }
};

//----------------------------------------------------------------------
// SEND EMAIL
//----------------------------------------------------------------------
exports.sendEmail = async (req, res) => { 
    console.log("Request Received! Now sending email...\n\n")
    try {
        const { emailAddress, playlist } = req.query;
        console.log('Current Request to Port 2222: ', req.query);

        let response = await zmqUtils.sendEmail({
            emailAddress: emailAddress,
            playlist: playlist
        });

        console.log('Response: ', response, '\n');

        if (!response) {
            res.status(200).json({message: 'Error, email was not sent\n', data: response});
            console.log('\nReady for new request...\n');
        } else {
            // Sends status code 200 if successful
            res.status(200).json({message: 'Email sent successfully.\n', data: response});
            console.log('\nReady for new request...\n');
        };
    } catch (error) {
        console.error(error);

        // Sends status code 500 if unsuccessful
        res.status(500).json({error: 'Internal server error'});
    }
};

//----------------------------------------------------------------------
// DOWNLOAD PLAYLIST AS CSV (FROM TEAMMATE)
//----------------------------------------------------------------------
exports.getCSV = async (req, res) => {
    console.log("Request Received! Now generating CSV...\n\n");

    const { playlist } = req.query;
    const filePath = path.resolve(__dirname, '../../../CSV-conversion-pipe.txt');

    let response = [
        "convert",
        playlist
    ];

    // Verify directory exists or create it
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the request to the pipe.txt file in JSON format
    fs.writeFile(filePath, JSON.stringify(response, null, 2), (err) => {
        if (err) {
            console.error("Failed to write to file:", err);
            res.status(500).send('Failed to initiate conversion');
            return;
        }

        console.log("Request written to pipe.txt successfully.");

        // Start monitoring the file for changes to detect when the CSV is ready
        monitorFileChanges(filePath, res);
    });
};

//----------------------------------------------------------------------
// DOWNLOAD PLAYLIST AS JSON
//----------------------------------------------------------------------
exports.getJSON = async (req,res) => {
    console.log("Request Received! Now sending email...\n\n")


};

//----------------------------------------------------------
// Make Playlist Array for Song Information
//----------------------------------------------------------
function makePlaylistArray(result, song_limit, explicit, cur_playlist) {
            // Define variables
            let playlist = cur_playlist;
            let cur_track = [];
            let user_explicit = false;
            let duration = "";
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
                    duration = getDuration(result[i].duration_ms);

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
                        duration: duration,
                        link_url: link
                    };
                    playlist.push(cur_track);
                    
                }
                // Increase index
                i++;
            };

            return [playlist, playlist.length]
};

//----------------------------------------------------------
// Make Song Array with Spotify ID 
//----------------------------------------------------------
function makeSongArray(result, song_limit, explicit, cur_playlist) {
    // Define variables
    let playlist = cur_playlist;
    let cur_track = [];
    let user_explicit = false;
    let duration = "";
    let name = "";
    let album = "";
    let artist = "";
    let link = "";
    let id = "";
    let i = 0;

    if (explicit === 'yes'){
        user_explicit = true;
    }

    // Process result and place needed information into playlist array
    while ((i < result.length) && (playlist.length < song_limit)) {
        if ((!result[i].explicit) || (result[i].explicit === user_explicit)) {

            // Get duration
            duration = getDuration(result[i].duration_ms);

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

            if (result[i].id) {
                id = result[i].id;
            } else {
                id = ""
            }

            // Make current track dictionary
            cur_track = {
                name: name,
                album: album,
                artist_name: artist,
                duration: duration,
                link_url: link,
                id: id
            };
            playlist.push(cur_track);
        }
        // Increase index
        i++;
    };

    return [playlist, playlist.length]
};

//----------------------------------------------------------
// Gets duration from milliseconds
//----------------------------------------------------------
function getDuration(duration) {               
    let totalSeconds = Math.floor(duration / 1000);

    // Calculate minutes and remaining seconds
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let final_duration = minutes.toString() + ":" + seconds.toString().padStart(2, '0');

    return final_duration;
};

//----------------------------------------------------------
// Monitors and returns file path for CSV
//----------------------------------------------------------
function monitorFileChanges(filePath, res) {
    let responseSent = false;  // Flag to track whether a response has been sent

    const watcher = fs.watch(filePath, (eventType, filename) => {
        if (eventType === 'change') {
            console.log(`File ${filename} has been modified`);

            // Retry reading the file up to 5 times in case of incomplete data
            let attempts = 0;
            const maxAttempts = 5;

            const readAndParseFile = () => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error("Error reading the file after changes:", err);
                        if (!responseSent) {
                            res.status(500).json({ error: "Failed to read the file" });
                            responseSent = true;
                        }
                        return;
                    }

                    try {
                        let jsonData = JSON.parse(data);
                        if (jsonData.csv_path && !responseSent) {
                            console.log("CSV file path detected, conversion confirmed.");
                            const csvFullPath = path.resolve(jsonData.csv_path);
                            res.download(csvFullPath, 'My_Playlist.csv', (err) => {
                                if (err) {
                                    console.error("Error downloading the file:", err);
                                    res.status(500).send("Failed to download the playlist.");
                                }
                            });
                            responseSent = true;
                            console.log("Ready for more requests...\n");
                            watcher.close();
                        }
                    } catch (parseErr) {
                        attempts += 1;
                        if (attempts < maxAttempts) {
                            console.log("Retrying to read and parse the file...");
                            setTimeout(readAndParseFile, 1000); // Retry after 1 second
                        } else {
                            console.error("Error parsing JSON data from file:", parseErr);
                            if (!responseSent) {
                                res.status(500).json({ error: "Error parsing JSON data" });
                                responseSent = true;
                                console.log("Ready for more requests...\n");
                            }
                        }
                    }
                });
            };

            readAndParseFile();
        }
    });
}