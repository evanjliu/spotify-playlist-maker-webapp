# Spotify Playlist Maker

A web application built using a microservices architecture that allows users to create Spotify playlists, search for songs, retrieve genres, and export playlist data. The project integrates with the Spotify API and supports CSV export and email sharing functionality.

## Technologies Used

### Frontend
- React

### Backend
- Node.js
- Express
- ZeroMQ (for microservice communication)
- Spotify Web API
- Python
- JavaScript

### Microservices
- **CSV Converter Service**: Converts playlist data into CSV format.
- **Email Service**: Sends playlist details via email.
- **Search Songs Service**: Connects to Spotify's API for searching songs.
- **Get Genres Service**: Fetches music genres.
- **Get Playlist Service**: Retrieves playlist data.
