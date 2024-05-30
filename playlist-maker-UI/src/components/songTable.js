import React from 'react';

const SongTable = ({ songs, onSelectSong, onClose }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <button onClick={onClose} className="close-btn">Close</button>
                <h2>Select a Song</h2>
                {songs.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Song Name</th>
                                <th>Artist</th>
                                <th>Album</th>
                                <th>Duration</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song, index) => (
                                <tr key={song.id}>
                                    <td>{index + 1}</td>
                                    <td><a href={song.link_url} target="_blank" rel="noopener noreferrer">{song.name}</a></td>
                                    <td>{song.artist_name}</td>
                                    <td>{song.album}</td>
                                    <td>{song.duration}</td>
                                    <td>
                                        <button onClick={() => onSelectSong(song.id, song.name)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No songs found.</p>
                )}
            </div>
        </div>
    );
};

export default SongTable;
