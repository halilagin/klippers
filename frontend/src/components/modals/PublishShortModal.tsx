import { Box, Modal } from "@mui/material";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { FavoriteBorder } from "@mui/icons-material";
import { EditOutlined } from "@mui/icons-material";
import { GetApp } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
    

const PublishShortModal = () => {
    const [openPublishModal, setOpenPublishModal] = useState(false);

  return (
   <>
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
            <Close sx={{ fontSize: 18 }} />
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
   </>
  );
};

export default PublishShortModal;