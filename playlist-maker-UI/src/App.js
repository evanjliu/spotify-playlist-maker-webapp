// Import dependencies
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react';

// Import navigation and CSS
import Navigation from './components/Navigation.js';
import './App.css';

// Import pages
import HomePage from './pages/home/homePage';
import CreatePlaylistPage from './pages/create-playlist/createPlaylistPage';
import ExportPlaylistPage from './pages/export-playlist/exportPlaylistPage';
import MyPlaylistPage from './pages/my-playlist/myPlaylistPage';
import WhatsNewPage from './pages/whats-new/whatsNewPage';

// App
function App() {

  const [playlist, setPlaylist] = useState([]);
  const [popUp, setPopUp] = useState(false);

  // App return
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
          <div className="logo-link">
            <Link to="/">Playlist Pioneer</Link>
          </div>
          <Navigation />
      </header>

      <main>
        <section>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePlaylistPage setPlaylist={setPlaylist} popUp={popUp} setPopUp={setPopUp} />} />
            <Route path="/playlist" element={<MyPlaylistPage myPlaylist={playlist} />} />
            <Route path="/export" element={<ExportPlaylistPage />} />
            <Route path="/new" element={<WhatsNewPage />} /> 
          </Routes>
        </section>
      </main>
      <footer>

      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
