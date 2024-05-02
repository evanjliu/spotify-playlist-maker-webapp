
// Shows the current playlist based off array
function myPlaylistComponent (playlist) {
    return (
        <table>
            <thead>

            </thead>
            <tbody>
                {playlist.map((song, index) => (
                <li key={index}>
                    {song.title} - {song.artist}
                </li>
                        ))}
            </tbody>
        

        </table>
    )
}

export default myPlaylistComponent;