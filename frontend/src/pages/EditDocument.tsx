import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './EditDocument.css'; // Import the CSS file
import SignPdfView from './SignPdfView'; // Import the SignPdfView component
import SignedPdfView from './SignedPdfView'; // Import the SignedPdfView component

const EditDocument = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [isSigning, setIsSigning] = useState(false); // State to control PDF signing view
    const [isSigned, setIsSigned] = useState(false); // State to control signed view

    const handleAddSign = () => {
        setIsSigning(true); // Show the SignPdfView when adding a sign
    };

    const handleDone = () => {
        setIsSigned(true); // Set to true to show SignedPdfView
    };

    const handleSaveChanges = () => {
        // Logic to save changes (if any)
        console.log("Changes saved!");
        navigate('/add-signers'); // Navigate to the next page after saving
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
                    <div className="step-circle active">2</div>
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
                    <div className="step-circle inactive">5</div>
                    <div className="step-label">Preview</div>
                </div>
            </div>

            <div className="main-container">
                <button className="btn btn-back" onClick={() => navigate('/document-upload')}>Back</button>
                <div className="edit-container">
                    <h1 className="edit-title">Sign Document</h1>
                    <p className="edit-subtitle">Click where you want to sign</p>
                    
                    <div className="editor-area">
                        {isSigned ? (
                            <SignedPdfView /> // Show the SignedPdfView component if signed
                        ) : (
                            <SignPdfView onDone={handleDone} /> // Pass handleDone to SignPdfView
                        )}
                    </div>
                    
                   
                    <button className="btn btn-save" onClick={handleSaveChanges}>Save Changes</button>
                    
                </div>
              
                <button className="btn btn-next" onClick={() => navigate('/add-signers')}>Next</button>
            </div>

            <div className="footer">
                © 2023 DocuFlow. All rights reserved.
            </div>
        </div>
    );
};

export default EditDocument;
