import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    keyframes,
    AppBar,
    Toolbar
  } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import klippersLogo from '../../assets/klippers-logo.png';

const NavBar = () => {

return (
<>
<AppBar 
position="sticky"
sx={{ 
  bgcolor: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  py: 0.4,
  transition: 'all 0.3s ease',
  boxShadow: 'none'
}}
>
<Container maxWidth="lg">
  <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img 
        src={klippersLogo} 
        alt="Klippers Logo" 
        style={{ 
          width: 80, 
          height: 80,
          objectFit: 'contain'
        }} 
        tabIndex={-1}
        onFocus={(e) => e.target.blur()}
      />
        <Typography variant="h6" sx={{ 
          fontWeight: '800', 
          color: 'white',
          outline: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none'
          }
        }}>
          Klippers
        </Typography>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Button 
      component={RouterLink}
      to="/klippers-pricing"
      variant="text" 
      className="button-hover-effect"
      sx={{ 
                              borderRadius: 12,
          px: 2.5,
          py: 0.8,
          fontSize: '0.875rem',
          color: 'white',
          transition: 'all 0.3s ease',
          textTransform: 'capitalize',
          fontWeight: '600',
          position: 'relative',
          overflow: 'hidden',
                          '&:hover': {
          bgcolor: 'rgba(255,255,255,0.15)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
        },
        '&:focus': {
          bgcolor: 'rgba(255,255,255,0.2)',
          outline: '2px solid #c6f479',
          outlineOffset: '2px',
        }
          }}
      >
          Pricing
        </Button>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button 
        component={RouterLink}
        to="/login"
        variant="text" 
        className="button-hover-effect"
        sx={{ 
                          borderRadius: 12,
        px: 2.5,
        py: 0.8,
        fontSize: '0.875rem',
        color: 'white',
        transition: 'all 0.3s ease',
        textTransform: 'capitalize',
        fontWeight: '600',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.15)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
        },
        '&:focus': {
          bgcolor: 'rgba(255,255,255,0.2)',
          outline: '2px solid #c6f479',
          outlineOffset: '2px',
        }
        }}
      >
        Login
      </Button>
      <Button 
        component={RouterLink}
        to="/klippers-pricing"
        variant="contained" 
        className="button-hover-effect"
        sx={{ 
                          borderRadius: 12,
        px: 2.5,
        py: 0.8,
        fontSize: '0.875rem',
        bgcolor: '#fafafa',
        color: 'black',
        transition: 'all 0.3s ease',
        textTransform: 'capitalize',
        fontWeight: '550',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          bgcolor: '#ffffff',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)',
        },
        '&:focus': {
          bgcolor: '#ffffff',
          outline: '2px solid #c6f479',
          outlineOffset: '2px',
          boxShadow: '0 8px 25px rgba(255, 255, 255, 0.4)',
        }
        }}
      >
        Get Started
      </Button>
    </Box>
  </Toolbar>
</Container>
</AppBar>
</>
  );
};

export default NavBar;