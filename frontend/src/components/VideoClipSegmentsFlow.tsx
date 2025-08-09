import { Box, Typography } from "@mui/material";    


const VideoClipSegmentsFlow = () => {
  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 8, width: '100%' }}>
          <Box sx={{ pl: 2, flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: '800', color: 'white', mb: 1 }}>
              title
            </Typography>
            <Typography variant="body1" sx={{ color: '#808080', mb: 4 }}>
              description
            </Typography>
            
            {/* Progress Bar - Only show on shorts page */}
            
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
        </Box>
    </>
  );
};

export default VideoClipSegmentsFlow;