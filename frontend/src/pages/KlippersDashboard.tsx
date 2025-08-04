import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import klippersLogo from '../assets/klippers-logo.png';
import { 
  Movie, 
  Upload, 
  AutoAwesome,
  Dashboard as DashboardIcon,
  CalendarMonth,
  PlayArrow,
  Close
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const KlippersDashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewData({
        type: 'file',
        name: file.name,
        url: e.target?.result as string,
        size: file.size
      });
      setInputValue(file.name);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (!inputValue && !previewData) return;
    
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to shorts page
      window.location.href = '/klippers-shorts';
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check if it's a YouTube URL
    if (value.includes('youtube.com') || value.includes('youtu.be')) {
      setIsLoading(true);
      // Simulate YouTube video processing
      setTimeout(() => {
        setPreviewData({
          type: 'youtube',
          url: value,
          title: 'YouTube Video',
          thumbnail: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=YouTube+Video'
        });
        setIsLoading(false);
      }, 1000);
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#c6f479' }}>
                U
              </Avatar>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        {/* Title and Input Bar Container */}
        <Box sx={{ 
          maxWidth: '1000px', 
          mx: 'auto', 
          mb: 8
        }}>
          {/* Dashboard Title */}
          <Typography variant="body1" sx={{ 
            fontWeight: '300', 
            color: '#808080',
            mb: 5,
            textAlign: 'left',
            fontSize: '0.875rem',
            
            letterSpacing: '0.05em'
          }}>
            Dashboard
          </Typography>          {/* Title */}
          <Typography variant="h4" sx={{ 
            fontWeight: '700', 
            color: 'white',
            mb: 4,
            textAlign: 'left'
          }}>
            Your videos
          </Typography>

          {/* Input Bar */}
                      <Box 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: dragActive ? '2px dashed #c6f479' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(15px)',
                '&:hover': {
                  border: '1px solid #c6f479'
                }
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  handleFileUpload(files[0]);
                }
              }}
            >
            <Upload sx={{ fontSize: 20, color: '#94A3B8', ml: 2 }} />
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              color: '#94A3B8',
              pl: 2
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onPaste={(e) => {
                  const pastedText = e.clipboardData.getData('text');
                  setInputValue(pastedText);
                  if (pastedText.includes('youtube.com') || pastedText.includes('youtu.be')) {
                    setInputValue(pastedText);
                    handleInputChange({ target: { value: pastedText } } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                placeholder="Paste YouTube link or drop a file"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '1rem',
                  color: inputValue ? 'white' : '#94A3B8',
                  fontWeight: '500',
                  cursor: 'text'
                }}
              />
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <Button 
              variant="contained" 
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesome />}
              disabled={isLoading || (!inputValue && !previewData)}
              onClick={handleGenerate}
              sx={{ 
                borderRadius: 12,
                px: 2.8,
                py: 1.2,
                                bgcolor: '#fafafa',
                color: 'black',
                fontWeight: '600',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#e5e5e5'
                },
                '&:disabled': {
                  bgcolor: '#475569'
                }
              }}
            >
              {isLoading ? 'Processing...' : 'Generate'}
            </Button>
          </Box>

          {/* Preview Section */}
          {previewData && (
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ 
                borderRadius: 12, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 0 20px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(15px)'
              }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: 'white' }}>
                      Preview
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setPreviewData(null);
                        setInputValue('');
                      }}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <Close sx={{ fontSize: 18 }} />
                    </Button>
                  </Box>
                  
                  <Box sx={{ 
                    height: 200, 
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                  }}>
                    {previewData.type === 'youtube' ? (
                      <img 
                        src={previewData.thumbnail} 
                        alt="YouTube Video"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <video
                        src={previewData.url}
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {previewData.type === 'youtube' ? 'YouTube' : 'Video File'}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: '300', 
                      color: '#808080',
                      fontSize: '0.875rem'
                    }}>
                      {previewData.name || previewData.title}
                    </Typography>
                    {previewData.size && (
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {(previewData.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default KlippersDashboard;

      

