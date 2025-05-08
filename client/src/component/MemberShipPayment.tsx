import { useEffect, useState } from 'react';

import axios from 'axios';

import { Typography, Button, Input } from '@mui/material';
import { api } from '../actions/api';
import ButtonInput from './UI/Button/Button';
import toast from 'react-hot-toast';
import { useUser } from './context/UserContext';
import { useTheme } from '@mui/material';
import { setRoleAction } from '../actions/auth';
import { decryptValue } from '../utils/encryptiondecryption';


const MembershipPayment = ({
    // user: propsUser,
    total,
    membershipName,
    membershipId,

}: {
    total: number;
    membershipName: string;
    membershipId?: string;

    // user: any;


}) => {

    console.log("MembershipPayment Data:", {
        total,
        membershipName,
        membershipId,

        // user:propsUser,


    });

    const sessionPhoneNumber = JSON.parse(sessionStorage.getItem("phoneNumber"));
    const storedSocietyId = JSON.parse(sessionStorage.getItem("societyId"));
    const [usesocietyId, setUseSocietyId] = useState('')
  
    const storedUser = sessionStorage.getItem("userId")
        ? JSON.parse(sessionStorage.getItem("userId"))
        : null;

    // Fallback to User Context if session storage is empty
    const { user: contextUser } = useUser();
    const theme = useTheme();
    const mode = theme.palette.mode;
    
  useEffect(() => {
    const societyId = localStorage.getItem('societyId')
    setUseSocietyId(decryptValue(societyId))
  }, []);

    const societyId = storedSocietyId || usesocietyId;


    const user = storedUser || contextUser;



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

        console.log("sub payment societyId", societyId);
        console.log("membershipName", membershipName);
        // console.log("membershipId",membershipId);

        console.log("societyId", societyId);
        console.log("userr", storedUser);

        try {

            // if (!membershipName   || !societyId) {
            //     console.error("Missing required payment details.");
            //     toast.error("Required details are missing. Please try again.");
            //     return;
            // }

            // Create an order on the server
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-membership-order`, {
                amount: total, // Amount in paise
                currency: 'INR',
            });

            const createdOrder = await response?.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: createdOrder.amount,
                currency: createdOrder.currency,
                name: membershipName,
                description: `membership for ${membershipName}`,
                order_id: createdOrder?.id,

                handler: async (response) => {
                    try {
                        // Verify payment on the server
                        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify-payment-membership`, {
                            paymentId: response?.razorpay_payment_id,
                            orderId: response?.razorpay_order_id,
                            signature: response?.razorpay_signature,
                            userId: user.userId,
                            duration: '0',
                            maxUsers: '2',
                            // subscriptionId:"3",
                            eventId: '123',
                            membershipId: '345',
                            amount: total,
                            societyId: societyId,

                        });
                        toast.success("Payment was done successfully")
                        const roleSet = await setRoleAction();
                        // window.location.href = "/signup?signin"
                          window.location.href = "/members"
                    } catch (error) {
                        console.error('Payment Verification Error:', error);
                        toast.error("Payment verification failed")
                    }
                },
                prefill: {
                    name: `${user?.firstName} ${user?.lastName}`,
                    // email: 'user@example.com',
                    contact: user?.phoneNumber,
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

        <ButtonInput
            type="button"
            text={`Pay Rs. ${total}`}
            loading={false}
            styles={{
                width: '150px',
                backgroundColor: mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
                color: mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)',
                textTransform: 'none',
                border: 'none'
            }}
            disabled={false}
            onClick={handlePayment} />

    );

};



export default MembershipPayment;
