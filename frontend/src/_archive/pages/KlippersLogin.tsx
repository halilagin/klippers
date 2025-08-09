import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  CssBaseline,
  GlobalStyles,
  AppBar,
  Toolbar
} from '@mui/material';

import klippersLogo from '../assets/klippers-logo.png';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconButton, 
    InputAdornment, 
    CircularProgress // For loading state
} from '@mui/material';
import AppConfig from '@/AppConfig';



const KlippersLogin = () => {
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

            navigate('/klippers-dashboard');
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
    <>
      <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white'
    }}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          fontFamily: "'Roboto Flex', sans-serif"
        }
      }} />

      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.8)', 
          backdropFilter: 'blur(8px)', 
          boxShadow: 'none', 
          py: 0.4
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <RouterLink to="/klippers" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} tabIndex={-1}>
                <img 
                  src={klippersLogo} 
                  alt="Klippers Logo" 
                  style={{ 
                    width: 80, 
                    height: 80,
                    objectFit: 'contain',
                    marginRight: '8px'
                  }} 
                />
                <Typography variant="h6" sx={{ 
                  fontWeight: '700', 
                  color: 'white',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}>
                  Klippers
                </Typography>
              </RouterLink>
            </Box>
            {/* Empty Box to balance the layout and align the logo correctly */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: 220 }} />
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ fontWeight: '800', mb: 3, color: 'white' }}>
            Welcome back!
          </Typography>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<img src="https://www.google.com/favicon.ico" alt="Google icon" style={{ width: 20, height: 20 }} />}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              borderRadius: '9999px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)'
              },
            }}
          >
            Sign in with Google
          </Button>

          <Typography sx={{ color: '#94A3B8', my: 2 }}>or</Typography>

          <Box component="form" onSubmit={handleSubmit}   noValidate sx={{ mt: 1, width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: '300', mb: 1, textAlign: 'left', color: '#808080' }}>
              Email address
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                mt: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'border-color 0.3s ease',
                  '& fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&:hover fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #c6f479',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                },
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: '300', mb: 1, mt: 2, textAlign: 'left', color: '#808080' }}>
              Your Password
            </Typography>
                        <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Your password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{
                mt: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'border-color 0.3s ease',
                  '& fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&:hover fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none !important',
                    borderWidth: '0 !important',
                    borderColor: 'transparent !important',
                  },
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #c6f479',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor: '#fafafa',
                color: 'black',
                borderRadius: '9999px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                '&:hover': {
                  bgcolor: '#e5e5e5',
                },
              }}
            >
              Sign in
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="#" variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none' }}>
                Forgot your password?
              </Link>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#808080', fontWeight: '300' }}>
                Don't have an account?{' '}
                <Link href="#" onClick={handleSigninClick} sx={{ color: '#141414', fontWeight: 600, textDecoration: 'none' }}>
                    Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default KlippersLogin;
