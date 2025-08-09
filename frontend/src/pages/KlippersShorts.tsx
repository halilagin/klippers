import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Breadcrumbs,
  Grid,
  Divider,
  Tooltip,
  Modal,
  IconButton,
  LinearProgress
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
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ShortVariation from '@/components/ShortVariation';
import InnerNavbar from '@/components/InnerNavbar';
import PublishShortModal from '@/components/modals/PublishShortModal';
import VideoClipSegmentsFlow from '@/components/VideoClipSegmentsFlow';
import GenerateNewShortModal from '@/components/modals/GenerateNewShortModal';
import AppConfig from '@/AppConfig';

interface KlipperShortModel {
  id: number;
  title: string;
  viralityScore: number;
  transcript: string;
  viralityDescription: string;
  previewUrl: string;
}

interface KlipperShortProps {
  short: KlipperShortModel;
  onPublish: () => void;
  onEdit: () => void;
  onDownload: () => void;
}





const KlippersShort = (props: KlipperShortProps) => {
  const { short, onPublish, onEdit, onDownload } = props;
  const [videoId, setVideoId] = useState("fe80098a-f9b8-4a4a-8177-e657799bb59b");
  

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
          {short.previewUrl ? (
            <video
              src={short.previewUrl}
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
          ) : (
            <Typography variant="body2" sx={{ color: '#808080' }}>
              Video Preview Container
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          justifyContent: 'center',
          width: '85%',
          maxWidth: 320,
          mx: 0,
          ml: 2,
          mb: 2
        }}>
          <Button
            variant="contained"
            startIcon={<Publish />}
            onClick={onPublish}
            sx={{
              bgcolor: '#c6f479',
              color: 'black',
              fontWeight: '600',
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#b8e66a'
              }
            }}
          >
            Publish
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: '600',
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              '&:hover': { 
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Edit
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={onDownload}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: '600',
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              '&:hover': { 
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Download
          </Button>
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
}


const KlippersShortList = ({shorts}: {shorts: KlipperShortModel[]}) => {
  const [openPublishModal, setOpenPublishModal] = useState(false);
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
  return (
    <>
    {shorts && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shorts.map((short, index) => (
              <KlippersShort
                key={short.id}
                short={short}
                onPublish={handlePublish}
                onEdit={handleEdit}
                onDownload={handleDownload}
              />
            ))}
          </Box>
        )}
    </>
  );
};


const KlippersBreadcumps = () => {
  
  return (
    <>
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
            breadcums_string
          </Typography>
        </Breadcrumbs>
    </>
  );
};

const KlippersGenerateNewShortModal = () => {
    const [openGenerateModal, setOpenGenerateModal] = useState(false);
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
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
    </>
  );
};

const KlippersShorts = () => {
  const location = useLocation();
  const [videoId, setVideoId] = useState("fe80098a-f9b8-4a4a-8177-e657799bb59b");
 
  const [shorts, setShorts] = useState<KlipperShortModel[]>([]);

  let sampleShorts: KlipperShortModel[] = [
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

  useEffect(() => {
    const fetchShorts = async () => {
      const response = await fetch(`${AppConfig.baseApiUrl}/api/v1/shorts/shorts/${videoId}`);
      const videoFileNames = await response.json();

      const path = `${AppConfig.baseApiUrl}/api/v1/shorts/serve/${videoFileNames[0]}`
      let list: KlipperShortModel[] = []
      videoFileNames.map(async (fileName: string, index: number) => {
        const videoPath = `${AppConfig.baseApiUrl}/api/v1/shorts/shorts/serve/${videoId}/${fileName}`;
        list.push({
          id: index,
          title:  sampleShorts[index].title,
          viralityScore: sampleShorts[index].viralityScore,
          transcript: sampleShorts[index].transcript,
          viralityDescription: sampleShorts[index].viralityDescription, 
          previewUrl: videoPath
        })
      })
      setShorts(list);
    };
    fetchShorts();
  }, [videoId]);

  
  const handleEdit = () => {
    // Handle edit functionality
    console.log('Edit clicked');
  };

  const handleDownload = () => {
    // Handle download functionality
    console.log('Download clicked');
  };

  // Get page title and breadcrumb based on current page
  const getPageInfo = () => {

      return {
        title: 'Your shorts (12)',
        breadcrumb: 'Your shorts',
        description: 'Generated from patrick-part1.mp4 (38:00)'
      };

  };

  const pageInfo = getPageInfo();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white'
    }}>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        
        <KlippersBreadcumps/>
        <VideoClipSegmentsFlow />
        <KlippersGenerateNewShortModal/>

        {/* Content Grid */}
        <KlippersShortList shorts={shorts}/>

      </Container>

      {/* Publish Modal */}
      <PublishShortModal />

      {/* Generate New Modal */}
      <GenerateNewShortModal />
    </Box>
  )
}


// export default KlippersShortsHalil; 
export default KlippersShorts; 