import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Grid,
    Avatar,
    Button,
    TextField,
    CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// You can reuse or adapt the theme from Settings or Dashboard
const profileTheme = createTheme({
    palette: {
        primary: {
            main: '#455cff',
        },
        background: {
            default: '#fff',
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
            marginBottom: '1rem',
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
                    borderRadius: '20px',
                    textTransform: 'none',
                }
            }
        }
    }
});

const Profile = () => {
    // Mock user data - replace with actual data fetching
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: '/path/to/default/avatar.png', // Replace with actual or default avatar
        bio: 'Software Developer at Klippers.',
    };

    return (
        <ThemeProvider theme={profileTheme}>
            <CssBaseline />
            
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            
                <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                    Profile
                </Typography>

                <Paper elevation={0}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                            <Avatar
                                alt={`${user.firstName} ${user.lastName}`}
                                src={user.avatarUrl} // Use dynamic src
                                sx={{ width: 100, height: 100, margin: '0 auto', mb: { xs: 2, sm: 0 } }}
                            />
                             <Button 
                                 variant="text" 
                                 size="small" 
                                 sx={{ 
                                     mt: 1, 
                                     '&:hover': { 
                                         backgroundColor: 'transparent', // Keep background transparent on hover
                                         textDecoration: 'none' // Optional: remove underline if it appears
                                     } 
                                 }}
                             >
                                 Change Photo
                             </Button>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>{user.bio}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Edit Profile Information</Typography>
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="First Name" defaultValue={user.firstName} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Last Name" defaultValue={user.lastName} />
                        </Grid>
                         <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bio / Short Description"
                                multiline
                                rows={3}
                                defaultValue={user.bio}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ 
                                    boxShadow: 'none',
                                    '&:hover': { 
                                        backgroundColor: profileTheme.palette.primary.main,
                                        boxShadow: 'none'
                                    } 
                                }}
                            >
                                Save Profile Changes
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Profile; 