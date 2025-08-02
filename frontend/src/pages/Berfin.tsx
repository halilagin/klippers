import React, { useState } from 'react';
import '@/Dashboard.css'; // Import the CSS file
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import InboxIcon from '@mui/icons-material/Inbox';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; // Import useNavigate and Outlet
import ListUserDocuments from './documents/ListUserDocuments';

const TopMenu = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); // Add useNavigate hook

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = (e:any) => {
        e.preventDefault(); // Prevent default link behavior
        localStorage.removeItem('token_type');
        localStorage.removeItem('access_token');
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="top-menu">
            <div className="profile-menu">
                <button 
                    className="profile-icon"
                    onClick={toggleDropdown}
                >
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                    >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <a href="/profile">Profile</a>
                        <a href="/settings">Settings</a>
                        <a href="/subscriptions">Subscriptions</a>
                        <hr />
                        <a href="/logout" onClick={handleLogout}>Logout</a>
                    </div>
                )}
            </div>
        </div>
    );
};

const Berfin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNewDocument = () => {
        navigate('/dashboard/document-upload');
    };

    const isHomePage = location.pathname === '/dashboard';

    return (
        <div className="dashboard-container">
            <TopMenu />
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar-header">
                    <h1 className="dashboard-sidebar-title">Sealvo</h1>
                </div>
                <nav className="dashboard-sidebar-nav">
                    <a href="/dashboard" className={`dashboard-sidebar-link ${isHomePage ? 'active' : ''}`}>
                        <HomeIcon />
                        <span>Dashboard</span>
                    </a>
                    <a href="/dashboard/document-upload" className="dashboard-sidebar-link">
                        <DescriptionIcon />
                        <span>Documents</span>
                    </a>
                    <a href="/dashboard/inbox" className="dashboard-sidebar-link">
                        <InboxIcon />
                        <span>Inbox</span>
                    </a>
                    <a href="/dashboard/history" className="dashboard-sidebar-link">
                        <HistoryIcon />
                        <span>History</span>
                    </a>
                    <a href="/dashboard/team" className="dashboard-sidebar-link">
                        <GroupIcon />
                        <span>Team</span>
                    </a>
                    <a href="/dashboard/settings" className="dashboard-sidebar-link">
                        <SettingsIcon />
                        <span>Settings</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div className="dashboard-header-title">
                        <h2>Welcome back!</h2>
                        <p>Here's what's happening with your documents</p>
                    </div>
                    <div className="dashboard-header-actions">
                        <button className="common-button-class" onClick={() => navigate('/dashboard/prepate-sign-document')}>
                           + Halil New Document
                        </button>
                        <button className="common-button-class" onClick={handleNewDocument}>
                           + New Document
                        </button>
                        <div className="dashboard-profile-pic">
                            <img src="https://placehold.co/40x40" alt="Profile" />
                        </div>
                    </div>
                </header>

                {isHomePage ? (
                    <>
                        {/* Stats */}
                        <div className="dashboard-stats-grid">
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-header">
                                    <h3>Pending Signatures</h3>
                                    <span className="dashboard-stat-icon">
                                        <AccessTimeIcon />
                                    </span>
                                </div>
                                <p className="dashboard-stat-value">8</p>
                            </div>
                        </div>

                        {/* Recent Documents */}
                        <div className="dashboard-recent-documents">
                            <div className="dashboard-recent-documents-header">
                                <h3>Recent Documents</h3>
                            </div>
                            <div className="dashboard-recent-documents">
                                <ListUserDocuments />
                            </div>
                        </div>
                    </>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default Berfin; 