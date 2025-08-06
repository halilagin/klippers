import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CssBaseline,
  GlobalStyles,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Link
} from '@mui/material';
import CustomCursor from '../components/CustomCursor';

import klippersLogo from '../assets/klippers-logo.png';
import { Movie, CheckCircle, InfoOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const KlippersPricing = () => {
  const [period, setPeriod] = React.useState('monthly');

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: string,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };
  
  const plans = [
    {
      name: 'Klippers',
      monthlyPrice: '$23',
      yearlyPrice: '$230',
      features: [
        'Upload 10 videos monthly',
        'Up to 45 minutes long videos',
        'Generate 100 clips monthly',
        'HD download',
      ],
      pro: false,
    },
    {
      name: 'Klippers Pro',
      monthlyPrice: '$63',
      yearlyPrice: '$630',
      features: [
        'Upload 30 videos monthly',
        'Up to 2 hours long videos',
        'Generate 300 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      pro: true,
    },
    {
      name: 'Klippers Pro+',
      monthlyPrice: '$151',
      yearlyPrice: '$1510',
      features: [
        'Upload 100 videos monthly',
        'Up to 3 hours long videos',
        'Generate 1000 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      pro: false,
    },
  ];

  return (
    <>
      <CustomCursor />
      <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white'
    }}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          fontFamily: "'Roboto Flex', sans-serif"
        }
      }} />

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
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <RouterLink to="/klippers" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} tabIndex={-1}>
                <img 
                  src={klippersLogo} 
                  alt="Klippers Logo" 
                  style={{ 
                    width: 80, 
                    height: 80,
                    objectFit: 'contain',
                    marginRight: '8px'
                  }} 
                />
                <Typography variant="h6" sx={{ 
                  fontWeight: '700', 
                  color: 'white',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}>
                  Klippers
                </Typography>
              </RouterLink>
            </Box>
            {/* Empty Box to balance the layout and align the logo correctly */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: 220 }} />
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography component="h1" variant="h2" sx={{ fontWeight: '800', mb: 2, color: 'white' }}>
          Plans
        </Typography>
        <Typography variant="h6" sx={{ color: '#808080', mb: 4 }}>
          No hidden fees. Cancel anytime.
        </Typography>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="text alignment"
                      sx={{ mb: 6, bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', p: 0.5, backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
        >
          <ToggleButton value="monthly" aria-label="left aligned" sx={{ borderRadius: '9999px', border: 'none', px: 3, textTransform: 'none', fontWeight: 600, color: period === 'monthly' ? 'white' : '#808080', bgcolor: period === 'monthly' ? '#c6f479' : 'transparent' }}>
            Monthly
          </ToggleButton>
          <ToggleButton value="yearly" aria-label="centered" sx={{ borderRadius: '9999px', border: 'none', px: 3, textTransform: 'none', fontWeight: 600, color: period === 'yearly' ? 'white' : '#808080', bgcolor: period === 'yearly' ? '#c6f479' : 'transparent' }}>
            Yearly <Chip label="Save $190" size="small" sx={{ ml: 1, bgcolor: '#D1FAE5', color: '#065F46' }} />
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {plans.map((plan) => (
            <Card 
              key={plan.name}
                                          sx={{ 
                p: 3, 
                borderRadius: 12, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 0 20px rgba(255, 255, 255, 0.1)',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                border: plan.pro ? '1px solid #c6f479' : '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)'
              }}
            >
              <CardContent sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: '700' }}>{plan.name}</Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: '800', color: 'white' }}>
                  {period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}<Typography variant="h6" component="span" sx={{ color: '#808080' }}>/{period === 'monthly' ? 'month' : 'year'}</Typography>
                </Typography>

                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    my: 3,
                    py: 1.5,
                    borderRadius: '9999px',
                                        bgcolor: '#fafafa',
                    color: 'black',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: 'none',
                    '&:hover': {
                      bgcolor: '#e5e5e5',
                    }
                  }}
                >
                  Get Started
                </Button>
                
                <Typography variant="caption" sx={{ color: '#808080', display: 'block', textAlign: 'center', mb: 3 }}>
                  Secured by Stripe
                </Typography>

                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} sx={{ p: 0, mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#c6f479' }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
                      <InfoOutlined sx={{ color: '#808080' }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Typography sx={{ mt: 6, color: '#808080' }}>
          Need more? <Link href="#" sx={{ fontWeight: 600, color: '#c6f479' }}>Let's talk!</Link>
        </Typography>
      </Container>
    </Box>
    </>
  );
};

export default KlippersPricing;
