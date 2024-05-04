import { useState } from "react";
import { FaFileCsv, FaFile, FaFileCode, FaFileWord} from 'react-icons/fa';

// Page
function ExportPlaylistPage () {
    const [selectedFormat, setSelectedFormat] = useState('json');

    const handleFormatChange = (e) => {
        setSelectedFormat(e.target.value);
    };

    // Submit button logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        let confirm = window.confirm("Are you sure you want to download your playlist?\nA File will be downloaded to your device!");
        
        if (confirm) {
            alert("Not implemented yet");
        }
    };

    // Page
    return (
        <div>
            <h1>Export Playlist</h1>
            <h1>**CURRENTLY NOT IMPLEMENTED**</h1>

            <section>
                <p className="center-text">
                    Here you can download your playlist in your file format of your choice! Use the form below and submit by clicking the green button!
                </p>
            </section>
            
            <section>
                <form onSubmit={handleSubmit} className="Export Form">
                    <fieldset>
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

                        <button type="submit">Export Playlist</button>
                    </fieldset>
                </form>
            </section>
        </div>
    )
};

export default ExportPlaylistPage;