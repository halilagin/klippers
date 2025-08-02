import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddSigners.css'; // Import the CSS file

interface Signer {
  email: string;
  title: string;
  name: string;
  username: string;
}

const AddSigners = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [signers, setSigners] = useState<Signer[]>([]); // State to hold signers

    const handleAddSigner = () => {
        setSigners([...signers, { email: '', title: '', name: '', username: '' }]); // Add a new signer
    };

    const handleChange = (index: number, field: keyof Signer, value: string) => {
        const newSigners = [...signers];
        newSigners[index][field] = value; // Update the specific field of the signer
        setSigners(newSigners);
    };

    const handleDeleteSigner = (index: number) => {
        const newSigners = signers.filter((_, i) => i !== index); // Remove signer at the specified index
        setSigners(newSigners);
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
                    <div className="step-circle active">3</div>
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
                <button className="btn btn-back" onClick={() => navigate(-1)}>Back</button>
                <div className="edit-container">
                    <h1 className="edit-title">Add Signers</h1>
                    <p className="edit-subtitle">Enter the titles, names, and usernames of the signers below.</p>
                    
                    {/* Input fields for signers */}
                    {signers.map((signer, index) => (
                        <div key={index} className="signers-input-area">
                            <input
                                type="text"
                                placeholder="Signer Title (e.g., Main Signer, Co-Signer)"
                                value={signer.title}
                                onChange={(e) => handleChange(index, 'title', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Signer Name"
                                value={signer.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={signer.username}
                                onChange={(e) => handleChange(index, 'username', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Signer Email"
                                value={signer.email}
                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                            />
                            
                        </div>
                    ))}
                    <button className="btn btn-add-signer" onClick={handleAddSigner}>+ Add Signer</button>
                    
                    {/* Display added signers only if there are any */}
                    {signers.length > 0 && (
                        <div className="added-signers-list">
                            <h2>Added Signers:</h2>
                            <ul>
                                {signers.map((signer, index) => (
                                    <li key={index}>
                                        {signer.name} ({signer.username}) - {signer.email} - {signer.title}
                                        <span className="delete-signer" onClick={() => handleDeleteSigner(index)}>✖</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <button className="btn btn-next" onClick={() => navigate('/schedule')}>Next</button>
                </div>
            </div>

            <div className="footer">
                © 2023 DocuFlow. All rights reserved.
            </div>
        </div>
    );
};

export default AddSigners; 