// Import dependencies
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

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
            <Route path="/create" element={<CreatePlaylistPage />} />
            <Route path="/export" element={<ExportPlaylistPage />} />
            <Route path="/playlist" element={<MyPlaylistPage />} />
            <Route path="/new" element={<WhatsNewPage />} /> 
          </Routes>
        </section>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
