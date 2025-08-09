import { Box } from "@mui/material";    
import ShortExampleVideoUrls from "./ShortExampleVideoUrls";

type ShortExampleVideoProps = {
  url: string;
}

export const ShortExampleVideo = ({ url }: ShortExampleVideoProps) => {
  return (
    <>
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
                src={url}
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
    </>
  );
};


export const ShortExampleVideoList = () => {
  return (
    <>
    <Box sx={{ 
          width: '100%', 
          mt: 24,
          animation: 'fadeInUp 1s ease-out 0.8s both'
        }}>
            
            {ShortExampleVideoUrls.map((url, idx) => (
                <ShortExampleVideo key={"short-example-video-"+idx} url={url} />
            ))}
    </Box>
    </>
  );
};

export default ShortExampleVideoList;