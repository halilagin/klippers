export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceDetail?: string;
  features: string[];
  recommended: boolean;
}

export const plans: Plan[] = [
  {
    id: 'PAY_AS_YOU_GO',
    name: 'Pay As You Go',
    description: 'Perfect for occasional use',
    price: '£5',
    priceDetail: 'per document',
    features: ['No subscription required', 'Pay only when you need it'],
    recommended: false
  },
  {
    id: 'MONTHLY_PAYMENT',
    name: 'Monthly Subscription',
    description: 'Pay for 500 document signing per month',
    price: '£20',
    features: ['Monthly payment', "Unlimited documents", 'All basic features included',"Capped to 500 documents per month", "One year subscription is must"],
    recommended: true
  },
  {
    id: 'VOLUME_BASED_PAYMENT',
    name: 'Volume Discount',
    description: 'Best for regular signers',
    price: 'From £1.5',
    priceDetail: 'per document',
    features: [
      '£4 for first 20 documents',
      '£3 for 21-50 documents',
      '£2.5 for 51-100 documents',
      '£2 for 101-500 documents',
      '£1.5 for 501+ documents'
    ],
    recommended: false
  }
]; 