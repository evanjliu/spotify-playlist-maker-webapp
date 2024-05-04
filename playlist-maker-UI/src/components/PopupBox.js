// Popup Box
function PopUp({onClose, setPopup}) {
    const handleClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="popup-overlay" onClick={handleClickOutside}>
            <div className="popup-box">
                <section>
                    <h2>How Playlist Personalization Works</h2>

                    <p className="bold-text">
                        Our playlist personalization feature allows you to create a customized playlist based on your preferences. Here's how it works:
                    </p>

                    <h3>Playlist Parameters and Your Playlist</h3>
                    <ol>
                        <li><strong>Select Genres:</strong> Choose one or more genres from the provided list. These genres will be used to curate your personalized playlist.</li>
                        <li><strong>Choose Number of Songs:</strong> Specify the number of songs you want in your playlist. You can select up to 50 songs.</li>
                        <li><strong>Explicit Songs:</strong> Decide whether you want to include explicit songs in your playlist or not.</li>
                        <li><strong>Generate Playlist:</strong> Click the "Create Playlist" button to generate your personalized playlist.</li>
                        <li><strong>Your Playlist:</strong> Once generated, you can listen to your personalized playlist and explore new music tailored to your tastes!</li>
                    </ol>

                    <h3>Background Processes</h3>
                    <p>
                        This program uses Spotify API calls and your chosen musical genres to create a playlist that suits your unique taste. We continuously update and refine our 
                        recommendations to ensure you discover music you'll love.
                    </p>

                    <h3>Technologies Used</h3>
                    <p>
                        This app uses a Node.js to build a React app UI and backend server to process requests. To process your requests to make and export playlists, 
                        this app also employs a microservice architecture to separate all processes from each other, making it easier to upkeep and debug!
                    </p>

                    <p>
                        Have fun exploring and creating your personalized playlist!
                    </p>

                    <button className="popup-close-button" onClick={onClose}>Close Window</button>
                </section>
            </div>
        </div>
    )
}

export default PopUp;