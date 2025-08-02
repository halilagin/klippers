import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '@mui/material'; // Import Material-UI Button
import SendIcon from '@mui/icons-material/Send'; // Import Material-UI Send icon
import './Preview.css'; // Import the CSS file

const Preview = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSend = () => {
        // Logic to send the document
        console.log("Document sent!");
        // You can add navigation or any other logic here
    };

    return (
        <div>
            <div className="navbar">
                <div className="logo">
                    <i className="fas fa-file-signature"></i>
                    Sealvo
                </div>
                <div className="nav-buttons">
                    <span className="dashboard-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <div className="profile-pic">
                        <img src="https://placehold.co/40x40" alt="Profile" />
                    </div>
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-step">
                    <div className="step-circle inactive">1</div>
                    <div className="step-label">Document Upload</div>
                </div>
                <div className="progress-step">
                    <div className="step-circle inactive">2</div>
                    <div className="step-label">Edit</div>
                </div>
                <div className="progress-step">
                    <div className="step-circle inactive">3</div>
                    <div className="step-label">Add Signers</div>
                </div>
                <div className="progress-step">
                    <div className="step-circle inactive">4</div>
                    <div className="step-label">Schedule</div>
                </div>
                <div className="progress-step">
                    <div className="step-circle active">5</div>
                    <div className="step-label">Preview</div>
                </div>
            </div>

            <div className="main-container">
                <button className="btn btn-back" onClick={() => navigate(-1)}>Back</button>
                <div className="edit-container">
                    <h1 className="edit-title">Preview Your Document</h1>
                    <p className="edit-subtitle">Review the details before sending.</p>
                    
                    {/* Here you can display the document details */}
                    <div className="preview-content">
                        <h2>Document Title</h2>
                        <p>Details about the document go here...</p>
                        {/* You can add more details as needed */}
                    </div>
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className="btn btn-send" 
                        onClick={handleSend}
                        startIcon={<SendIcon />} // Add the Material-UI Send icon
                    >
                        Send
                    </Button>
                </div>
            </div>

            <div className="footer">
                © 2023 DocuFlow. All rights reserved.
            </div>
        </div>
    );
};

export default Preview; 