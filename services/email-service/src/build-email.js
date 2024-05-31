function buildEmail(email, playlist) {
    // HTML content with styles including centered header and hover effects
    let htmlContent = `
        <html>
            <head>
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
                <style>
                    body, html {
                        font-family: 'Roboto', sans-serif, Arial, Helvetica;
                        font-size: 16px;
                        color: white;
                        background: #333333;
                    }
                    a {
                        color: white;
                        text-decoration: none;
                        transition: color 0.3s ease;
                    }
                    a:hover {
                        color: #1db954;  /* Change color on hover */
                    }
                    h1 {
                        text-align: center;  /* Center the header */
                        color: white;
                    }
                    table {
                        width: 80%; 
                        margin: 40px auto; 
                        border-collapse: collapse; 
                        border: white 2px inset; 
                        border-radius: 10%;
                    }
                    caption {
                        font-size: 16px;
                        text-align: center;
                        color: white;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;  /* Ensures table cells are aligned left */
                    }
                    th {
                        background-color: #333;
                        border-bottom: 1px solid white; 
                    }
                    tr:nth-child(even) {
                        background-color: #474646;
                    }
                    tr:nth-child(odd) {
                        background-color: #303030;
                    }
                </style>
            </head>
            <body>
                <h1>My Playlist</h1>
                <table>
                    <caption><b>Clicking on a song name will bring you to the Spotify page of each song!</b></caption>
                    <thead>
                        <tr>
                            <th>Song Number</th>
                            <th>Song Name</th>
                            <th>Album</th>
                            <th>Artist Name</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>`;

    // Loop through each song in the playlist to create rows
    playlist.forEach((song, index) => {
        htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td><a href="${song.link_url}" target="_blank">${song.name}</a></td>
                <td>${song.album}</td>
                <td>${song.artist_name}</td>
                <td>${song.duration}</td>
            </tr>`;
    });

    htmlContent += `</tbody></table></body></html>`;

    // Mail info object
    let mailInfo = {
        from: 'mailtrap@demomailtrap.com',
        to: email,
        subject: 'Your Playlist!',
        text: 'Please view this email in an HTML capable client.',
        html: htmlContent
    }
    return mailInfo;
}

module.exports = { buildEmail };
