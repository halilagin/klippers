import React from 'react';
import './DocumentUpload.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DocumentUpload = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div>
            
            
            <div className="main-container">
                <div className="upload-container">
                    <h1 className="upload-title">Step 1: Upload Your Document</h1>
                    <p className="upload-subtitle">
                        Drag and drop your document here or click the button below to upload<br />
                        from templates or your device.
                    </p>
                    
                    <div className="dropzone">
                        Drag & Drop
                    </div>
                    
                    <div className="button-group">
                        <button className="select-file-btn">Select File from Your Device</button>
                        {/* <button className="select-file-btn">Select File from Templates</button> */}
                    </div>
                </div>
                
            </div>
            
            <div className="footer">
                © 2023 DocuFlow. All rights reserved.
            </div>
        </div>
    );
};

export default DocumentUpload;