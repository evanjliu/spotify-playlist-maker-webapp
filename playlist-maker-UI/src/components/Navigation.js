import { NavLink, Link } from 'react-router-dom';

{/* Import React Icons */}

function Navigation() {
    return (
        <div className="top-nav">
            <nav className="global">
                {/* Links */}
                <Link to="/">Home</Link>
                <NavLink to="/create">Create Playlist</NavLink>
                <NavLink to="/playlist">My Playlist</NavLink>
                <NavLink to="/export">Export Playlist</NavLink>
                <NavLink to="/new">What's New</NavLink>
            </nav>
        </div>
    )
};

export default Navigation;