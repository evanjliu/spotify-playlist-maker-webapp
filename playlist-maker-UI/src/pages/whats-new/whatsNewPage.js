
// Page
function WhatsNewPage () {
    return (
        <div className="whats-new-page">
            <section className="whats-new">
                <h1>What's New?</h1>
                <h3>Version 1.1 of Playlist Pioneer Release</h3>
                <ul>
                    <li>
                        Playlists can be made by selecting up to 5 genres.
                    </li>
                    <li>
                        The number of requested songs in a playlist can be set, with a maximum of 50 songs. 
                    </li>
                    <li>
                        After a playlists has been generated, songs can be removed from the playlist.
                        Once a song has been removed from the playlist, an Undo feature has been implemented.
                    </li>
                    <li>
                        You can now email and download your playlist! Download your playlist in both csv and json formats.
                    </li>
                </ul>
            </section>

            <section className="future-updates">
                <h1>Future Updates</h1>
                <ul>
                    <li>
                        Users will be able to query a video game/book database to generate playlists that fit the genres 
                        of the book/video game.
                    </li>
                    <li>
                        A feature to link a user's Spotify account to the created playlist will be added at a later date.
                    </li>
                    <li>
                        Additional playlist personalization selections, such as loudness, dancability, acousticness, etc., 
                        will be added in a future update.
                    </li>
                </ul>
            </section>
        </div>
    )
};

export default WhatsNewPage;