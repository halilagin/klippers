import { AutoAwesome,   Upload } from '@mui/icons-material';
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

const LandingPageVideoInput = () => {
  return (
    <>
    {/* Input Bar */}
    <Box sx={{ 
            maxWidth: '500px', 
            mx: 'auto', 
            animation: 'fadeInUp 1s ease-out 0.6s both',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 255, 255, 0.15)',
            }
          }}>
            <Upload sx={{ fontSize: 18, color: '#808080' }} />
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#808080'
            }}>
              <Typography variant="body1" sx={{ color: '#808080', opacity: 0.8 }}>
                Paste YouTube link or drop a file
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AutoAwesome />}
              className="button-hover-effect"
              sx={{ 
                borderRadius: 12,
                px: 3,
                py: 1,
                bgcolor: '#fafafa',
                color: 'black',
                fontWeight: '600',
                textTransform: 'none',
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
              Generate
            </Button>
          </Box>
    </>
  );
};

export default LandingPageVideoInput;