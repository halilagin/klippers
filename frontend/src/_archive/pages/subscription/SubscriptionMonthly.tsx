import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './Subscription.css';
import SubscriptionPlan from './SubscriptionPlan';
import PaymentForm from './PaymentForm';
import { plans } from './PlanDescriptions';
import AppConfig from '@/AppConfig';

// Initialize Stripe with your public key
const stripePromise = loadStripe(AppConfig.stripePublishableKey);
const SubscriptionPayAsYouGo = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPlan('MONTHLY_PAYMENT');
  }, []);

  return (
    <div className="subscription-container">

        <Elements stripe={stripePromise}>
          <div className="payment-container">
            <PaymentForm
              planId={selectedPlan}
              planDetails={plans.find(p => p.id === selectedPlan)}
            />
          </div>
        </Elements>
      
    </div>
  );
};

export default SubscriptionPayAsYouGo; 