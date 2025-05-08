import React, { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ButtonInput from './UI/Button/Button';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material';
import { api } from '../actions/api';

const ChargesPayment = ({ total, chargeName, chargeId, chargeSection, user }) => {
  const router = useRouter();
  const theme = useTheme();
  const mode = theme.palette.mode;

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => console.log('Razorpay script loaded');
      script.onerror = () => toast.error('Failed to load payment gateway.');
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []); // Load script only once

  const handlePay = async () => {
    try {
      // Step 1: Create Razorpay order
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-event-order`, {
      const response = await api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-event-order`, {
        amount: total, // Convert to paise
        currency: 'INR',
      });

      const { id: orderId, amount, currency } = response.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: chargeName,
        description: chargeSection,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify-charge-payment`, {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              chargeId: chargeId,
              userId: user.userId,
              amount: amount / 100, // Convert back to rupees for backend
            });
            toast.success('Payment successful!');
            window.location.href = '/Charges'; // Redirect to charges page
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          contact: `${user.phoneNumber}`,
        },
        theme: {
          color: '#F37254',
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
      });

      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment.');
    }
  };

  return (
    <ButtonInput
      type="button"
      disabled={false}
      text={`Pay Rs. ${total}`}
      onClick={handlePay}
      styles={{
        width: '150px',
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
        color: mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)',
        textTransform: 'none',
        border: 'none'
      }}
    />
  );
};

export default ChargesPayment;
