import { useNavigate } from "react-router-dom";
import React, { useState, useEffect} from 'react';
import axios from 'axios';

// Page
function CreatePlaylistPage ({setPlaylist}) {
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
    const [currentGenre, setCurrentGenre] = useState('')

    // Sets real time variables to local storage when changed
    useEffect(() => {
        sessionStorage.setItem('genres', JSON.stringify(selectedGenres));
        sessionStorage.setItem('num-songs', numSongs);
        sessionStorage.setItem('explicit', JSON.stringify(explicit));
        sessionStorage.setItem('genre-options', JSON.stringify(genreOptions));
        }, 
        [selectedGenres, numSongs, explicit, genreOptions]
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
    
    // Handler for updating explicit variable
    const handleExplicitChange = (e) => {
        setExplicit(e.target.value);
    };

    // Handler for reset button
    const handleReset = () => {
        setSelectedGenres([]);
        setNumSongs(20);
        setExplicit("no");
        setGenreOptions(allGenres);
    };
    
    // Handler for when the SUBMIT button is clicked
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // GET request to the backend to generate a playlist
        axios.get('/get-playlist', {
            params: {
                selectedGenres: selectedGenres.join(','),
                numSongs: numSongs,
                explicit: explicit
            }
        })
            .then(response => {
                console.log(response.data);
                setPlaylist(response.data);
                redirect('/playlist');
                
            })
            .catch(error => {
                console.error(error);
                alert("Something went wrong.");
            });
            
    };

    // Handles navigating for more information
    const handleNavigate = (e) => {
        e.preventDefault();
        redirect('/');
    };

    return (
        <div>
            <h1>Create Playlist</h1>
            <p><b>Instructions: </b>In order to create a personalized playlist, select one or more of the following provided genres. You can also specify how many songs you would like in the playlist, and whether to include explicit songs.</p>
            <p><span className="link" onClick={handleNavigate}>Click here</span> to learn more about how personalization works!</p>
            <form onSubmit={handleSubmit}>
                <button type="button" onClick={handleReset}>Reset</button>
                <div>
                <label htmlFor="numberOfSongs">Number of Songs:</label>
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
                <div>
                    <label>Select up to 5 Genres: </label>
                    <select value={currentGenre} onChange={handleGenreSelection}>
                        <option value="" hidden>-- Select Genre --</option>
                        {genreOptions.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>

                    <div>
                        <label>Selected Genres. Press the "X" to remove a genre from the list.</label>
                        <ul>
                            {selectedGenres.map(genre => (
                                <li key={genre}>
                                    {genre}
                                    <button type="button" onClick={() => handleRemoveGenre(genre)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <label>Allow Explicit Songs</label>
                    <input
                    type="radio"
                    id="explicitYes"
                    name="explicit"
                    value="yes"
                    defaultChecked={explicit === 'yes'}
                    onChange={handleExplicitChange}
                    />
                    <label htmlFor="explicitYes">Yes</label>
                
                    <input
                    type="radio"
                    id="explicitNo"
                    name="explicit"
                    value="no"
                    defaultChecked={explicit === 'no'}
                    onChange={handleExplicitChange}
                    />
                    <label htmlFor="explicitNo">No</label>
                </div>

                <p><b>WARNING: </b>Previously generated playlists will be lost to the void!</p>
                <button type="submit">Create Playlist</button>
            </form>
        </div>
    )
};

export default CreatePlaylistPage;