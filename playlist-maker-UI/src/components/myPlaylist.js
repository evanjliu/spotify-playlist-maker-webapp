
// Shows the current playlist based off array
function MyPlaylistComponent ({playlist}) {

    // Handle removing a song from the playlist.
    const handleRemoveSong = (e) => {
        
    };

    return (
        <div className="playlist-container">
            <p className='center-text'>Thank you for using this app! <br></br>Your personalized playlist is displayed below!</p>
            <p className='center-text'>Click the <button className='button-remove'>Remove</button> button to remove a song from the playlist!</p>
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
                                <td><a href={song.link_url}>{song.name}</a></td>
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
                    <p className='center-text bold-text'>Error! No playlist found.</p>
                </div>
            )}
        </div>
    );
}

export default MyPlaylistComponent;