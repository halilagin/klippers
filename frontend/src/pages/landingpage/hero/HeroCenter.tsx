

import {
    Box,
    Typography,
  } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import klippersLogo2 from '@/assets/klippers-logo.png';
import LandingPageVideoInput from '@/components/LandingPageVideoInput';


const HeroCenter = () => {
  return (
    <>
    
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" sx={{ 
            fontWeight: '900', 
            mb: 4, 
            color: 'white',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
            lineHeight: { xs: 1.1, md: 1.05 },
            letterSpacing: { xs: '-0.02em', md: '-0.03em' },
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            fontFamily: "'Roboto Flex', sans-serif",
            '& span': {
              color: '#c6f479',
              fontWeight: '900',
            }
          }}>
            Unleash your <span>videos</span> and unlock <Box sx={{ 
              display: 'inline-block',
              mx: 0.2,
              verticalAlign: 'middle',
              position: 'relative',
              width: '1.2em',
              height: '1.2em'
            }}>
              <PlayArrow     sx={{ 
                fontSize: '1.2em', 
                color: '#c6f479',
                position: 'absolute',
                top: 0,
                left: 0,
                animation: 'playArrowFade 3s ease-in-out infinite',
                '@keyframes playArrowFade': {
                  '0%, 40%': {
                    opacity: 1,
                    transform: 'scale(1)'
                  },
                  '50%, 100%': {
                    opacity: 0,
                    transform: 'scale(0.8)'
                  }
                }
              }} />
              <img 
                src={klippersLogo2} 
                alt="Klippers Logo"
                style={{
                  width: '2.2em',
                  height: '2.2em',
                  position: 'absolute',
                  top: '-0.5em',
                  left: '-0.5em',
                  animation: 'fadeIn 3s ease-in-out infinite',
                }}

                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.animation = 'fadeIn 3s ease-in-out infinite';
                }}
              />
            </Box> <span>viral</span> moments
          </Typography>
          <Typography variant="h2" sx={{ 
            fontWeight: '300', 
            mb: 6, 
            color: '#808080',
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}>
            Klippers turns your long videos into TikToks, Reels, and Shorts in one click.
          </Typography>
          
          {/* Trusted by section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              
              <Typography variant="body2" sx={{ color: '#c6f479', fontWeight: '600' }}>
              Join the 1.5M+ who already went viral.
              </Typography>
            </Box>
          </Box>

          <LandingPageVideoInput /> 
        </Box>
    
    </>
  );
};

export default HeroCenter;