// Import dependencies
import { useState, useEffect } from "react";
import { FaFileCsv, FaFile, FaFileCode, FaFileWord} from 'react-icons/fa';
import axios from 'axios';

// Download and Email Page
function ExportPlaylistPage () {
    const [selectedFormat, setSelectedFormat] = useState('json');
    const [playlistData, setPlaylistData] = useState([]);
    const [emailAddress, setEmailAddress] = useState('');

    // Retrieve the playlist data that has been manipulated from the playlist page
    useEffect(() => {
        // Retrieve playlist data
        const storedPlaylistData = JSON.parse(sessionStorage.getItem("playlist")) || [];
        setPlaylistData(storedPlaylistData);
    }, []);

    // Handle format change
    const handleFormatChange = (e) => {
        setSelectedFormat(e.target.value);
    };

    // Handle email input change
    const handleEmailChange = (e) => {
        setEmailAddress(e.target.value);
    }

    // Handle Email button logic
    const handleSendEmail = async (e) => {
        e.preventDefault();

        let confirm = window.confirm("Are you sure you want to send your playlist to this email?\n You cannot unsend the email!");
        
        if (confirm) {
            axios.get('put-email', {
                params: {
                    emailAddress: emailAddress,
                    playlist: playlistData
                }
            })
            .then(response => {
                console.log("Message: ", response.data.message, "Status: ", response.data.data);
            })
            .catch(error => {
                console.error("Error: ", error.response.status);
                if (error.response.status === 400) {
                    alert("Email not sent...Email address may be invalid.");
                } else {
                    alert("Internal server error. Request could not be completed.");
                }
            });
        }       
    };

    // Submit button logic
    const handleExport = async (e) => {
        e.preventDefault();
        let confirm = window.confirm("Are you sure you want to download your playlist?\nA File will be downloaded to your device!");
        
        if (confirm) {
            alert("Not implemented yet");
        }
    };

    // Page
    return (
        <div>
            <h1>Send or Download Your Playlist</h1>

            <section>
                <p className="center-text">
                    Here you can download your playlist in your file format of your choice! You may also email your playlist to any verified email address!
                </p>
            </section>

            {/* Section only displays if playlist is available */}
            { playlistData &&
            <section className="export-send">
                {/* EMAIL FORM */}
                <form onSubmit={handleSendEmail} className='playlist-form'>
                    <fieldset>
                        <h2>Email Your Playlist</h2>
                        <label className="bold-text">Email Address: </label>
                        <input 
                            type="email" 
                            value={emailAddress} 
                            onChange={handleEmailChange} 
                            placeholder="Enter recipient's email" 
                            required 
                        />
                        <button type='submit'>Email Playlist</button>
                    </fieldset>
                </form>

                {/* EXPORT FORM */}
                <form onSubmit={handleExport} className="playlist-form">
                    <fieldset>
                        <h2>Download Your Playlist</h2>
                        <label className="bold-text">Select Export Format:</label>

                        <div>
                            <label htmlFor="formatJson">JSON <FaFile /> </label>
                            <input
                                type="radio"
                                id="formatJson"
                                name="exportFormat"
                                value="json"
                                checked={selectedFormat === 'json'}
                                onChange={handleFormatChange}
                        />
                        </div>

                        <div>
                            <label htmlFor="formatCsv">CSV <FaFileCsv /> </label>
                            <input
                                type="radio"
                                id="formatCsv"
                                name="exportFormat"
                                value="csv"
                                checked={selectedFormat === 'csv'}
                                onChange={handleFormatChange}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="formatXml">XML <FaFileCode /></label>
                            <input
                                type="radio"
                                id="formatXml"
                                name="exportFormat"
                                value="xml"
                                checked={selectedFormat === 'xml'}
                                onChange={handleFormatChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="formatTxt">Text <FaFileWord /> </label>
                            <input
                                type="radio"
                                id="formatTxt"
                                name="exportFormat"
                                value="txt"
                                checked={selectedFormat === 'txt'}
                                onChange={handleFormatChange}
                            />
                        </div>

                        <button type="submit">Download Playlist</button>
                    </fieldset>
                </form>
            </section>
            }
        </div>
    )
};

export default ExportPlaylistPage;