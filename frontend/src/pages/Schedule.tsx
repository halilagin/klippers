import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Schedule.css'; // Import the CSS file

const Schedule = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [scheduledTime, setScheduledTime] = useState('');
    const [notes, setNotes] = useState(''); // State for notes

    const handleStartNow = () => {
        // Logic to start the process immediately
        console.log("Starting now...");
        navigate('/next-step'); // Navigate to the next step
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
                    <div className="step-circle active">4</div>
                    <div className="step-label">Schedule</div>
                </div>
                <div className="progress-step">
                    <div className="step-circle inactive">5</div>
                    <div className="step-label">Preview</div>
                </div>
            </div>

            <div className="main-container">
                <button className="btn btn-back" onClick={() => navigate(-1)}>Back</button>
                <div className="edit-container">
                    <h1 className="edit-title">Schedule Your Document</h1>
                    <p className="edit-subtitle">Set the time for your document signing.</p>
                    <div className="schedule-input-area">
                        <label htmlFor="scheduledTime">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="scheduledTime"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />
                    </div>
                    <div className="schedule-input-area">
                        <label htmlFor="notes">Add Notes</label>
                        <textarea
                            id="notes"
                            placeholder="Enter any additional notes here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-start-now" onClick={handleStartNow}>Start Now</button>
                    <button className="btn btn-next" onClick={() => navigate('/preview')}>Next</button>
                </div>
            </div>

            <div className="footer">
                © 2023 DocuFlow. All rights reserved.
            </div>
        </div>
    );
};

export default Schedule; 