import { useNavigate } from "react-router-dom";

// Home Page
function HomePage () {
    const redirect = useNavigate();

    return(
        <div className="home-page">
            <section>
                <h1>Welcome to Playlist Pioneer</h1>

                <section className="intro">
                    <p>
                        The pupose of this web application is to generate a playlist of songs using one or more of user selected genres. 
                        The playlists will be personalized and will change based off the genres you specify! 
                    </p>
                    <p>
                        It only takes 1-2 minutes to generate a customized playlist with up to 50 songs!
                    </p>
                    <p>
                        You will be able to export and save these personalized playlists to your local computer.
                        This process will take less than 30 seconds and will download in any format you desire.
                    </p>
                    <p className="center-text">
                        <span className="link" onClick={() => redirect('new')}>Click here</span> to learn about new features!
                    </p>

                    <p className="center-text bold-text">
                        Press the "Let's Create" button when you are ready to start!
                        </p>
                </section>

                <button onClick={() => redirect('create')}>Let's Create</button>
            </section>
        </div>
    )
};

export default HomePage;