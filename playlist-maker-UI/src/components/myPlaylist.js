
// Shows the current playlist based off array
function MyPlaylistComponent (playlist) {

    // Handle removing a song from the playlist.
    const handleRemoveSong = (e) => {
        
    };

    return (
        <div className="playlist-container">
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
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td><a href={song.link}>{song.name}</a></td>
                                <td>{song.album}</td>
                                <td>{song.artist_name}</td>
                                <td>{song.duration}</td>
                                <td><button onClick={() => handleRemoveSong(index)}>Remove</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>

                </div>
            )}
        </div>
    );
}

export default MyPlaylistComponent;