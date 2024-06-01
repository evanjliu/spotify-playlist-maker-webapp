// Import dependencies
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

// Import react icons
import { FaFileCsv, FaFile, FaArrowCircleDown } from 'react-icons/fa';


// Download and Email Page
function ExportPlaylistPage () {
    const redirect = useNavigate();

    const [selectedFormat, setSelectedFormat] = useState('csv');
    const [playlistData, setPlaylistData] = useState([]);
    const [emailAddress, setEmailAddress] = useState('');

    // Retrieve the playlist data that has been manipulated from the playlist page
    useEffect(() => {
        // Retrieve playlist data
        const storedPlaylistData = JSON.parse(sessionStorage.getItem("playlist")) || [];
        setPlaylistData(storedPlaylistData);
    }, []);

    const handleNavigateCreate = (e) => {
        // Redirect with 0.1s timeout.
        setTimeout(() => {
            redirect('/create');
        }, 100) 
    };


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

    // Download button logic
    const handleExport = async (e) => {
        e.preventDefault();
        let confirm = window.confirm("Are you sure you want to download your playlist?\nA File will be downloaded to your device!");

        if (confirm) {
            if (selectedFormat === 'csv' && playlistData != []) {
                axios({
                    url: 'get-csv',
                    method: 'GET',
                    responseType: 'blob', // Important
                    params: {
                        playlist: playlistData
                    }
                })
                    .then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'My_Playlist.csv'); // Specify the filename
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode.removeChild(link); // Clean up
                    })
                    .catch(error => {
                        console.error("Error downloading the file:", error);
                        alert("Playlist could not be downloaded. Please try again.");
                    });
            } else if (selectedFormat === 'json' && playlistData != []) {
                const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(playlistData))}`;
                const link = document.createElement('a');
                link.href = jsonString;
                link.download = 'My_Playlist.json';
    
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
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
            { playlistData.length != 0 ? (
                <section className="export-forms-container">
                    {/* EMAIL FORM */}
                    <form onSubmit={handleSendEmail} className='export-form'>
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
                            <br></br>
                            <button type='submit'>Email Playlist</button>
                        </fieldset>
                    </form>

                    {/* EXPORT FORM */}
                    <form onSubmit={handleExport} className="export-form">
                        <fieldset>
                            <h2>Download Your Playlist</h2>
                            <label className="bold-text">Select Export Format:</label>
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

                            <button type="submit">Download Playlist</button>
                        </fieldset>
                    </form>
                </section>
            ) : (
                <div>
                    <h2>You haven't created a playlist yet!</h2>
                    <p className="center-text bold-text"><FaArrowCircleDown /> Click on the button below to create a playlist! <FaArrowCircleDown /></p>
                    <button onClick={handleNavigateCreate}>Create Playlist</button>
                </div>
            )}
        </div>
    )
};

export default ExportPlaylistPage;