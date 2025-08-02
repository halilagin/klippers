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
  Divider,
  Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Icon for secure payment note

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(AppConfig.stripePublishableKey);

interface PaymentFormProps {
  planId: string | null;
  planDetails: any; // Consider defining a stricter type if possible
}

// Style options for Stripe CardElement to match MUI TextField look
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: '#666', // Match icon color
      color: '#333',
      fontWeight: '400',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: {
      iconColor: '#f44336', // MUI error color
      color: '#f44336',
    },
  },
};




const PaymentFormComponent: React.FC<PaymentFormProps> = ({ planId, planDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);



  const handleMeteredSubmit = async (event: React.FormEvent) => {
    // This seems to be registration only, no payment processing needed upfront
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
        // const { clientSecret } = await response.json();
        // const result = await stripe.confirmCardPayment(clientSecret, {
        //     payment_method: { card: cardElement, billing_details: { name, email } }
        // });

             const updateResponse = await fetch(AppConfig.baseApiUrl + '/api/v1/auth/update-subscription-id', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email: email }),
             });
             // Should we throw an error if update fails? Decide based on requirements.
             // if (!updateResponse.ok) throw new Error('User subscription update failed!');
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
             // Should we throw an error if update fails? Decide based on requirements.
             // if (!updateResponse.ok) throw new Error('User subscription update failed!');
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
    // This seems specific to PAY_AS_YOU_GO, logic is similar to monthly but without registration/update steps here
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
            body: JSON.stringify({ planId, email, name }), // Assume PAYG still needs intent
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
            setPaymentMessage('Payment successful!'); // Simpler message for PAYG?
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
      handleSubmit(event); // Use the specific PAYG handler
    } else {
      setPaymentMessage('Invalid plan selected.');
    }
  };

  if (paymentSuccess) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
        <Box sx={{ fontSize: '48px', color: 'success.main', mb: 2 }}>✓</Box>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Thank You!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {paymentMessage}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          You can now start using your plan.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      component="form" // Use Paper as form element
      onSubmit={handleSubmitWrapper} 
      elevation={0} 
      variant="outlined" 
      sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }} // Responsive padding
    >
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Complete Your {planDetails?.name} Subscription
      </Typography>
      
      {/* Order Summary */}
      <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 500, mb: 1 }}>
          Order Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body1">Plan:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{planDetails?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">Price:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {planDetails?.price} {planDetails?.priceDetail}
          </Typography>
        </Box>
      </Box>
      
      {/* Form Fields using Grid for layout */}
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
            />
          </Grid>
        )}

        <Grid item xs={12}> 
          <Typography variant="subtitle2" component="label" htmlFor="card-element" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            Credit or debit card
          </Typography>
          <Box 
            id="card-element-wrapper" 
            sx={{ 
              p: '10px 12px', 
              border: '1px solid', 
              borderColor: 'rgba(0, 0, 0, 0.23)', // Match TextField border
              borderRadius: '4px',
              '&:hover': { 
                borderColor: 'rgba(0, 0, 0, 0.87)'
              },
              // Add focused state mimic if needed via component state
            }}
          >
            <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
          </Box>
        </Grid>
      </Grid>
      
      {paymentMessage && (
        <Alert 
          severity={paymentSuccess ? 'success' : 'error'} 
          sx={{ mt: 2, mb: 1 }} 
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
          borderRadius: '20px', // Match SubscriptionPlan button radius
          bgcolor: '#455cff', // Set specific background color
          color: 'white', // Ensure text is white
          '&:hover': {
            bgcolor: '#3a4dc8' // Slightly darker shade for hover
          }
        }}
        startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
        <Typography variant="caption" color="text.secondary">
          Payments are secure and encrypted. By subscribing, you agree to our Terms of Service.
        </Typography>
      </Box>
    </Paper>
  );
};

// Export the component wrapped with Stripe Elements
export default function PaymentFormWrapper(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent {...props} />
    </Elements>
  );
} 