// Import dependencies and components
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MyPlaylistComponent from "../../components/myPlaylist";

// Import react icons
import { FaArrowCircleDown } from "react-icons/fa";

// Page
function MyPlaylistPage ({myPlaylist}) {
    const redirect = useNavigate();

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
    
    // Session Storage 
    const initialSelectedGenres = JSON.parse(sessionStorage.getItem('genres')) || [];
    const initialNumSongs = parseInt(sessionStorage.getItem('num-songs')) || 20;
    const initialExplicit = JSON.parse(sessionStorage.getItem('explicit')) || "no";
    const initialGenreOptions = JSON.parse(sessionStorage.getItem('genre-options')) || allGenres;

    // Real time variables
    const [selectedGenres, setSelectedGenres] = useState(initialSelectedGenres);
    const [numSongs, setNumSongs] = useState(initialNumSongs);
    const [explicit, setExplicit] = useState(initialExplicit);
    const [genreOptions, setGenreOptions] = useState(initialGenreOptions);

    // Sets real time variables to local storage when changed
    useEffect(() => {
        sessionStorage.setItem('genres', JSON.stringify(selectedGenres));
        sessionStorage.setItem('num-songs', numSongs);
        sessionStorage.setItem('explicit', JSON.stringify(explicit));
        sessionStorage.setItem('genre-options', JSON.stringify(genreOptions));
        }, 
        [selectedGenres, numSongs, explicit, genreOptions]
    );

    // Handle Navigates
    const handleNavigateExport = (e) => {
        e.preventDefault();
        redirect('/export');
    };

    const handleNavigateCreate = (e) => {
        
        // Reset all parameters
        setSelectedGenres([]);
        setNumSongs(20);
        setExplicit("no");
        setGenreOptions(allGenres);

        // Redirect with 0.1s timeout.
        setTimeout(() => {
            redirect('/create');
        }, 100) 
    };

    const handleAgain = (e) => {
        e.preventDefault();
        redirect('/create');
    };


    // Webpage
    return (
        <div>
            

            <div>
                {myPlaylist && (myPlaylist).length > 0 ? (
                    
                    <div className="playlist-page">
                        <h1>My Playlist</h1>
                        <MyPlaylistComponent playlist={myPlaylist} />

                        <h2>Want to Export your playlist or make a New playlist?</h2>
                        <button onClick={handleNavigateExport} className="export-create-button">Download/Email My Playlist!</button>
                        <button onClick={handleNavigateCreate} className="export-create-button">Create A New Playlist!</button>
                        <button onClick={handleAgain} className="export-create-button">Recreate My Playlist!</button>
                    </div>
                ) : (
                    <div>
                        <h1>You haven't created a playlist yet!</h1>
                        <p className="center-text bold-text"><FaArrowCircleDown /> Click on the button below to create a playlist! <FaArrowCircleDown /></p>
                        <button onClick={handleNavigateCreate}>Create Playlist</button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default MyPlaylistPage;