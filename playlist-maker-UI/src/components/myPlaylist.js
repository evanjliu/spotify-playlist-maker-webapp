import { useState, useEffect } from "react";

// Shows the current playlist based off array
function MyPlaylistComponent ({playlist}) {
    const [removedIndices, setRemovedIndices] = useState([]);
    const [playlistData, setPlaylistData] = useState(playlist);
    const originalPlaylist = playlist;

    useEffect(() => {
        // Stores removed song indices
        const storedRemovedIndices = JSON.parse(sessionStorage.getItem("removedIndices")) || [];
        setRemovedIndices(storedRemovedIndices);

        // Stores 
        const storedPlaylistData = JSON.parse(sessionStorage.getItem("playlist")) || [];
        setPlaylistData(storedPlaylistData);
    }, []);

    useEffect(() => {
        console.log("Current playlistData:", playlistData);
        sessionStorage.setItem("removedIndices", JSON.stringify(removedIndices));
        sessionStorage.setItem("playlist", JSON.stringify(playlistData));
    }, [removedIndices, playlistData]);

    const handleRemoveSong = (index) => {
        const updatedIndices = [...removedIndices, index];
        setRemovedIndices(updatedIndices);
        const updatedPlaylist = playlist.filter((_, i) => !updatedIndices.includes(i));
        setPlaylistData(updatedPlaylist);
    };

    const handleUndoRemove = (index) => {
        const updatedIndices = removedIndices.filter(i => i !== index);
        setRemovedIndices(updatedIndices);
    
        const updatedPlaylist = [...playlistData];
        const insertIndex = index - updatedIndices.filter(i => i < index).length;
        updatedPlaylist.splice(insertIndex, 0, originalPlaylist[index]);
    
        setPlaylistData(updatedPlaylist);
    };

    return (
        <div className="playlist-container">
            <p className='center-text'>
                Thank you for using this app! <br></br>Your personalized playlist is displayed below!
            </p>
            <p className='center-text'>
                Click the <button className='button-remove'>Remove</button> button to remove a song from the playlist!
            </p>
            <p className='center-text'>
                You can also click on the Song Name to open up an external link to the song in Spotify!
            </p>
            {playlist && playlist.length > 0 ? (
                <table className="playlist-table">
                    <thead>
                        <tr>
                            <th>Song Number</th>
                            <th>Song Name</th>
                            <th>Album</th>
                            <th>Artist Name</th>
                            <th>Duration</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist.map((song, index) => (
                            <tr key={index} className={removedIndices.includes(index) ? 'removed-song' : ''}>
                                <td>{index + 1}</td>
                                <td><a href={song.link_url} className='song-link' target="_blank" rel="noopener noreferrer">{song.name}</a></td>
                                <td>{song.album}</td>
                                <td>{song.artist_name}</td>
                                <td>{song.duration}</td>
                                <td>
                                    {removedIndices.includes(index) ? (
                                        <button onClick={() => handleUndoRemove(index)} className="button-undo">Undo</button>
                                    ) : (
                                        <button onClick={() => handleRemoveSong(index)} className="button-remove">Remove</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <p className='center-text bold-text'>Error! No playlist found.</p>
                </div>
            )}
        </div>
    );
}

export default MyPlaylistComponent;