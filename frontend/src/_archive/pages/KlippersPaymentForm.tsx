import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AppConfig from '@/AppConfig';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Container,
  Breadcrumbs,
  Chip
} from '@mui/material';
import { NavigateNext, LockOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import KlippersNavbar from '../components/KlippersNavbar';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(AppConfig.stripePublishableKey);

interface KlippersPaymentFormProps {
  planId: string | null;
  planDetails: any;
}

// Style options for Stripe CardElement to match Klippers theme
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: '#808080',
      color: 'white',
      fontWeight: '400',
      fontFamily: '"Roboto Flex", sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#666' },
      backgroundColor: 'transparent',
    },
    invalid: {
      iconColor: '#f44336',
      color: '#f44336',
    },
  },
};

const KlippersPaymentFormComponent: React.FC<KlippersPaymentFormProps> = ({ planId: propPlanId, planDetails: propPlanDetails }) => {
  // Get plan details from route state if not provided as props
  const [planId, setPlanId] = useState(propPlanId);
  const [planDetails, setPlanDetails] = useState(propPlanDetails);

  // Get plan details from route state on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = window.history.state?.usr;
    
    if (state?.planId && state?.planDetails) {
      setPlanId(state.planId);
      setPlanDetails(state.planDetails);
    }
  }, []);
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleMeteredSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setPaymentMessage('');
    try {
        const registerResponse = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password, subscription_plan: planId }),
        });
        if (!registerResponse.ok) throw new Error('User Registration failed!');
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');
        const response = await fetch(AppConfig.baseApiUrl + '/api/v1/subscription/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, email, name }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const updateResponse = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/update-subscription-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        });
        setPaymentSuccess(true);
        setPaymentMessage('Payment successful! Your subscription is now active.');
    } catch (error: any) {
      console.error('Registration error:', error);
      setPaymentMessage(error.message || 'Registration failed. Please try again.');
      setPaymentSuccess(false);
    }
    setIsProcessing(false);
  };

  const handleMonthlySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setPaymentMessage('');
    try {
        const registerResponse = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password, subscription_plan: planId }),
        });
        if (!registerResponse.ok) throw new Error('User Registration failed!');
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');
        const response = await fetch(AppConfig.baseApiUrl + '/api/v1/subscription/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, email, name }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const { clientSecret } = await response.json();
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement, billing_details: { name, email } }
        });
        if (result.error) {
            setPaymentMessage(result.error.message || 'Payment failed.');
            setPaymentSuccess(false);
        } else if (result.paymentIntent?.status === 'succeeded') {
             const updateResponse = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/update-subscription-id', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email: email }),
             });
            setPaymentSuccess(true);
            setPaymentMessage('Payment successful! Your subscription is now active.');
        } else {
            setPaymentMessage(`Payment status: ${result.paymentIntent?.status}`);
            setPaymentSuccess(false);
        }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentMessage(error.message || 'Payment failed. Please try again.');
      setPaymentSuccess(false);
    }
    setIsProcessing(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setPaymentMessage('');
    try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');
        const response = await fetch(AppConfig.baseApiUrl + '/api/v1/subscription/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, email, name }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const { clientSecret } = await response.json();
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement, billing_details: { name, email } }
        });
        if (result.error) {
            setPaymentMessage(result.error.message || 'Payment failed.');
            setPaymentSuccess(false);
        } else if (result.paymentIntent?.status === 'succeeded') {
            setPaymentSuccess(true);
            setPaymentMessage('Payment successful!');
        } else {
            setPaymentMessage(`Payment status: ${result.paymentIntent?.status}`);
            setPaymentSuccess(false);
        }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentMessage(error.message || 'Payment failed. Please try again.');
      setPaymentSuccess(false);
    }
    setIsProcessing(false);
  };

  const handleSubmitWrapper = (event: React.FormEvent) => {
    event.preventDefault();
    if (planId === 'MONTHLY_PAYMENT') {
      handleMonthlySubmit(event);
    } else if (planId === 'VOLUME_BASED_PAYMENT') {
      handleMeteredSubmit(event); 
    } else if (planId === 'PAY_AS_YOU_GO') {
      handleSubmit(event);
    } else {
      setPaymentMessage('Invalid plan selected.');
    }
  };

  if (paymentSuccess) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white'
      }}>
        <KlippersNavbar />
        <Container maxWidth="sm" sx={{ py: 3, flex: 1, maxWidth: '700px' }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" sx={{ color: '#808080' }} />} 
            sx={{ mb: 3, pl: 2 }}
          >
            <Typography 
              component={RouterLink} 
              to="/klippers-pricing"
              sx={{ 
                color: '#808080', 
                textDecoration: 'none',
                '&:hover': { color: '#c6f479' }
              }}
            >
              Pricing
            </Typography>
            <Typography sx={{ color: '#808080' }}>
              Payment
            </Typography>
          </Breadcrumbs>

          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ fontSize: '48px', color: '#c6f479', mb: 2 }}>✓</Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800, color: 'white' }}>
              Thank You!
            </Typography>
            <Typography variant="body1" sx={{ color: '#808080', mb: 2 }}>
              {paymentMessage}
            </Typography>
            <Typography variant="body1" sx={{ color: '#808080' }}>
              You can now start using your plan.
            </Typography>
            <Button
              component={RouterLink}
              to="/klippers-dashboard"
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#c6f479',
                color: 'black',
                fontWeight: '600',
                textTransform: 'none',
                px: 4,
                py: 1.2,
                borderRadius: 3,
                '&:hover': {
                  bgcolor: '#b8e66a'
                }
              }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white'
    }}>
      <KlippersNavbar />
      <Container maxWidth="sm" sx={{ py: 3, flex: 1, maxWidth: '700px' }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" sx={{ color: '#808080' }} />} 
          sx={{ mb: 3, pl: 2 }}
        >
          <Typography 
            component={RouterLink} 
            to="/klippers"
            sx={{ 
              color: '#808080', 
              textDecoration: 'none',
              '&:hover': { color: '#c6f479' }
            }}
          >
            Home
          </Typography>
          <Typography 
            component={RouterLink} 
            to="/klippers-pricing"
            sx={{ 
              color: '#808080', 
              textDecoration: 'none',
              '&:hover': { color: '#c6f479' }
            }}
          >
            Pricing
          </Typography>
          <Typography sx={{ color: '#808080' }}>
            Payment
          </Typography>
        </Breadcrumbs>

        <Paper 
          component="form"
          onSubmit={handleSubmitWrapper} 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 800, textAlign: 'center', color: 'white' }}>
            Complete Your {planDetails?.name} Subscription
          </Typography>
          
          {/* Order Summary */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            border: '1px solid rgba(255, 255, 255, 0.15)', 
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)'
          }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#808080' }}>Plan:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>{planDetails?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#808080' }}>Price:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                {planDetails?.price} {planDetails?.priceDetail}
              </Typography>
            </Box>
            <Chip 
              label="Pro Plan" 
              sx={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.9rem',
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                '& .MuiChip-label': {
                  px: 1
                }
              }} 
            />
          </Box>
          
          {/* Form Fields */}
          <Grid container spacing={2}> 
            <Grid item xs={12}> 
              <TextField
                fullWidth
                required
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c6f479',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#808080',
                    '&.Mui-focused': {
                      color: '#c6f479',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}> 
              <TextField
                fullWidth
                required
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c6f479',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#808080',
                    '&.Mui-focused': {
                      color: '#c6f479',
                    },
                  },
                }}
              />
            </Grid>
            
            {planId !== 'PAY_AS_YOU_GO' && (
              <Grid item xs={12}> 
                <TextField
                  fullWidth
                  required
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#c6f479',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#808080',
                      '&.Mui-focused': {
                        color: '#c6f479',
                      },
                    },
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}> 
              <Typography variant="subtitle2" component="label" htmlFor="card-element" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'white' }}>
                Credit or debit card
              </Typography>
              <Box 
                id="card-element-wrapper" 
                sx={{ 
                  p: '12px 14px', 
                  border: '1px solid', 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                  '&:hover': { 
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                }}
              >
                <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
              </Box>
            </Grid>
          </Grid>
          
          {paymentMessage && (
            <Alert 
              severity={paymentSuccess ? 'success' : 'error'} 
              sx={{ mt: 3, mb: 2 }} 
            >
              {paymentMessage}
            </Alert>
          )}
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={!stripe || isProcessing} 
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.2, 
              borderRadius: 3,
              bgcolor: '#c6f479',
              color: 'black',
              fontWeight: '600',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                bgcolor: '#b8e66a'
              },
              '&:disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <LockOutlined fontSize="small" sx={{ color: '#808080', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#808080' }}>
              Payments are secure and encrypted. By subscribing, you agree to our Terms of Service.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Export the component wrapped with Stripe Elements
export default function KlippersPaymentFormWrapper(props: KlippersPaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <KlippersPaymentFormComponent {...props} />
    </Elements>
  );
} 