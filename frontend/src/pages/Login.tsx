import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Grid, 
    Typography, 
    TextField, 
    Button, 
    Link, 
    IconButton, 
    InputAdornment, 
    CircularProgress // For loading state
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AppConfig from '@/AppConfig';
import './Login.css'; // Import the CSS file

const Login = ({}) => {
    const navigate = useNavigate(); // useNavigate'i burada doğru kullanıyoruz
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const response = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                mode: 'cors', 
                body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('token_type', data.token_type);

            navigate('/dashboard');
        } catch (err:any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Toggle the visibility state
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent blur on click
    };

    const handleSigninClick = () => {
        console.log('Clicked to Sign In button!');  // Log to console
        navigate('/subscription');  // Redirect to Login page
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
            {/* Left Panel - Keep className for CSS background/animation */}
            <Grid 
                item 
                xs={false} // Hide on extra-small screens 
                sm={4} 
                md={7} 
                className="login-left-panel" // Keep class for CSS styles
                sx={{ 
                    display: { xs: 'none', sm: 'flex' }, // Hide on xs, show on sm and up
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    // Styles like background, border-radius, margin, animation handled by CSS
                }}
            >
                {/* Optional: Content inside the left panel if needed */}
                {/* <Typography variant="h1" className="login-head" sx={{ color: '#fff' }}> </Typography> */}
            </Grid>

            {/* Right Panel */}
            <Grid 
                item 
                xs={12} // Take full width on xs 
                sm={8} 
                md={5} 
                component={Box} // Use Box for easier styling
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                p={{ xs: 3, md: 6 }} // Responsive padding
                sx={{ backgroundColor: '#fff'}} // Ensure white background
            >
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%', // Ensure content takes width
                        maxWidth: '350px' // Control max width of the form area
                    }}
                >
                    {/* Logo - Kept class for background image */}
                    <Box 
                        className="login-logo" 
                        sx={{ 
                            mb: 1, 
                            ml: 2, // Removed mx:auto, added small left margin
                            cursor: 'pointer' 
                        }}
                        onClick={() => navigate('/landpage')} 
                    />
                    
                    <Typography component="h1" variant="h5" className="logtitle" sx={{ fontWeight: 700, color: '#141414', mb: 1 }}>
                        Welcome back!
                    </Typography>
                    <Typography variant="body2" className="login-subtitle" sx={{ color: '#777', mb: 3 }}>
                        Please enter your details
                    </Typography>

                    {error && 
                        <Typography color="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                            {error}
                        </Typography>
                    }

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            variant="standard" // Match the bottom border style
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }} // Spacing
                        />
                        <TextField
                            variant="standard" // Match the bottom border style
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ // Add visibility toggle icon
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="small"
                                        >
                                            {isPasswordVisible ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 1 }} // Spacing
                        />
                        <Box sx={{ width: '100%', textAlign: 'right', mb: 3 }}>
                            <Link href="#" variant="body2" className="login-forgot" sx={{ color: '#777', fontSize: '12px', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading} // Keep disabled state
                            sx={{
                                // className: "login-btn login-btn-primary", // Apply classes via sx if needed, or rely on global CSS
                                borderRadius: '50px',
                                py: 1.5,
                                mb: 1,
                                bgcolor: '#455cff', // Explicitly set bgcolor
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'none',
                                // Ensure isLoading is a boolean for sx prop
                                opacity: isLoading ? 0.7 : 1, // Example: reduce opacity when loading
                                boxShadow: 'none', // Remove shadow
                                '&:hover': {
                                    bgcolor: '#3a4edc', // Slightly darken hover color
                                    boxShadow: 'none' // Ensure no shadow on hover
                                }
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }}/> : 'Log In'}
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained" // Changed to contained to remove border implicitly
                            startIcon={<GoogleIcon />}
                            sx={{
                                // className: "login-btn login-btn-google", // Apply classes via sx if needed, or rely on global CSS
                                borderRadius: '50px',
                                py: 1.5,
                                mb: 2,
                                bgcolor: '#f5f5f5', // Original background
                                color: '#333', // Original text color
                                // borderColor: '#ddd', // Removed explicit border color
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: 'none', // Remove shadow
                                // Hover state for contained variant is handled by MUI
                                '&:hover': { 
                                    bgcolor: '#eee', /* Keep background hover */ 
                                    boxShadow: 'none' // Ensure no shadow on hover
                                }
                            }}
                        >
                            Log in with Google
                        </Button>
                        <Typography variant="body2" align="center" className="login-signup-link" sx={{ color: '#777', fontSize: '12px' }}>
                            Don't have an account?{' '}
                            <Link href="#" onClick={handleSigninClick} sx={{ color: '#141414', fontWeight: 600, textDecoration: 'none' }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
