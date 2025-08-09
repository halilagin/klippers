import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Paper,
  Grid,
  Button,
  Chip
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import KlippersNavbar from '../components/KlippersNavbar';

const KlippersBilling = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white'
    }}>
      {/* Navigation */}
      <KlippersNavbar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        {/* Breadcrumb */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" sx={{ color: '#808080' }} />} 
          sx={{ mb: 3, pl: 2 }}
        >
          <Typography 
            component={RouterLink} 
            to="/klippers-dashboard"
            sx={{ 
              color: '#808080', 
              textDecoration: 'none',
              '&:hover': { color: '#c6f479' }
            }}
          >
            Dashboard
          </Typography>
          <Typography sx={{ color: '#808080' }}>
            Billing
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ pl: 2, mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: '800', color: 'white', mb: 2 }}>
            Billing & Subscription
          </Typography>
          <Typography variant="body1" sx={{ color: '#808080' }}>
            Manage your subscription and billing information
          </Typography>
        </Box>

        {/* Billing Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: '700', color: 'white' }}>
                  Current Plan
                </Typography>
                <Chip 
                  label="Pro Plan" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 2 }}>
                  Plan Details
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                  • $29/month
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                  • 50 videos per month
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                  • 25 shorts generated
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080' }}>
                  • 10 GB storage
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: '#c6f479',
                    color: 'black',
                    fontWeight: '600',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    '&:hover': {
                      bgcolor: '#b8e66a'
                    }
                  }}
                >
                  Upgrade Plan
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Cancel Subscription
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 3 }}>
                Payment Method
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#808080', mb: 1 }}>
                  Visa ending in 4242
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Expires 12/25
                </Typography>
              </Box>

              <Button 
                variant="outlined" 
                fullWidth
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  textTransform: 'none',
                  py: 1,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Update Payment Method
              </Button>
            </Paper>

            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              mt: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 3 }}>
                Next Billing
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'white', fontWeight: '600', mb: 1 }}>
                January 15, 2024
              </Typography>
              <Typography variant="body2" sx={{ color: '#808080' }}>
                $29.00
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default KlippersBilling; 