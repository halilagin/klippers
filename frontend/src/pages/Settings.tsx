import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'; // Import theme utilities

// Assuming a similar theme setup as Dashboard or define a specific one
const settingsTheme = createTheme({
    // Inherit or define theme properties similar to the main app theme
    // For now, let's use a basic structure
    palette: {
        primary: {
            main: '#455cff', // Example primary color from Dashboard button
        },
        background: {
            default: '#fff', // Changed background to white
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
            marginBottom: '1rem',
        },
        h6: {
            fontWeight: 600,
            marginBottom: '0.8rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    marginBottom: '24px',
                    borderRadius: '8px',
                    // boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Removed theme-level shadow
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px', // Consistent button radius
                    textTransform: 'none',
                }
            }
        }
    }
});

const Settings = () => {
    const theme = useTheme(); // Use theme from provider if nested, otherwise from createTheme

    // Example state for settings
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false); // Example theme toggle

    const handleEmailNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailNotifications(event.target.checked);
    };

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
        // Add logic here to actually change the theme (likely context-based)
        console.log("Dark mode toggled:", event.target.checked);
    };

    return (
        <ThemeProvider theme={settingsTheme}> {/* Apply the theme */}
            <CssBaseline /> {/* Ensures baseline styles */}
            
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* Consistent container */}
                <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                    Settings
                </Typography>

                {/* Notification Settings Section */}
                <Paper elevation={0}>
                    <Typography variant="h6" component="h2">Notifications</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications}
                                    onChange={handleEmailNotificationChange}
                                    color="primary"
                                />
                            }
                            label="Receive email notifications for document status updates"
                        />
                        {/* Add more notification options here */}
                    </Box>
                </Paper>

                

                {/* Account Settings Section */}
                <Paper elevation={0}>
                    <Typography variant="h6" component="h2">Account</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                             <TextField fullWidth label="Current Password" type="password" />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField fullWidth label="New Password" type="password" />
                        </Grid>
                         <Grid item xs={12} sx={{ textAlign: 'right' }}>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                sx={{ boxShadow: 'none' }}
                            >
                                Change Password
                            </Button>
                        </Grid>
                         <Grid item xs={12}> <Divider sx={{ my: 1 }} /> </Grid>
                    
                        
                        
                        <Grid item xs={12}>
                             <Typography variant="body2" color="error" sx={{ mb: 1 }}>This action cannot be undone.</Typography>
                            <Button 
                                variant="outlined" 
                                color="error"
                                sx={{ boxShadow: 'none' }}
                            >
                                Delete Account
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>
        </ThemeProvider>
    );
};

export default Settings; 