import React, { useState } from 'react';
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
  Breadcrumbs,
  Grid,
  Divider,
  Tooltip,
  Modal,
  IconButton
} from '@mui/material';

import klippersLogo from '../assets/klippers-logo.png';
import { 
  Movie, 
  GetApp,
  Publish,
  Edit,
  PlayArrow,
  NavigateNext,
  AutoAwesome,
  FavoriteBorder,
  EditOutlined,
  Star,
  AutoAwesomeOutlined
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import ShortVariation from '../components/ShortVariation';

const KlippersShorts = () => {
  const [selectedShort, setSelectedShort] = useState(0);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [openGenerateModal, setOpenGenerateModal] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const handlePublish = () => {
    setOpenPublishModal(true);
  };

  const handleEdit = () => {
    // Handle edit functionality
    console.log('Edit clicked');
  };

  const handleDownload = () => {
    // Handle download functionality
    console.log('Download clicked');
  };

  const shorts = [
    {
      id: 1,
      title: "The importance of curiosity in learning dance (00:41)",
      viralityScore: 85,
      transcript: "Next one is to be curious. When I started doing tango, I was really curious into what are the different ways that I can break down a step, what are the different ways I can do this, can I do this in reverse, can I do this with the other foot, can I do this with the other side of the embrace, that kind of thing. Being curious is another aspect which I think is really, really important because you don't just copy, or you're not just copying what the teacher is showing you, you're making the dance your own. And that's what the result of being curious is, it's really making the dance your own.",
      viralityDescription: "This video promotes a relatable and inspiring message about curiosity in dance, which can resonate with a wide audience. The personal storytelling aspect adds authenticity, and the practical tips encourage viewer engagement. However, the lack of visual elements or dynamic editing may limit its overall appeal.",
      previewUrl: "https://cdn.midjourney.com/video/561c9001-69c4-4f31-9d65-0861f90b4a2d/3.mp4"
    },
    {
      id: 2,
      title: "Building confidence through dance practice (00:38)",
      viralityScore: 78,
      transcript: "Confidence comes from practice. When you practice something over and over again, you start to feel more comfortable with it. In tango, this means practicing your steps, your posture, your connection with your partner. The more you practice, the more confident you become, and the more you can express yourself through the dance. It's not about being perfect, it's about being comfortable with who you are and what you can do.",
      viralityDescription: "This short focuses on the universal theme of building confidence through practice, which appeals to a broad audience beyond just dancers. The message is motivational and actionable, encouraging viewers to apply the concept to their own lives. The personal experience adds credibility and relatability.",
      previewUrl: "https://cdn.midjourney.com/video/561c9001-69c4-4f31-9d65-0861f90b4a2d/4.mp4"
    },
    {
      id: 3,
      title: "The power of community in dance learning (00:45)",
      viralityScore: 92,
      transcript: "The tango community is incredible. When you're learning, everyone is so supportive. More experienced dancers are always willing to help beginners, share tips, and encourage them to keep going. This sense of community makes the learning process so much more enjoyable and less intimidating. It's not just about the dance itself, it's about the people you meet and the connections you make along the way.",
      viralityDescription: "This video highlights the social and community aspects of dance, which can resonate with viewers who value human connection and support networks. The positive message about community support is universally appealing and can inspire viewers to seek out similar communities in their own interests.",
      previewUrl: "https://cdn.midjourney.com/video/561c9001-69c4-4f31-9d65-0861f90b4a2d/5.mp4"
    }
  ];

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
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#c6f479' }}>
                U
              </Avatar>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
            Your shorts
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 8, width: '100%' }}>
          <Box sx={{ pl: 2, flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: '800', color: 'white', mb: 1 }}>
              Your shorts (12)
            </Typography>
            <Typography variant="body1" sx={{ color: '#808080', mb: 4 }}>
              <span style={{ fontWeight: '600', color: 'white' }}>Generated from</span> patrick-part1.mp4 (38:00)
            </Typography>
            
            {/* Progress Bar */}
            <Box sx={{ 
              width: 'calc(100% + 200px)', 
              height: 4, 
              bgcolor: 'rgba(255, 255, 255, 0.08)', 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
              {/* Variation Segments */}
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: '5%', 
                width: '8%', 
                height: '100%', 
                bgcolor: '#E3E8EF', 
                borderRadius: 2 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: '25%', 
                width: '12%', 
                height: '100%', 
                bgcolor: '#E3E8EF', 
                borderRadius: 2 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: '45%', 
                width: '20%', 
                height: '100%', 
                bgcolor: '#E3E8EF', 
                borderRadius: 2 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: '75%', 
                width: '15%', 
                height: '100%', 
                bgcolor: '#E3E8EF', 
                borderRadius: 2 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: '92%', 
                width: '6%', 
                height: '100%', 
                bgcolor: '#E3E8EF', 
                borderRadius: 2 
              }} />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AutoAwesome />}
            onClick={() => setOpenGenerateModal(true)}
            sx={{ 
              bgcolor: '#fafafa',
              color: 'black',
              borderRadius: 12,
              px: 2.5,
              py: 1.2,
              fontWeight: '600',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: 'none',
              mr: 2,
              border: 'none',
              position: 'relative',
              '&:hover': {
                bgcolor: '#ffffff',
                transform: 'scale(1.05)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Generate new
            <Chip 
              label="Pro" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
                fontWeight: '600',
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                ml: 0.5,
                '& .MuiChip-label': {
                  px: 1
                }
              }} 
            />
          </Button>
        </Box>

        {/* Content Grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shorts.map((short, index) => (
            <ShortVariation
              key={short.id}
              short={short}
              onPublish={handlePublish}
              onEdit={handleEdit}
              onDownload={handleDownload}
            />
          ))}
        </Box>

       
        </Container>

     
      <Modal
        open={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}
      >
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          width: 'calc(100vw - 16px)',
          height: 'calc(100vh - 16px)',
          maxWidth: '1300px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          p: 0,
          position: 'relative',
          overflow: 'hidden',
          mx: 'auto',
          outline: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 24
          }
        }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setOpenPublishModal(false)}
            sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              zIndex: 2,
              bgcolor: '#333333',
              color: 'white',
              borderRadius: 2,
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: '#333333'
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          

          {/* Left: Visual Container */}
          <Box sx={{
            flex: 3,
            minWidth: 0,
            minHeight: { xs: 180, md: 400 },
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: { md: 12, xs: 0 },
            p: 0,
            position: 'relative'
          }}>
            {/* Heart Button - Siyah kısımda */}
            <IconButton
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 2,
                bgcolor: '#333333',
                color: 'white',
                borderRadius: 2,
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: '#333333'
                }
              }}
            >
              <FavoriteBorder sx={{ fontSize: 18 }} />
            </IconButton>
            
            {/* Edit Button - Sağ alt */}
            <IconButton
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 60, 
                zIndex: 2,
                bgcolor: '#333333',
                color: 'white',
                borderRadius: 2,
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: '#333333'
                }
              }}
            >
              <EditOutlined sx={{ fontSize: 18 }} />
            </IconButton>
            
            {/* Download Button - Sağ alt */}
            <IconButton
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16, 
                zIndex: 2,
                bgcolor: '#333333',
                color: 'white',
                borderRadius: 2,
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: '#333333'
                }
              }}
            >
              <GetApp sx={{ fontSize: 18 }} />
            </IconButton>
            {/* Video Container - 9:16 formatında boydan boya */}
            <Box sx={{
              width: '60%',
              height: '100%',
              bgcolor: '#1F2937',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              overflow: 'hidden'
            }}>
              {/* Video placeholder - gerçek video için objectFit: 'contain' kullanılacak */}
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                objectFit: 'contain'
              }}>
                <Typography color="#9CA3AF">Video Container (9:16)</Typography>
              </Box>
            </Box>
            

          </Box>
          {/* Right: Publish Content */}
          <Box sx={{
            flex: 1.2,
            minWidth: 0,
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.8
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1F2937' }}>
              Publish your video
            </Typography>
            <Typography sx={{ color: '#6B7280', mb: 2, fontSize: '1rem', textAlign: 'center' }}>
              Connect at least 1 account to get started.
            </Typography>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ 
                mb: 0, 
                color: '#1F2937', 
                borderColor: '#E5E7EB', 
                textTransform: 'none', 
                fontWeight: 500,
                bgcolor: 'white',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  borderColor: '#E5E7EB'
                }
              }}
              startIcon={
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png" 
                  alt="LinkedIn" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    objectFit: 'contain'
                  }} 
                />
              }
            >
              Connect LinkedIn
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ 
                mb: 0, 
                color: '#1F2937', 
                borderColor: '#E5E7EB', 
                textTransform: 'none', 
                fontWeight: 500,
                bgcolor: 'white',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  borderColor: '#E5E7EB'
                }
              }}
              startIcon={
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" 
                  alt="Instagram" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    objectFit: 'contain'
                  }} 
                />
              }
            >
              Connect Instagram
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ 
                mb: 0, 
                color: '#1F2937', 
                borderColor: '#E5E7EB', 
                textTransform: 'none', 
                fontWeight: 500,
                bgcolor: 'white',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  borderColor: '#E5E7EB'
                }
              }}
              startIcon={
                <img 
                  src="https://i.pinimg.com/736x/e1/0e/3f/e10e3f21d3b4e0f40b04b8fee7f40da4.jpg" 
                  alt="TikTok" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    objectFit: 'contain'
                  }} 
                />
              }
            >
              Connect TikTok
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ 
                color: '#1F2937', 
                borderColor: '#E5E7EB', 
                textTransform: 'none', 
                fontWeight: 500,
                bgcolor: 'white',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  borderColor: '#E5E7EB'
                }
              }}
              startIcon={
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png" 
                  alt="YouTube" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    objectFit: 'contain'
                  }} 
                />
              }
            >
              Connect YouTube
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Generate New Modal */}
      <Modal
        open={openGenerateModal}
        onClose={() => setOpenGenerateModal(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}
      >
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          width: 'calc(100vw - 32px)',
          maxWidth: '700px',
          height: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          outline: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 24
          }
        }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setOpenGenerateModal(false)}
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              zIndex: 2,
              bgcolor: '#F3F4F6',
              color: '#6B7280',
              '&:hover': {
                bgcolor: '#E5E7EB'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Video Preview */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}>
            <Box sx={{
              width: '100%',
              maxWidth: 250,
              aspectRatio: '16/9',
              bgcolor: '#374151',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Typography color="white" variant="h6">
                Video Preview
              </Typography>
              <Typography 
                sx={{ 
                  position: 'absolute', 
                  bottom: 6, 
                  left: 6, 
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                38:00
              </Typography>
            </Box>
          </Box>

          {/* Main Title */}
          <Typography variant="h5" sx={{ fontWeight: '700', color: '#1F2937', mb: 3, textAlign: 'center' }}>
            New Short about...
          </Typography>

          {/* Input Field */}
          <Box sx={{ mb: 4 }}>
            <input
              type="text"
              placeholder="Write a topic covered in your video..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.outline = 'none'}
            />
          </Box>

          {/* Topic Suggestions */}
                      <Box sx={{ mb: 4, bgcolor: 'rgba(227, 232, 239, 0.3)', borderRadius: 12, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#1F2937', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              Topic suggestion
              <AutoAwesome sx={{ fontSize: 16, color: '#1F2937' }} />
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
              We found great unused topics!
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                "Navigating Relationships in the Dance Community",
                "How Music Influences the Experience of Dancing Tango",
                "The evolution of personal interests: From martial arts to tango",
                "Balancing technique and personal expression in tango",
                "Enhancing the tango community experience",
                "The Importance of Community and Connection in Tango Culture"
              ].map((topic, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => setTopicInput(topic)}
                  startIcon={
                    <Box sx={{
                      width: 40,
                      height: 24,
                      bgcolor: '#374151',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography sx={{ color: 'white', fontSize: '0.6rem', fontWeight: '500' }}>
                        {Math.floor(Math.random() * 60) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    bgcolor: '#E3E8EF',
                    borderRadius: 12,
                    py: 1,
                    px: 2,
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: '#E3E8EF',
                      borderColor: '#D1D5DB'
                    }
                  }}
                >
                  {topic}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Generate Button */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#1F2937',
                color: 'white',
                borderRadius: 12,
                py: 1.2,
                fontWeight: '600',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#111827'
                }
              }}
            >
              Generate
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default KlippersShorts; 