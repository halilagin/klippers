import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Paper,
  Grid,
  LinearProgress
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import KlippersNavbar from '../components/KlippersNavbar';

const KlippersUsage = () => {
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
            Usage
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ pl: 2, mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: '800', color: 'white', mb: 2 }}>
            Usage Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: '#808080' }}>
            Track your video processing and generation usage
          </Typography>
        </Box>

        {/* Usage Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h5" sx={{ fontWeight: '700', color: 'white', mb: 3 }}>
                Current Month Usage
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#808080' }}>
                    Videos Processed
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: '600' }}>
                    12 / 50
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={24} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#c6f479'
                    }
                  }} 
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#808080' }}>
                    Shorts Generated
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: '600' }}>
                    8 / 25
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={32} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#c6f479'
                    }
                  }} 
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#808080' }}>
                    Storage Used
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: '600' }}>
                    2.4 GB / 10 GB
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={24} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#c6f479'
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h5" sx={{ fontWeight: '700', color: 'white', mb: 3 }}>
                Usage History
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 1 }}>
                  Last 30 Days
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                  • 12 videos processed
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                  • 8 shorts generated
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080' }}>
                  • 2.4 GB storage used
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 1 }}>
                  Plan Limits
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080' }}>
                  You're on the Pro plan with generous limits for video processing and storage.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default KlippersUsage; 