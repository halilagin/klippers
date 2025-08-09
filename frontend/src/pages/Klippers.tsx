import React, { useState, useEffect } from 'react';
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
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import klippersLogo from '../assets/klippers-logo.png';
import klippersFavicon from '../assets/klippersfavicon.png';
import klippersLogo2 from '/klipperslogo2.png';
import {
  PlayArrow,
  TrendingUp,
  AutoAwesome,
  Crop,
  Subtitles,
  ViewModule,
  Psychology,
  Bolt,
  Star,
  CheckCircle,
  YouTube,
  Instagram,
  Facebook,
  ArrowForward,
  ExpandMore,
  CloudUpload,
  Link,
  Upload,
  VideoFile,
  PlayCircle,
  YouTube as YouTubeIcon,
  Speed,
  StarBorder,
  Movie,
  UploadFile,
  Download,
  ArrowDownward,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    text: "This tool has completely transformed my workflow. I can now create engaging shorts from my long-form content in minutes instead of hours.",
    avatar: "SC",
    rating: 5
  },
  {
    name: "Mike Rodriguez",
    role: "Marketing Manager",
    text: "The AI detection is incredibly accurate. It finds the most engaging moments automatically, saving us tons of time.",
    avatar: "MR",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Educator",
    text: "Perfect for creating educational content. My students love the short, focused clips that maintain the key learning points.",
    avatar: "ET",
    rating: 5
  }
];

const comparisonData = {
  'opus-clip': {
    name: 'Opus Clip',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '20-45 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$39/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Free Trial',
        klippers: '1 Credit',
        alternative: '5 videos',
        description: 'What you get for free'
      }
    ],
    stats: {
      speed: '3x Faster',
      quality: 'Better AI',
      price: '25% Cheaper'
    }
  },
  'capcut': {
    name: 'CapCut',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '15-30 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '4K',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: 'Free',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'AI Features',
        klippers: 'Advanced',
        alternative: 'Basic',
        description: 'AI-powered editing capabilities'
      }
    ],
    stats: {
      speed: '2x Faster',
      quality: 'Better AI',
      price: 'Premium Features'
    }
  },
  'invideo': {
    name: 'InVideo',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '25-40 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$25/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Template Library',
        klippers: 'AI-Generated',
        alternative: '10,000+',
        description: 'Available templates and styles'
      }
    ],
    stats: {
      speed: '4x Faster',
      quality: 'Better AI',
      price: 'Similar Price'
    }
  },
  'pictory': {
    name: 'Pictory',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '30-60 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$23/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'AI Capabilities',
        klippers: 'Advanced',
        alternative: 'Basic',
        description: 'AI-powered features and automation'
      }
    ],
    stats: {
      speed: '5x Faster',
      quality: 'Better AI',
      price: 'Similar Price'
    }
  },
  'synthesia': {
    name: 'Synthesia',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '45-90 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$30/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Use Case',
        klippers: 'Video Editing',
        alternative: 'AI Avatars',
        description: 'Primary functionality focus'
      }
    ],
    stats: {
      speed: '8x Faster',
      quality: 'Better AI',
      price: 'Similar Price'
    }
  },
  'lumen5': {
    name: 'Lumen5',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '20-35 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$19/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Content Type',
        klippers: 'Video Clips',
        alternative: 'Social Media',
        description: 'Primary content focus'
      }
    ],
    stats: {
      speed: '3x Faster',
      quality: 'Better AI',
      price: 'Premium Features'
    }
  },
  'veed': {
    name: 'Veed.io',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '15-25 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '4K',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$18/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Editing Features',
        klippers: 'AI-Focused',
        alternative: 'Comprehensive',
        description: 'Range of editing capabilities'
      }
    ],
    stats: {
      speed: '2x Faster',
      quality: 'Better AI',
      price: 'Premium AI'
    }
  },
  'descript': {
    name: 'Descript',
    features: [
      {
        feature: 'AI Viral Detection',
        klippers: true,
        alternative: false,
        description: 'Automatically finds the most engaging moments'
      },
      {
        feature: '1-Click Generation',
        klippers: true,
        alternative: false,
        description: 'Create multiple clips with a single click'
      },
      {
        feature: 'Processing Speed',
        klippers: '5-10 minutes',
        alternative: '25-40 minutes',
        description: 'Time to process 1-hour video'
      },
      {
        feature: 'Export Quality',
        klippers: '4K',
        alternative: '1080p',
        description: 'Maximum export resolution'
      },
      {
        feature: 'Pricing',
        klippers: '$29/month',
        alternative: '$12/month',
        description: 'Starting price for pro plans'
      },
      {
        feature: 'Primary Use',
        klippers: 'Video Editing',
        alternative: 'Audio Editing',
        description: 'Main functionality focus'
      }
    ],
    stats: {
      speed: '4x Faster',
      quality: 'Better AI',
      price: 'Premium Features'
    }
  }
};

const Klippers: React.FC = () => {
  const [counts, setCounts] = useState({
    speed: 10,
    accuracy: 95,
    videos: 50,
    rating: 4.9
  });

  const [isVisible, setIsVisible] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    bgcolor: 'black',
    borderColor: 'transparent'
  });
  const [inputBarPosition, setInputBarPosition] = useState('top');
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

  useEffect(() => {

    // Scroll event listener for navbar style and input bar position
    const handleScroll = () => {
      // Handle input bar position
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If scrolled more than 50% of the page, move input bar to bottom
      if (currentScrollY > windowHeight * 0.5) {
        setInputBarPosition('bottom');
      } else {
        setInputBarPosition('top');
      }

      // Handle navbar border - only show when scrolled
      if (currentScrollY > 50) {
        setNavbarStyle({
          bgcolor: 'black',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        });
      } else {
        setNavbarStyle({
          bgcolor: 'black',
          borderColor: 'transparent'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Box sx={{ bgcolor: 'black', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar 
        position="sticky"
        sx={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          py: 0,
          transition: 'all 0.5s ease-in-out',
          boxShadow: scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.05), 0 1px 3px rgba(255, 255, 255, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0, minHeight: '40px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                              <img 
                  src={klippersLogo} 
                  alt="Klippers Logo" 
                  style={{ 
                    width: 50, 
                    height: 50,
                    objectFit: 'contain'
                  }} 
                  tabIndex={-1}
                  onFocus={(e) => e.target.blur()}
                />
                <Typography variant="h6" sx={{ 
                  fontWeight: '800', 
                  color: 'white',
                  fontSize: '1.1rem',
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
                to="/klippers-login"
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

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 16 }}>
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
            Unleash your             <Box sx={{ 
              display: 'inline-block',
              mx: 0.2,
              verticalAlign: 'middle',
              position: 'relative',
              width: '1.2em',
              height: '1.2em'
            }}>
              <PlayArrow sx={{ 
                fontSize: '1.2em', 
                color: '#c6f479',
                position: 'absolute',
                top: 0,
                left: 0
              }} />
            </Box> <span>videos</span> and unlock             <Box sx={{ 
              display: 'inline-block',
              mx: 0.2,
              verticalAlign: 'middle',
              position: 'relative',
              width: '1.2em',
              height: '1.2em'
            }}>
              <img 
                src={klippersLogo2} 
                alt="Klippers Logo"
                style={{
                  width: '2.2em',
                  height: '2.2em',
                  position: 'absolute',
                  top: '-0.5em',
                  left: '-0.5em'
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

          {/* Input Bar - Top Position */}
          {inputBarPosition === 'top' && (
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
                component={RouterLink}
                to="/klippers-trial"
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
          )}
 
          </Box>

        {/* Video Grid */}
        <Box sx={{ 
          width: '100%', 
          mt: 24,
          animation: 'fadeInUp 1s ease-out 0.8s both'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'center',
            flexWrap: 'nowrap',
            pb: 2
          }}>
            {/* Video Container 1 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              position: 'relative',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.02)',
              }
            }}>
              <video
                src="https://cdn.midjourney.com/video/561c9001-69c4-4f31-9d65-0861f90b4a2d/3.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                zIndex: 1
              }} />
            </Box>

            {/* Video Container 2 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/45213149-21f4-447f-bacd-946c881aea16/1.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>

            {/* Video Container 3 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/b9430049-8e96-4a0e-ad88-8e305b6201ce/1.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>

            {/* Video Container 4 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/94ac3361-6d73-434c-b3f8-b7be510c4918/1.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>

            {/* Video Container 5 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/6939b8b4-e23e-4179-ad26-161a406398ef/0.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>

            {/* Video Container 6 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/48e1413e-d546-494c-816a-c700535068a1/0.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>

            {/* Video Container 7 */}
            <Box sx={{ 
              width: 220,
              height: 391,
              borderRadius: 12,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              position: 'relative',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              <video
                src="https://cdn.midjourney.com/video/c4dfcc57-6819-4c23-a6f3-3de60de521a3/0.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <Box sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(to left, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                zIndex: 1
              }} />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'black', py: 16 }}>
        <Container maxWidth="xl">

          {/* Feature 1: AI Viral Detection */}
          <Grid container spacing={8} alignItems="center" sx={{ mb: 24 }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: '800', mb: 3, lineHeight: 1.3, color: 'white' }}>
                Find viral moments effortlessly with <span style={{ color: '#c6f479' }}>AI Detection</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                Our advanced AI acts as your personal video editor, analyzing your content for emotional peaks, engaging dialogue, and viral-worthy moments. It automatically pinpoints the best segments, saving you hours of manual searching.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: 'black', borderRadius: 4, p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>Visual 1</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Feature 2: 1-Click Creation */}
          <Grid container spacing={8} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 24 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: 'black', borderRadius: 4, p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>Visual 2</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: '800', mb: 3, lineHeight: 1.3, color: 'white' }}>
                Create & export viral clips in a <span style={{ color: '#c6f479' }}>single click</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                Transform your long-form content into multiple, ready-to-publish viral clips with just a single click. Our system handles the complex editing, so you can focus on creating.
              </Typography>
            </Grid>
          </Grid>

          {/* Feature 3: Smart Cropping */}
          <Grid container spacing={8} alignItems="center" sx={{ mb: 24 }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: '800', mb: 3, lineHeight: 1.3, color: 'white' }}>
                Perfectly frame your shots with <span style={{ color: '#c6f479' }}>smart cropping</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                Our intelligent cropping and reframing technology automatically keeps the main subject in focus. It ensures your videos look professionally shot and perfectly formatted for any vertical platform.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: 'black', borderRadius: 4, p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>Visual 3</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Feature 4: Auto Subtitles */}
          <Grid container spacing={8} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: 'black', borderRadius: 4, p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>Visual 4</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: '800', mb: 3, lineHeight: 1.3, color: 'white' }}>
                Engage more viewers with <span style={{ color: '#c6f479' }}>automatic subtitles</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                Instantly generate and sync accurate, stylish subtitles for your clips. Boost engagement and make your content accessible to a wider audience with perfectly timed captions.
              </Typography>
            </Grid>
          </Grid>

        </Container>
      </Box>

      {/* Stats Section */}
      <Box id="stats-section" sx={{ bgcolor: 'black', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 16 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {/* Stat 1: Blazing Fast */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 0 30px rgba(255, 255, 255, 0.2)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                  }}>
                    <Speed sx={{ fontSize: 48, color: '#c6f479', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 1 }}>
                      Blazing Fast
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
                      From hours to minutes. Create clips at unparalleled speed.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Stat 2: AI-Powered */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 0 30px rgba(255, 255, 255, 0.2)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s'
                  }}>
                    <AutoAwesome sx={{ fontSize: 48, color: '#c6f479', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 1 }}>
                      AI-Powered
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
                      Our smart AI finds the most engaging moments for you.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Stat 3: Go Viral */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 0 30px rgba(255, 255, 255, 0.2)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s'
                  }}>
                    <TrendingUp sx={{ fontSize: 48, color: '#c6f479', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 1 }}>
                      Go Viral
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
                      Optimized for TikTok, Reels, and Shorts to maximize reach.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Stat 4: Top Rated */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 0 30px rgba(255, 255, 255, 0.2)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease-out 0.6s, transform 0.6s ease-out 0.6s'
                  }}>
                    <StarBorder sx={{ fontSize: 48, color: '#c6f479', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 1 }}>
                      Top Rated
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
                      Loved by over 1.5M creators worldwide.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Trust & Social Proof Section */}
      <Box id="testimonials-section" sx={{ bgcolor: 'black', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h2" sx={{ fontWeight: '800', mb: 4, color: 'white' }}>
              Outcome: more <span style={{ color: '#c6f479' }}>happy</span> users!
            </Typography>
          </Box>
          
          {/* Additional Testimonials Grid */}
          <Box sx={{ mt: 12 }}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ fontWeight: '700', mb: 2, color: 'white' }}>
                        'Love it!'
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2, lineHeight: 1.5 }}>
                        "Great tool. Works perfect. Strongly recommended."
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#c6f479' }}>
                        Jacob B. - <Typography component="span" variant="caption" sx={{ color: '#6B7280' }}>Content Creator</Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ fontWeight: '700', mb: 2, color: 'white' }}>
                        'Game changer!'
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2, lineHeight: 1.5 }}>
                        "It's a game changer for video editing, it's user-friendly and saves a lot of time. Highly recommend!"
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#c6f479' }}>
                        Anastasia G. - <Typography component="span" variant="caption" sx={{ color: '#6B7280' }}>Content Creator</Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ fontWeight: '700', mb: 2, color: 'white' }}>
                        'Impressive stuff!'
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2, lineHeight: 1.5 }}>
                        "The AI features are top-notch and have significantly improved my workflow."
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#c6f479' }}>
                        Mike P. - <Typography component="span" variant="caption" sx={{ color: '#6B7280' }}>Videographer</Typography>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  width: '100%',
                  maxWidth: 360,
                  mx: 'auto',
                  aspectRatio: '16 / 25',
                  bgcolor: '#1F2937',
                  borderRadius: 4,
                  border: '1px solid #374151',
                  overflow: 'hidden'
                }}>
                  <video
                    src="https://cdn.midjourney.com/video/42776602-d2fe-44d4-8a7f-31925bd0546a/2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ bgcolor: 'black', py: 16 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h2" sx={{ fontWeight: '800', mb: 4, color: 'white' }}>
              How <span style={{ color: '#c6f479' }}>Klippers</span> works?
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="flex-start">
            {/* Step 1 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ height: 250, bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, mb: 4, backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }} />
                <Typography variant="body1" sx={{ fontWeight: '550', color: 'white', mb: 2, fontSize: '1.25rem' }}>
                  Start by uploading a video
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Simply paste a link to your YouTube video, or upload a video file. Our rule of thumb: a one-minute long video produces about 5 video clips.
                </Typography>
              </Box>
            </Grid>

            {/* Step 2 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ height: 250, bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, mb: 4, backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }} />
                <Typography variant="body1" sx={{ fontWeight: '550', color: 'white', mb: 2, fontSize: '1.25rem' }}>
                  Let Klippers' AI magically create vertical videos
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Just sit back and relax, while Klippers does all the work for you. In a matter of minutes, we will give you multiple viral-worthy clips.
                </Typography>
              </Box>
            </Grid>

            {/* Step 3 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ height: 250, bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, mb: 4, backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }} />
                <Typography variant="body1" sx={{ fontWeight: '550', color: 'white', mb: 2, fontSize: '1.25rem' }}>
                  Post your videos and grow your followers
                </Typography>
                <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  After you make any final touches, you're all set to export them in high-resolution and share them on your other social channels.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* FAQ Section */}
      <Box sx={{ py: 16, bgcolor: 'black' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h2" sx={{ 
              fontWeight: '800', 
              mb: 3,
              color: 'white'
            }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#808080',
              maxWidth: '600px',
              mx: 'auto'
            }}>
              Everything you need to know about Klippers
            </Typography>
          </Box>

            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    How does AI detect viral moments?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    Our AI analyzes facial expressions, speech patterns, engagement cues, and audio intensity to identify the most compelling moments in your videos.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    What video formats are supported?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    We support MP4, MOV, AVI, and most common video formats. Upload your video and we'll handle the rest.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    Can I customize the generated clips?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    Yes! You can edit the AI-generated clips, adjust timing, add text overlays, and customize them to match your brand.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    How long does processing take?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    Processing time depends on video length. A 1-hour video typically takes 5-10 minutes to analyze and generate clips.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    Do you offer refunds?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your subscription.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 'none', bgcolor: 'black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { my: 2 },
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: '400', 
                    color: 'white'
                  }}>
                    Is my content secure?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#808080', lineHeight: 1.6, fontWeight: '300' }}>
                    Absolutely. We use enterprise-grade encryption and your videos are automatically deleted after processing.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
        </Container>
      </Box>

      {/* Sticky Input Bar - Bottom Position */}
      {inputBarPosition === 'bottom' && (
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%'
        }}>
          <Box sx={{ 
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
              component={RouterLink}
              to="/klippers-trial"
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
        </Box>
      )}

      {/* Comparison Table Section */}
      {selectedAlternative && (
        <Box sx={{ 
          bgcolor: 'black', 
          py: 12
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" sx={{ 
                fontWeight: '800', 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}>
                Klippers vs {comparisonData[selectedAlternative as keyof typeof comparisonData]?.name}
              </Typography>
              <Typography variant="h5" sx={{ 
                color: '#808080',
                fontWeight: '300',
                maxWidth: '800px',
                mx: 'auto'
              }}>
                See why creators choose Klippers over {comparisonData[selectedAlternative as keyof typeof comparisonData]?.name}
              </Typography>
            </Box>



            <TableContainer component={Paper} sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
              backdropFilter: 'blur(15px)'
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: '600',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '1.1rem'
                    }}>
                      Feature
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: '600',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      fontSize: '1.1rem'
                    }}>
                      Klippers
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#808080', 
                      fontWeight: '600',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      fontSize: '1.1rem'
                    }}>
                      {comparisonData[selectedAlternative as keyof typeof comparisonData]?.name}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonData[selectedAlternative as keyof typeof comparisonData]?.features.map((row, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: '500', mb: 0.5 }}>
                            {row.feature}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#808080', fontSize: '0.8rem' }}>
                            {row.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {typeof row.klippers === 'boolean' ? (
                          row.klippers ? (
                            <CheckCircle sx={{ color: '#c6f479', fontSize: 24 }} />
                          ) : (
                            <CancelIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                          )
                        ) : (
                          <Typography variant="body2" sx={{ color: '#c6f479', fontWeight: 600 }}>
                            {row.klippers}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {typeof row.alternative === 'boolean' ? (
                          row.alternative ? (
                            <CheckCircle sx={{ color: '#c6f479', fontSize: 24 }} />
                          ) : (
                            <CancelIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                          )
                        ) : (
                          <Typography variant="body2" sx={{ color: '#808080', fontWeight: 500 }}>
                            {row.alternative}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Box>
      )}

      {/* Footer */}
        <Box sx={{ 
          bgcolor: 'black', 
          py: 12,
          pb: 16 // Extra padding to account for sticky input bar
        }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center" sx={{ textAlign: 'center' }}>
            {/* Product Links */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ 
                fontWeight: '500', 
                color: 'white', 
                mb: 3,
                fontSize: '0.9rem'
              }}>
                Product
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#c6f479' }
                }}>
                  Features
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Pricing
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Templates
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  API
                </Typography>
              </Box>
            </Grid>

            {/* Company Links */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ 
                fontWeight: '500', 
                color: 'white',
                mb: 3,
                fontSize: '0.9rem'
              }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  About
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Blog
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Careers
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Press
                </Typography>
              </Box>
            </Grid>

            {/* Support Links */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ 
                fontWeight: '500', 
                color: 'white',
                mb: 3,
                fontSize: '0.9rem'
              }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Help Center
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Status
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Community
                </Typography>
              </Box>
            </Grid>

            {/* Alternatives Links */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ 
                fontWeight: '500', 
                color: 'white',
                mb: 3,
                fontSize: '0.9rem'
              }}>
                Alternatives
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('opus-clip')}
                  sx={{ 
                    color: selectedAlternative === 'opus-clip' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Opus Clip
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('capcut')}
                  sx={{ 
                    color: selectedAlternative === 'capcut' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  CapCut
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('invideo')}
                  sx={{ 
                    color: selectedAlternative === 'invideo' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  InVideo
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('pictory')}
                  sx={{ 
                    color: selectedAlternative === 'pictory' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Pictory
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('synthesia')}
                  sx={{ 
                    color: selectedAlternative === 'synthesia' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Synthesia
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('lumen5')}
                  sx={{ 
                    color: selectedAlternative === 'lumen5' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Lumen5
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('veed')}
                  sx={{ 
                    color: selectedAlternative === 'veed' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Veed.io
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => setSelectedAlternative('descript')}
                  sx={{ 
                    color: selectedAlternative === 'descript' ? '#c6f479' : '#808080',
                    cursor: 'pointer',
                    '&:hover': { color: '#7b5cfa' }
                  }}
                >
                  Descript
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Comparison Table Section */}
          

          {/* Bottom Footer */}
          <Box sx={{ 
            mt: 6,
            pt: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
                          <Typography variant="body2" sx={{ color: '#808080' }}>
                © 2024 Klippers. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Privacy Policy
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Terms of Service
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#808080',
                  cursor: 'pointer',
                  '&:hover': { color: '#7b5cfa' }
                }}>
                  Cookie Policy
                </Typography>
              </Box>
          </Box>
        </Container>
      </Box>
    </Box>
    </>
  );
};

export default Klippers;
