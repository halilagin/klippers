import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Person,
  BarChart,
  CreditCard,
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import klippersLogo from '../assets/klippers-logo.png';

interface KlippersNavbarProps {
  currentPage?: string;
}

const KlippersNavbar: React.FC<KlippersNavbarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMenuAction = (action: string) => {
    console.log(`${action} clicked`);
    handleProfileMenuClose();
    
    switch (action) {
      case 'Account':
        navigate('/klippers-account');
        break;
      case 'Usage':
        navigate('/klippers-usage');
        break;
      case 'Billing':
        navigate('/klippers-billing');
        break;
      case 'Log out':
        // Handle logout logic here
        console.log('Logging out...');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.8)', 
          backdropFilter: 'blur(8px)', 
          boxShadow: 'none', 
          py: 0.4,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <img 
                src={klippersLogo} 
                alt="Klippers Logo" 
                style={{ 
                  width: 80, 
                  height: 80,
                  objectFit: 'contain'
                }} 
              />
              <Typography variant="h6" sx={{ fontWeight: '700', color: 'white' }}>
                Klippers
              </Typography>
            </Box>

            {/* Navigation Items */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: '#c6f479',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
                onClick={handleProfileMenuOpen}
              >
                U
              </Avatar>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            bgcolor: 'white',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#1F2937',
              '&:hover': {
                bgcolor: '#F9FAFB',
              },
              '&:last-child': {
                '&:hover': {
                  bgcolor: '#F3F4F6',
                }
              }
            },
            '& .MuiListItemIcon-root': {
              minWidth: 36,
              mr: 2
            },
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#1F2937'
            }
          }
        }}
      >
        <MenuItem onClick={() => handleMenuAction('Account')}>
          <ListItemIcon>
            <Person sx={{ fontSize: 22, color: '#6B7280' }} />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('Usage')}>
          <ListItemIcon>
            <BarChart sx={{ fontSize: 22, color: '#6B7280' }} />
          </ListItemIcon>
          <ListItemText primary="Usage" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('Billing')}>
          <ListItemIcon>
            <CreditCard sx={{ fontSize: 22, color: '#6B7280' }} />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('Log out')}>
          <ListItemIcon>
            <Logout sx={{ fontSize: 22, color: '#6B7280' }} />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default KlippersNavbar; 