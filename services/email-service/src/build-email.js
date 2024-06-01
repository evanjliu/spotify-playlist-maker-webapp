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
                        color: #000000;
                        background: #333333;
                    }
                    a {
                        color: #000000;
                        text-decoration: none;
                        transition: color 0.3s ease;
                    }
                    a:hover {
                        color: #1db954;  
                    }
                    h1 {
                        text-align: center; 
                        color: #000000;
                    }
                    table {
                        width: 80%; 
                        margin: 40px auto; 
                        border-collapse: collapse; 
                        border: #000000 2px inset; 
                        border-radius: 10%;
                    }
                    caption {
                        font-size: 16px;
                        text-align: center;
                        color: #000000;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #000000;
                        border-bottom: 1px solid #000000; 
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
