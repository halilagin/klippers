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
import LoginComponent from '@/components/LoginComponent';


const LoginAppBar = () => {
  return (
    <>
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

    </>
  );
};


const SignInWithGoogleButton = () => {
  return (
    <>
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
    </>
  );
};


const LoginPage = () => {




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

      <LoginAppBar />
      
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SignInWithGoogleButton />
          <LoginComponent />

          </Box>
      </Container>
    </Box>
    </>
  );
};

export default LoginPage;
