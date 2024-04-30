import { useNavigate } from "react-router-dom";

// Page
function MyPlaylistPage ({playlist}) {
    const redirect = useNavigate();

    // Handle Navigates
    const handleNavigateExport = (e) => {
        redirect('/export');
    };

    const handleNavigateCreate = (e) => {
        redirect('/create');
    };

    const handleNavigateAgain = (e) => {
        redirect('/playlist');
    };

    // Webpage
    return (
        <div>
            <h1>My Playlist</h1>

            <div>
                {playlist && playlist.length > 0 ? (
                    <ul>
                        {playlist.map((song, index) => (
                            <li key={index}>
                                {song.title} - {song.artist}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No songs in the playlist.</p>
                )}
            </div>

            <div>
                {playlist && playlist.length > 0 ? (
                    <p>There is a playlist</p>
                ) : (
                    <div>
                        <button onClick={handleNavigateExport}>Export</button>
                        <button onClick={handleNavigateCreate}>Create Again</button>
                        <button onClick={handleNavigateAgain}>Create the Same Thing</button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default MyPlaylistPage;