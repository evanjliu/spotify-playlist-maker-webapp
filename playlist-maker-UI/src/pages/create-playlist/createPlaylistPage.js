import { useNavigate } from "react-router-dom";
import React, { useState, useEffect} from 'react';
import axios from 'axios';

// Page
function CreatePlaylistPage () {
    // Redirects when called
    const redirect = useNavigate();

    // List of Genres
    const allGenres = [
        "Acoustic", "Alternative", "Blues", "Classical", "Country",
        "Dance", "Disco", "Electronic", "Folk", "Funk",
        "Gospel", "Hip Hop", "Indie", "Jazz", "Latin",
        "Metal", "New Age", "Opera", "Pop", "Punk",
        "R&B", "Rap", "Reggae", "Rock", "Ska",
        "Soul", "Techno", "Trance", "Trap", "World",
        "Ambient", "Bluegrass", "Chill", "Chiptune", "Dubstep",
        "Emo", "Grime", "House", "K-Pop", "Reggaeton",
        "Salsa", "Samba", "Swing", "Synthwave", "Tango",
        "Trip Hop", "Vaporwave", "Zydeco"
    ];

    // Load local playlist details if available
    const initialSelectedGenres = JSON.parse(localStorage.getItem('genres')) || [];
    const initialNumSongs = parseInt(localStorage.getItem('num-songs')) || 20;
    const initialExplicit = JSON.parse(localStorage.getItem('explicit')) || "no";
    const initialGenreOptions = JSON.parse(localStorage.getItem('genre-options')) || allGenres;

    // Loads the playlist from local storage. If none, sets to empty array.
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [''];

    // Declare real time variables using useState
    const [selectedGenres, setSelectedGenres] = useState(initialSelectedGenres);
    const [numSongs, setNumSongs] = useState(initialNumSongs);
    const [explicit, setExplicit] = useState(initialExplicit);
    const [genreOptions, setGenreOptions] = useState(initialGenreOptions);

    // Sets real time variables to local storage when changed
    useEffect(() => {
        localStorage.setItem('genres', JSON.stringify(selectedGenres));
        localStorage.setItem('num-songs', numSongs);
        localStorage.setItem('explicit', JSON.stringify(explicit));
        localStorage.setItem('genre-options', JSON.stringify(genreOptions));
        }, 
        [selectedGenres, numSongs, explicit, genreOptions]
    );

    // Handler for genre selection
    const handleGenreSelection = (e) => {
        const genre = e.target.value;
        setSelectedGenres([...selectedGenres, genre]);
        setGenreOptions(genreOptions.filter(option => option !== genre));
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
                redirect('/playlist')
                
            })
            .catch(error => {
                console.error(error)
                alert("Something went wrong.")
            });
            
    };

    // Handles navigating for more information
    const handleNavigate = (e) => {
        e.preventDefault();
        redirect('/')
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
                    <label>Genres: </label>
                    <select onChange={handleGenreSelection}>
                        <option value="" hidden>-- Select Genre --</option>
                        {genreOptions.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>

                    <div>
                        <h3>Selected Genres</h3>
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