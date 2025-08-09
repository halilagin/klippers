import { useState } from 'react';
import {    

    Box,
    Typography,
    TextField,
    Button,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppConfig from '@/AppConfig';

const LoginComponent = () => {
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

            navigate('/in/dashboard');
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
        
    );
};

export default LoginComponent;