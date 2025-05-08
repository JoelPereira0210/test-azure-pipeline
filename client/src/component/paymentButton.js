import { useEffect } from 'react';

import axios from 'axios';

import { Typography, Button, Input } from '@mui/material';
import { api } from '../actions/api';
import ButtonInput from './UI/Button/Button';
import toast from 'react-hot-toast';



const PaymentButton = ({ data, societyId, user, text }) => {
    console.log("PaymentButton", data)
    console.log("PaymentButton societyId", societyId)
    console.log("PaymentButton user", user)
    useEffect(() => {

        const loadRazorpayScript = () => {

            const script = document.createElement('script');

            script.src = 'https://checkout.razorpay.com/v1/checkout.js';

            script.onload = () => {

                console.log('Razorpay script loaded');

            };

            document.body.appendChild(script);

        };



        loadRazorpayScript();

    }, []);
    const handlePayment = async () => {
        try {
            // Create an order on the server
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-order`, {
                amount: data?.price, // Amount in paise
                currency: 'INR',
            });
            const createdOrder = await response?.data;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: createdOrder.amount,
                currency: createdOrder.currency,
                name: data?.planName,
                description: data?.planDescription,
                order_id: createdOrder?.id,
                handler: async (response) => {
                    try {
                        // Verify payment on the server
                        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify-payment`, {
                            paymentId: response?.razorpay_payment_id,
                            orderId: response?.razorpay_order_id,
                            signature: response?.razorpay_signature,
                            userId: user?.userId,
                            duration: data?.duration,
                            maxUsers: data?.maxUsers,
                            // eventId: '123',
                            subscriptionId: data?.subscriptionId,
                            amount: data?.price,
                            societyId: societyId
                        });
                        toast.success("Payment was done successfully")
                        window.location.href = "/signup?signin"
                    } catch (error) {
                        console.error('Payment Verification Error:', error);
                        toast.error("Payment verification failed")
                    }
                },
                prefill: {
                    name: `${user?.firstName} ${user?.lastName}`,
                    // email: 'user@example.com',
                    // contact: user?.phoneNumber,
                    contact: '+918308106216'
                },
                theme: {
                    color: '#F37254',
                },
            };

            const paymentGateway = new window.Razorpay(options);

            paymentGateway.on('payment.failed', function (response) {
                console.error('Payment failed', response);
                toast.error("Payment was canceled or failed. Please try again.")

            });

            paymentGateway.open();

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error("Payment failed")

        }
    };

    return (

        <ButtonInput type="button"
            text={text}
            fontSize={16}
            styles={{ maxWidth: '250px', height: '48px' }}
            disabled={false} onClick={handlePayment}>Pay with Razorpay</ButtonInput>

    );

};



export default PaymentButton;

