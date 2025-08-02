import React, { useState, useCallback, useEffect } from 'react';
import './Dashboard.css'; // Import the CSS file
import { Description, Search, Close, Menu as MenuIcon } from '@mui/icons-material'; // Import icons
import { useDropzone } from 'react-dropzone'; // Import useDropzone
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; // Import useNavigate and Outlet
import ListUserDocuments from './documents/ListUserDocuments';
import { DocumentApiClient } from '@/api/client/DocumentApiClient'; // Import API client
import appConfig from '@/AppConfig'; // Import AppConfig
import {
    CircularProgress,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    ThemeProvider,
    createTheme,
    Modal,
    TextField,
    InputAdornment,
    Paper,
    IconButton,
    Drawer, // Added Drawer
    List,     // Added List
    ListItem, // Added ListItem
    ListItemText, // Added ListItemText
    Divider   // Added Divider
} from '@mui/material'; // Import MUI components

// Create theme for breakpoints only
const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900, // Keep existing breakpoints
            lg: 1200,
            xl: 1536,
        },
    },
});

// Helper function to read file as Base64
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Result includes the data URL prefix (e.g., "data:application/pdf;base64,"), remove it
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Helper function to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

// Helper function to calculate MD5 hash
const calculateMD5 = async (buffer: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('MD5', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

const TopMenu = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for drawer
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (!mobileMenuOpen) {
            setIsDropdownOpen(false);
        }
    };

    const openSearch = () => {
        setSearchOpen(true);
    };

    const closeSearch = () => {
        setSearchOpen(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                openSearch();
            }
            if (event.key === 'Escape') {
                 if (searchOpen) closeSearch();
                 if (mobileMenuOpen) setMobileMenuOpen(false);
                 if (isDropdownOpen) setIsDropdownOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchOpen, mobileMenuOpen, isDropdownOpen]);

    const handleLogout = (e:any) => {
        e.preventDefault();
        localStorage.removeItem('token_type');
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false); // Close drawer on navigation
        setIsDropdownOpen(false); // Close dropdown on navigation
    };

    const profileMenuItems = ( // Reusable profile menu items
        <>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/profile'); }}>Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/settings'); }}>Settings</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/subscriptions'); }}>Subscriptions</a>
            <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }}/>
            <a href="#" onClick={handleLogout}>Logout</a>
        </>
    );

    return (
       <> {/* Use Fragment */}
           {/* Main Header Box - Ensures vertical alignment */}
           <Box className="top-menu" sx={{
               display: 'flex',
               alignItems: 'center', // This ensures vertical alignment
               width: '100%',
               padding: { xs: '8px 16px', md: '16px 64px' },
               boxSizing: 'border-box',
               position: 'relative',
           }}>

            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    flexShrink: 0, 
                    ml: 5,
                    cursor: 'pointer' // Added cursor pointer
                }}
                onClick={() => handleNavigate('/dashboard')} // Added onClick to navigate
            >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            <Box className='oxlogo' sx={{ width: { xs: '22vw', md: '10vw' }, height: { xs: '17.6vw', md: '8vw' }, maxWidth: { xs: 80, md: 100 }, maxHeight: { xs: 64, md: 80 } }} />
                            <Typography className='klippers' variant="h6" component="div" sx={{
                                fontWeight: 600,
                                color: '#141414',
                                fontSize: { xs: '18px', sm: '24px', md: 'clamp(18px, 3vw, 32px)' }
                            }}>
                                Klippers
                            </Typography>
                        </Box>
                    </Box>

             {/* Center Section: Nav Links (Desktop Only) */}
             <Box className="nav-links-container" sx={{
                 display: { xs: 'none', md: 'flex' },
                 flexGrow: 1, 
                 justifyContent: 'center',
                 mx: 4 // Increased margin slightly for better spacing from sides
             }}>
                <Box className="nav-links" sx={{ display: 'flex', gap: 4, ml: 5, mt: 1 }}> 
                    <div className="nav-link" onClick={() => handleNavigate('/dashboard')}>Documents</div>
                    <div className="nav-link" onClick={() => handleNavigate('/dashboard/templates')}>Templates</div>
                 </Box>
             </Box>

             {/* Right Section: Search & Profile/Menu */}
             <Box className="top-menu-right" sx={{ 
                 flexShrink: 0,
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: { xs: 1, sm: 2 } 
             }}>
               {/* Search Bar - Keep size */}
               <Box className="search-bar" onClick={openSearch} sx={{
                   width: { xs: '100px', sm: '180px', md: '260px' },
                   display: 'flex',
                   alignItems: 'center',
                   cursor: 'pointer',
                   height: { xs: 32, sm: 36, md: 40},
                   padding: { xs: '0 8px', sm: '0 12px'}
               }}>
                  <Box className="search-icon" sx={{ mr: 1 }}>
                    <i className="fas fa-search" style={{ fontSize: '0.9rem' }}></i>
                  </Box>
                  <input placeholder="Search" type="text" readOnly style={{ flexGrow: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }}/>
                  <Box className="keyboard-shortcut" sx={{ display: { xs: 'none', md: 'flex' } }}>
                    ⌘+K
                  </Box>
               </Box>

               {/* Profile Icon (Desktop) / Menu Icon (Mobile) */}
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   {isMobile ? (
                       <IconButton
                           aria-label="open drawer"
                           edge="end"
                           onClick={toggleMobileMenu}
                           sx={{ color: 'inherit' }}
                       >
                           <MenuIcon />
                       </IconButton>
                   ) : (
                       <Box className="profile-menu" sx={{ position: 'relative' }}>
                           <button
                               className="profile-icon"
                               onClick={toggleDropdown}
                               style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                           >
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                               </svg>
                           </button>
                           {isDropdownOpen && (
                               <Paper className="dropdown-menu" elevation={3} sx={{ /* Dropdown styles */
                                   position: 'absolute',
                                   right: 0,
                                   top: 'calc(100% + 8px)',
                                   width: 180,
                                   zIndex: 1100,
                                   borderRadius: '4px',
                                   overflow: 'hidden',
                                   '& a': { display: 'block', padding: '8px 16px', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }
                               }}>
                                   {profileMenuItems}
                               </Paper>
                           )}
                       </Box>
                   )}
               </Box>
             </Box>

           {/* Mobile Drawer (Sidebar) - Keep as is */}
           <Drawer
               anchor="right"
               open={mobileMenuOpen}
               onClose={toggleMobileMenu}
               sx={{ '& .MuiDrawer-paper': { width: { xs: '240px', sm: '280px' }, boxSizing: 'border-box' } }}
               ModalProps={{ keepMounted: true }}
           >
               <Box sx={{ textAlign: 'left', p: 3 }}>
                   <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Menu</Typography>
                   <Divider sx={{ mb: 1 }}/>
                   <List disablePadding>
                       <ListItem disablePadding> <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard'); }} className="drawer-link">Documents</a> </ListItem>
                       <ListItem disablePadding> <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/templates'); }} className="drawer-link">Templates</a> </ListItem>
                   </List>
                   <Divider sx={{ my: 1 }} />
                   <List disablePadding className="drawer-profile-links">
                       <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/profile'); }}>Profile</a>
                       <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/settings'); }}>Settings</a>
                       <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/subscriptions'); }}>Subscriptions</a>
                       <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }}/>
                       <a href="#" onClick={handleLogout}>Logout</a>
                   </List>
                   <IconButton onClick={toggleMobileMenu} sx={{position: 'absolute', top: 12, right: 12}}> <Close /> </IconButton>
               </Box>
               <style>{`
                   .drawer-link, .drawer-profile-links a { display: block; padding: 10px 16px; text-decoration: none; color: inherit; font-size: 0.95rem; }
                   .drawer-link:hover, .drawer-profile-links a:hover { background-color: rgba(0,0,0,0.04); }
                   .drawer-profile-links hr { margin: 4px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1); }
                   .MuiListItem-root { padding-top: 0 !important; padding-bottom: 0 !important; }
               `}</style>
           </Drawer>

           {/* Search Modal - Keep existing */}
           <Modal
             open={searchOpen}
             onClose={closeSearch}
             aria-labelledby="search-modal"
             sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: '10vh' }}
           >
             <Paper elevation={0} sx={{ width: { xs: '90%', sm: '75%', md: '60%', lg: '50%' }, p: 2, outline: 'none', borderRadius: '12px', maxWidth: '600px', border: '1px solid #ccc' }}>
               <TextField fullWidth variant="outlined" placeholder="Search documents, templates, and more..." autoFocus
                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', paddingRight: '8px' } }}
                 InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton size="small" onClick={closeSearch}><Close /></IconButton></InputAdornment>) }}
               />
               <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                 <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}> Type to search for documents and templates </Typography>
               </Box>
             </Paper>
           </Modal>
           </Box>
       </>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Re-evaluate here if needed
    const isHomePage = location.pathname === '/dashboard';

    return (
        <ThemeProvider theme={theme}>
            {/* Use Box instead of div for sx prop */}
            <Box className="dashboard-container" sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                // bgcolor: 'background.default' // Keep background from CSS or body
            }}>
                <TopMenu />

                {/* Main Content */}
                <Box component="main" /* Use main tag semantically */ className="dashboard-main-content" sx={{
                    // Keep consistent margins
                    marginLeft: { xs: '16px', md: '64px' },
                    marginRight: { xs: '16px', md: '64px' },
                    // Responsive padding
                    paddingTop: { xs: '16px', md: '24px' },
                    paddingBottom: { xs: '16px', md: '32px' },
                    flexGrow: 1 // Allow content to fill space
                }}>

                    {/* Button container Removed */}
                    {/* <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Align button to the right
                        marginBottom: { xs: '16px', md: '20px' } // Responsive margin
                    }}>
                        <button className='upload-button'
                            onClick={() => navigate('/dashboard/prepare-sign-document')}
                            style={{
                                backgroundColor: '#455cff', // Keep color
                                color: 'white', // Ensure text is visible
                                borderRadius: '24px', // Keep radius
                                border: 'none', // Remove default border
                                cursor: 'pointer',
                                // Responsive size
                                padding: isMobile ? '6px 12px' : '8px 16px', // Smaller padding
                                fontSize: isMobile ? '0.8rem' : '0.9rem' // Smaller font size
                            }}>
                            +New Document
                        </button>
                    </Box> */}

                    {/* Rest of the Dashboard content */}
                    {isHomePage ? (
                        // Keep existing structure, avoid adding Paper/Container unless essential
                        <Box className="dashboard-recent-documents" sx={{
                            overflowX: 'auto', // Keep horizontal scroll if needed
                            // Add padding if needed for content spacing
                            // padding: { xs: '12px', md: '16px' }
                            // Avoid background/border/shadow changes
                        }}>
                           
                            <Box> {/* Container for the list if needed */}
                                <ListUserDocuments />
                            </Box>
                        </Box>
                    ) : (
                        <Outlet />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard; 