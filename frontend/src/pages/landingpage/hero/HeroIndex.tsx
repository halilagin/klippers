import {
    Container,
  } from '@mui/material';

import { ShortExampleVideoList } from '@/pages/landingpage/hero/ShortExampleVideoList';
import HeroCenter from '@/pages/landingpage/hero/HeroCenter';



const Hero = () => {
  return (
    <>
    {/* Hero Section */}
    <Container maxWidth="lg" sx={{ py: 16 }}>
        <HeroCenter />
        <ShortExampleVideoList />
    </Container>
    </>
  );
};


export default Hero;

