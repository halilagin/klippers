import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, Modal, IconButton, Drawer, useMediaQuery, useTheme, ThemeProvider, createTheme, TextField, InputAdornment, Container, CssBaseline } from '@mui/material';
import { Search, Close, Menu as MenuIcon } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import { Plan, plans } from '../subscription/PlanDescriptions';
import Subscription from '../subscription/Subscription';
import { useNavigate } from 'react-router-dom';


// Create theme for breakpoints only if not already defined globally
// If you have a global theme provider, you might not need this here.
const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

const TopMenu = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for drawer
    const navigate = useNavigate();
    const currentTheme = useTheme(); // Use the theme from context
    const isMobile = useMediaQuery(currentTheme.breakpoints.down('md'));

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
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/dashboard/subscriptions'); }}>Subscriptions</a>
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
               // Removed bgcolor: 'transparent', - let parent control background
           }}>
               {/* Left Section: Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 5 }}>
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
                 mx: 4
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
                       {/* Using map for profile items in drawer */}
                        {React.Children.map(profileMenuItems.props.children, child =>
                            child.type === 'hr' ? <Divider sx={{ my: 1 }} /> : <ListItem disablePadding>{child}</ListItem>
                        )}
                   </List>
                   <IconButton onClick={toggleMobileMenu} sx={{position: 'absolute', top: 12, right: 12}}> <Close /> </IconButton>
               </Box>
               <style>{`
                   .drawer-link, .drawer-profile-links a { display: block; padding: 10px 16px; text-decoration: none; color: inherit; font-size: 0.95rem; }
                   .drawer-link:hover, .drawer-profile-links a:hover { background-color: rgba(0,0,0,0.04); }
                   .drawer-profile-links hr { margin: 4px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1); } /* Keep hr styles if needed */
                   .MuiListItem-root { padding-top: 0 !important; padding-bottom: 0 !important; }
                   .drawer-profile-links .MuiListItem-root a { width: 100%; } /* Ensure links fill list item */
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

const initialPlanId = 'MONTHLY_PAYMENT';
const initialPlanDetails = plans.find(p => p.id === initialPlanId);
const placeholderCurrentSubscription = {
  ...(initialPlanDetails || {}),
  billingCycle: 'Monthly',
  renewsOn: '2024-09-15',
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const ManageSubscription = () => {
  const navigate = useNavigate();
  const [displayedPlanId, setDisplayedPlanId] = useState<string | null>(initialPlanId);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const displayedPlanDetails = plans.find(p => p.id === displayedPlanId) || initialPlanDetails;
  const displayBillingCycle = displayedPlanId === initialPlanId ? placeholderCurrentSubscription.billingCycle : 'N/A';
  const displayRenewsOn = displayedPlanId === initialPlanId ? placeholderCurrentSubscription.renewsOn : 'N/A';

  const handlePlanSelectionChange = (planId: string | null) => {
    setDisplayedPlanId(planId);
  };

  const handleOpenCancelModal = () => {
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
  };

  const handleConfirmCancellation = () => {
    console.log('Subscription cancellation confirmed for plan:', displayedPlanId);
    alert('Subscription cancelled (simulation).');
    handleCloseCancelModal();
  };

  if (!displayedPlanDetails) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopMenu />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography>Loading subscription details...</Typography>
            </Container>
        </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopMenu />
        <Divider />

        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' , mt: 4}}>
            Manage Subscription
          </Typography>

          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
              Your Current Plan
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{displayedPlanDetails.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {displayedPlanDetails.price} {displayedPlanDetails.priceDetail ? `/ ${displayedPlanDetails.priceDetail}` : `/ ${displayBillingCycle}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Renews on: {displayRenewsOn}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Features:</Typography>
                <List dense disablePadding>
                  {displayedPlanDetails.features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.2 }}>
                      <ListItemIcon sx={{ minWidth: '30px'}}>
                        <CheckCircleOutlineIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '14px' }} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
               {displayedPlanId === initialPlanId && (
                 <Button 
                   startIcon={<CancelIcon />}
                   variant="outlined" 
                   color="error" 
                   onClick={handleOpenCancelModal} 
                   sx={theme => ({
                     '&:hover': { 
                       bgcolor: 'transparent',
                       borderColor: theme.palette.error.main
                     } 
                  })}
                 >
                   Cancel Subscription
                 </Button>
               )}
            </Box>
          </Paper>

          <Box sx={{ mt: 5 }}>
            <Subscription
              onPlanSelect={handlePlanSelectionChange}
              title="Upgrade Your Subscription Plan"
            />
          </Box>

          <Modal
            open={cancelModalOpen}
            onClose={handleCloseCancelModal}
            aria-labelledby="cancel-subscription-modal-title"
            aria-describedby="cancel-subscription-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="cancel-subscription-modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon color="warning"/>
                Confirm Cancellation
              </Typography>
              <Typography id="cancel-subscription-modal-description" sx={{ mt: 2, mb: 3 }}>
                Are you sure you want to cancel your '{displayedPlanDetails.name}' subscription? This action cannot be undone.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="text" onClick={handleCloseCancelModal} sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                  Keep Plan
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleConfirmCancellation}
                  disableElevation
                  sx={theme => ({ 
                     '&:hover': { 
                       bgcolor: theme.palette.error.main 
                     } 
                  })}
                >
                  Confirm Cancel
                </Button>
              </Box>
            </Box>
          </Modal>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ManageSubscription;