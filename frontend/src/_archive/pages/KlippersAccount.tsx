import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Paper,
  Grid,
  Divider,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import { NavigateNext, Edit, Check, Cancel, Security, Notifications, Language, Download } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import KlippersNavbar from '../components/KlippersNavbar';

const KlippersAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: 'User Name',
    email: 'user@example.com',
    memberSince: 'January 2024'
  });

  const [editForm, setEditForm] = useState({
    name: personalDetails.name,
    email: personalDetails.email
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: personalDetails.name,
      email: personalDetails.email
    });
  };

  const handleSave = () => {
    setPersonalDetails({
      ...personalDetails,
      name: editForm.name,
      email: editForm.email
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: personalDetails.name,
      email: personalDetails.email
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
            Account
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ pl: 2, mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: '800', color: 'white', mb: 2 }}>
            Account Settings
          </Typography>
          <Typography variant="body1" sx={{ color: '#808080' }}>
            Manage your account preferences and settings
          </Typography>
        </Box>

        {/* Account Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
                              <Typography variant="h4" sx={{ fontWeight: '800', color: 'white', mb: 3 }}>
                  Profile Information
                </Typography>
              
                              <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: '700', color: 'white' }}>
                      Personal Details
                    </Typography>
                    {!isEditing && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: '#c6f479',
                          textTransform: 'none',
                          py: 0.4,
                          px: 2,
                          borderRadius: 3,
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          '&:hover': {
                            borderColor: '#c6f479',
                            bgcolor: 'rgba(198, 244, 121, 0.1)'
                          }
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                  
                  {!isEditing ? (
                    <>
                      <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                        Name: {personalDetails.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
                        Email: {personalDetails.email}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#808080' }}>
                        Member since: {personalDetails.memberSince}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Name"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#c6f479',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#808080',
                            '&.Mui-focused': {
                              color: '#c6f479',
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#c6f479',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#808080',
                            '&.Mui-focused': {
                              color: '#c6f479',
                            },
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                        Member since: {personalDetails.memberSince}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Check />}
                          onClick={handleSave}
                          sx={{
                            bgcolor: '#c6f479',
                            color: 'black',
                            fontWeight: '600',
                            textTransform: 'none',
                            px: 3,
                            py: 0.8,
                            borderRadius: 3,
                            '&:hover': {
                              bgcolor: '#b8e66a'
                            }
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            textTransform: 'none',
                            px: 3,
                            py: 0.8,
                            borderRadius: 3,
                            '&:hover': {
                              borderColor: 'white',
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                              <Typography variant="h5" sx={{ fontWeight: '700', color: 'white', mb: 2, mt: 4 }}>
                  Account Settings
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080' }}>
                  Manage your account preferences, privacy settings, and notification preferences here.
                </Typography>
            </Paper>
          </Grid>

                      <Grid item xs={12} md={4}>
              <Paper sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h5" sx={{ fontWeight: '700', color: 'white', mb: 3 }}>
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Security />}
                    fullWidth
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      textTransform: 'none',
                      py: 1,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#c6f479',
                        bgcolor: 'rgba(198, 244, 121, 0.1)'
                      }
                    }}
                  >
                    Security Settings
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Notifications />}
                    fullWidth
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      textTransform: 'none',
                      py: 1,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#c6f479',
                        bgcolor: 'rgba(198, 244, 121, 0.1)'
                      }
                    }}
                  >
                    Notification Preferences
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Language />}
                    fullWidth
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      textTransform: 'none',
                      py: 1,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#c6f479',
                        bgcolor: 'rgba(198, 244, 121, 0.1)'
                      }
                    }}
                  >
                    Language & Region
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    fullWidth
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      textTransform: 'none',
                      py: 1,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#c6f479',
                        bgcolor: 'rgba(198, 244, 121, 0.1)'
                      }
                    }}
                  >
                    Export Data
                  </Button>
                </Box>
              </Paper>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default KlippersAccount; 