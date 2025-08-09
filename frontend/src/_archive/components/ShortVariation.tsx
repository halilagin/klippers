import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Tooltip
} from '@mui/material';
import { 
  GetApp,
  Publish,
  Edit
} from '@mui/icons-material';

interface ShortVariationProps {
  short: {
    id: number;
    title: string;
    viralityScore: number;
    transcript: string;
    viralityDescription: string;
    previewUrl?: string;
  };
  onPublish: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

const ShortVariation: React.FC<ShortVariationProps> = ({ 
  short, 
  onPublish, 
  onEdit, 
  onDownload 
}) => {
  return (
    <Grid container spacing={8}>
      {/* Video Preview Column */}
      <Grid item xs={12} lg={4}>
        {/* Video Container */}
        <Box sx={{
          width: '85%',
          maxWidth: 320,
          mx: 0,
          ml: 2,
          aspectRatio: '9/16',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: '#808080' }}>
            Video Preview Container
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          width: '85%',
          maxWidth: 320,
          mx: 0,
          ml: 2
        }}>
          <Button 
            variant="contained" 
            onClick={onDownload}
            sx={{ 
              bgcolor: '#fafafa',
              color: 'black',
              borderRadius: 12,
              py: 1.6,
              px: 1.5,
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'none',
              flex: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#ffffff',
                transform: 'scale(1.05)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Download HD
          </Button>
          <Tooltip 
            title="Publish" 
            placement="top" 
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: '0.85rem',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: 1.5
                }
              }
            }}
          >
            <Button 
              variant="text" 
              onClick={onPublish}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                borderRadius: 12,
                px: 1.5,
                py: 1.6,
                minWidth: 'auto',
                width: 48,
                height: 48,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: '#c6f479',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Publish sx={{ fontSize: 16 }} />
            </Button>
          </Tooltip>
          <Tooltip 
            title="Edit" 
            placement="top" 
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: '0.85rem',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: 1.5
                }
              }
            }}
          >
            <Button 
              variant="text" 
              onClick={onEdit}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                borderRadius: 12,
                px: 1.5,
                py: 1.6,
                minWidth: 'auto',
                width: 48,
                height: 48,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: '#c6f479',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </Button>
          </Tooltip>
        </Box>

        <Box sx={{ 
          width: '85%',
          maxWidth: 280,
          mx: 0,
          ml: 2,
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{ 
            color: '#6B7280', 
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            display: 'block'
          }}>
            Video appear glitchy? Don't worry, it
          </Typography>
          <Typography variant="caption" sx={{ 
            color: '#6B7280', 
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            display: 'block',
            pl: 2
          }}>
            won't when you download it.
          </Typography>
        </Box>
      </Grid>

      {/* Content Column */}
      <Grid item xs={12} lg={8}>
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          maxHeight: 'calc(70vw * 16/9)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            pr: 2
          }}>
            <Typography variant="h5" sx={{ fontWeight: '700', color: 'white', mb: 3 }}>
              {short.title}
            </Typography>

            {/* Virality Score */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', fontSize: '1rem' }}>
                  #{short.id} Virality score ({short.viralityScore}/100)
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontSize: '1rem', fontWeight: '300' }}>
                  {short.viralityDescription}
                </Typography>
              </Box>
            </Box>

            {/* Transcript */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: '600', color: 'white', mb: 2, fontSize: '1rem' }}>
                Transcript
              </Typography>
              <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontSize: '1.1rem', fontWeight: '300' }}>
                {short.transcript}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ShortVariation; 