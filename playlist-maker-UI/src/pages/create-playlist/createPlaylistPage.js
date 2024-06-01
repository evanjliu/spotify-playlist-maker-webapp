// Import dependencies
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect} from 'react';
import axios from 'axios';

// Import components
import PopUp from "../../components/PopupBox";
import SongTable from '../../components/songTable';

// Page
function CreatePlaylistPage ({setPlaylist, popUp, setPopUp}) {
    // Redirects when called
    const redirect = useNavigate();

    // List of Genres
    const allGenres = [
        "acoustic","afrobeat","alt-rock","alternative","ambient","anime","black-metal",
        "bluegrass","blues","bossanova","brazil","breakbeat","british","cantopop","chicago-house",
        "children","chill","classical","club","comedy","country","dance","dancehall",
        "death-metal","deep-house","detroit-techno","disco","disney","drum-and-bass","dub",
        "dubstep","edm","electro","electronic","emo","folk","forro","french","funk","garage",
        "german","gospel","goth","grindcore","groove","grunge","guitar","happy","hard-rock",
        "hardcore","hardstyle","heavy-metal","hip-hop","holidays","honky-tonk","house","idm",
        "indian","indie","indie-pop","industrial","iranian","j-dance","j-idol","j-pop","j-rock",
        "jazz","k-pop","kids","latin","latino","malay","mandopop","metal","metal-misc","metalcore",
        "minimal-techno","movies","mpb","new-age","new-release","opera","pagode","party",
        "philippines-opm","piano","pop","pop-film","post-dubstep","power-pop","progressive-house",
        "psych-rock","punk","punk-rock","r-n-b","rainy-day","reggae","reggaeton","road-trip","rock",
        "rock-n-roll","rockabilly","romance","sad","salsa","samba","sertanejo","show-tunes",
        "singer-songwriter","ska","sleep","songwriter","soul","soundtracks","spanish","study",
        "summer","swedish","synth-pop","tango","techno","trance","trip-hop","turkish","work-out",
        "world-music"
    ];
    
    // Load session storage details if available
    const initialSelectedGenres = JSON.parse(sessionStorage.getItem('genres')) || [];
    const initialNumSongs = parseInt(sessionStorage.getItem('num-songs')) || 20;
    const initialExplicit = JSON.parse(sessionStorage.getItem('explicit')) || "no";
    const initialGenreOptions = JSON.parse(sessionStorage.getItem('genre-options')) || allGenres;

    // Loads the playlist from local storage. If none, sets to empty array.
    const playlist = JSON.parse(sessionStorage.getItem('playlist')) || [''];

    // Declare real time variables using useState
    const [selectedGenres, setSelectedGenres] = useState(initialSelectedGenres);
    const [numSongs, setNumSongs] = useState(initialNumSongs);
    const [explicit, setExplicit] = useState(initialExplicit);
    const [genreOptions, setGenreOptions] = useState(initialGenreOptions);
    const [currentGenre, setCurrentGenre] = useState('');
    const [currentPlaylist, setCurrentPlaylist] = useState(playlist);
    const [songName, setSongName] = useState('');
    const [songs, setSongs] = useState([]);  
    const [showSongTable, setShowSongTable] = useState(false);
    const [currentSongName, setCurrentSongName] = useState('');
    const [genres, setGenres] = useState([]);

    // Sets real time variables to local storage when changed
    useEffect(() => {
        sessionStorage.setItem('genres', JSON.stringify(selectedGenres));
        sessionStorage.setItem('num-songs', numSongs);
        sessionStorage.setItem('explicit', JSON.stringify(explicit));
        sessionStorage.setItem('genre-options', JSON.stringify(genreOptions));
        sessionStorage.setItem('playlist', JSON.stringify(currentPlaylist));
        }, 
        [selectedGenres, numSongs, explicit, genreOptions, currentPlaylist]
    );

    // Handler for genre selection
    const handleGenreSelection = (e) => {
        if (selectedGenres.length < 5) {
            const genre = e.target.value;
            setSelectedGenres([...selectedGenres, genre]);
            setGenreOptions(genreOptions.filter(option => option !== genre));
        } else {
            alert('You can only select up to 5 genres.');
            setCurrentGenre('')
        };
    };

    // Handler for removing genre
    const handleRemoveGenre = (genre) => {
        setSelectedGenres(selectedGenres.filter(g => g !== genre));
        setGenreOptions(prevOptions => {
            const updatedOptions = [...prevOptions, genre].sort();
            return updatedOptions;
        });
    };
    // Handler for changing number of songs
    const handleNumSongsChange = (e) => {
        setNumSongs(parseInt(e.target.value));
    };

    // Handler for changing name of song
    const handleSongNameChange = (e) => {
        setSongName(e.target.value);
    }
    
    // Handler for updating explicit variable
    const handleExplicitChange = (e) => {
        setExplicit(e.target.value);
    };

    // Handler for reset button
    const handleReset = () => {
        let resetConfirm = window.confirm("Are you sure you want to reset?")
        if (resetConfirm) {
            setSelectedGenres([]);
            setNumSongs(20);
            setExplicit("no");
            setGenreOptions(allGenres);
            setSongs([]);
            setShowSongTable(false);
            setCurrentSongName('');
            setCurrentGenre([]);
            setSongName('');
            setCurrentPlaylist([]);
        }
    };

    // Handler for popup
    const handlePopUp = () => {
        setPopUp(!popUp)
    }

    // Handler for searching a song
    const handleGetSong = async (e) => {
        e.preventDefault();

        axios.get('get-songs', {
            params: {
                song_name: songName
            }
        })
        .then(response => {
            console.log(response.data.data);
            setSongs(response.data.data);
        })
        .catch(error => {
            console.error("Error: ", error.response.status);
            if (error.response.status === 400) {
                alert("Not enough songs were available to make a list.");
            } else {
                alert("Internal server error. Request could not be completed.");
            }
        });
    };

    // Handler for Retrieving Genres of a Song
    const handleSelectSong = (songId, songName) => {
        console.log("Selected song ID:", songId);
        setShowSongTable(false);
        setCurrentGenre([]);

        axios.get('get-genres', {
            params: {
                song_id: songId
            }
        })
        .then(response => {
            console.log("Message: ", response.data.message, "Genre Data: ", response.data.data);
            setGenres(response.data.data);
            setCurrentSongName(songName);
        })
        .catch(error => {
            console.error("Error: ", error.response.status);
            if (error.response.status === 400) {
                alert("Genres were not retrieved. Song may be unavailable in database.");
            } else {
                alert("Internal server error. Request could not be completed.");
            }
        });
    };
    
    // Handler for when the SUBMIT button is clicked
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedGenres.length < 1){
            alert("Please select at least 1 genre.");
            return;
        }
        let confirm = window.confirm("Are you sure you want to proceed with these selected parameters?\n\n Any generated playlists will be lost to the void.");
        
        if (confirm) {
            // GET request to the backend to generate a playlist
            axios.get('/get-playlist', {
                params: {
                    numSongs: numSongs,
                    explicit: explicit,
                    selectedGenres: selectedGenres.join(','),
                }
            })
                .then(response => {
                    console.log(response.data.data);
                    setPlaylist(response.data.data);
                    setCurrentPlaylist(response.data.data);

                    setTimeout(() => {
                        redirect('/playlist');
                    }, 500) 
                    
                })
                .catch(error => {
                    console.error(error.response.status);
                    console.log(error.status)
                    if (error.response.status === 400) {
                        if (explicit === "no") {
                        alert("Not enough songs were available to make a playlist. Your genres might be too specific or if you requested no explicit songs, there might have not been enough non-explicit songs to fulfill your request.");
                        } else {
                            alert("Not enough songs were available to make a playlist. Your genres might be too specific");
                        }
                    } else {
                        alert("Internal server error. Request could not be completed.");
                    }
                });
        }
            
    };

    return (
        <div>
            <h1>Create Playlist</h1>
            <p><b>Instructions: </b>In order to create a personalized playlist, select one or more of the following provided genres. You can also specify how many songs you would like in the playlist, and whether to include explicit songs.</p>
            <p className="center-text"><span className="link" onClick={handlePopUp}>Click here</span> to learn more about how personalization works!</p>
            {popUp && <PopUp onClose={handlePopUp} setPopUp={setPopUp} />}
            
            <section className="playlist-forms-container">
                <form onSubmit={handleGetSong} className="playlist-form">
                    <fieldset>
                        <h2>Song-Genre Searcher</h2>
                        <div className="songInput">
                            <label htmlFor="songName">Search for a specific song to retreive genre ideas:</label>
                                <input
                                    type="text"
                                    id="songName"                 
                                    value={songName}
                                    onChange={handleSongNameChange}
                                    required
                                />
                        </div>
                        <button type="submit">Search Songs</button>
                    </fieldset>

                    {/* Song list button only shows when pressed */}
                    <fieldset>
                        {/* Song List button */}
                        {(songs.length > 0 && !showSongTable) && (
                            <div className="song-table">
                                <h2>Search Results</h2>
                                <label>Click the "Show Songs" button to see your searched songs!</label>
                                <button onClick={() => setShowSongTable(true)}>Show Songs</button>
                            </div>
                        )}

                        {/* Song Table Popup */}
                        {showSongTable && (
                            <div>
                                <h2>Search Results</h2>
                                <label>Choose a song to retrieve the genres of a specific song.</label>
                                <SongTable 
                                    songs={songs} 
                                    onSelectSong={handleSelectSong}
                                    onClose={() => setShowSongTable(false)}
                                />
                            </div>
                        )}
                    </fieldset>

                    {/* Genres */}
                    <fieldset>
                        {currentSongName != '' &&
                            <div>
                                <h2>Song Genres</h2>
                                <label className="text-left"><b>Current Selected Song:</b> {currentSongName}</label>
                        
                                {/* If genres array is has stuff */}
                                {genres.length > 0 ? (
                                    <div className="song-genres"> 
                                        <label className="text-left"><b>Genres:</b></label>
                                        <ul>
                                            {genres.map((genre, index) => (
                                                <li key={index} >{genre}</li>
                                            ))}
                                        </ul>
                                        <p><b>Note:</b> Genres produced by this search function are not all included in genre dropdown list in the next section.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label>No genre data is available in the database for this specific song!</label>
                                    </div>
                                )}
                            </div>
                        }
                    
                    </fieldset>
                </form>

                {/* Form for Song genres, number of songs, and explicit */}
                <form onSubmit={handleSubmit} className="playlist-form">
                    <fieldset>
                    <h2>Playlist Parameters</h2>
                        <div className="numSongsInput">
                            <label htmlFor="numberOfSongs">Number of Songs (Max 50):</label>
                            <input
                                type="number"
                                id="numberOfSongs"
                                min={1}
                                max={100}                    
                                value={numSongs}
                                onChange={handleNumSongsChange}
                                required
                            />
                        </div>

                        {/* Ask for Genres */}
                        <div className="genre-select">
                            <div className="genre-dropdown">
                                <label>Select up to 5 Genres: </label>
                                <select value={currentGenre} onChange={handleGenreSelection}>
                                    <option value="" hidden>-- Select Genre --</option>
                                    {genreOptions.map(genre => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="selected-genres">
                                <label>Selected Genres. Press the "X" to remove a genre from the list.</label>
                                <ul>
                                    {selectedGenres.map(genre => (
                                        <li key={genre}>
                                            {genre}
                                            <button type="button" onClick={() => handleRemoveGenre(genre)} className="remove-button">X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <label>Allow Explicit Songs?</label>
                        <div className="explicit-radio">
                            <div>
                                <label htmlFor="explicitYes" className='radio-label'>Yes
                                <input
                                type="radio"
                                id="explicitYes"
                                name="explicit"
                                value="yes"
                                defaultChecked={explicit === 'yes'}
                                onChange={handleExplicitChange}
                                /></label>

                            </div>
                            <div>
                                <label htmlFor="explicitNo" className='radio-label'>No
                                <input
                                type="radio"
                                id="explicitNo"
                                name="explicit"
                                value="no"
                                defaultChecked={explicit === 'no'}
                                onChange={handleExplicitChange}
                                /></label>

                            </div>
                        </div>
        
                        <button type="button" onClick={handleReset} className="reset-button">Reset</button>
                        <button type="submit">Create Playlist</button>
                    </fieldset>
                </form>
            </section>
        </div>
    )
};

export default CreatePlaylistPage;