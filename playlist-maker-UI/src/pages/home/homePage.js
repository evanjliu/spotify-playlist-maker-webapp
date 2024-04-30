import { useNavigate } from "react-router-dom";

// Home Page
function HomePage () {
    const redirect = useNavigate();

    return(
        <div className="home-page">
            <section>
                <h1>Welcome to Playlist Pioneer</h1>

                <p>The pupose of this web application is to generate a playlist of songs using one or more of user selected genres. The playlists will be personalized and will change based off the genres you specify!</p>

                <p>You will be able to export and save these personalized playlists to your local computer.</p>
                <p><span className="link" onClick={() => redirect('new')}>Click here</span> to learn about new features!</p>

                <p>Press the create button when you are ready to start!</p>

                <button onClick={() => redirect('create')}>Let's Create</button>
            </section>
        </div>
    )
};

export default HomePage;