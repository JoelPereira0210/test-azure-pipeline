// import { useEffect } from 'react';

// import axios from 'axios';

// import { Typography, Button, Input } from '@mui/material';
// import { api } from '../actions/api';
// import ButtonInput from './UI/Button/Button';
// import toast from 'react-hot-toast';



// const SubscriptionPayment = ({ data, societyId, user, text }) => {
//     console.log("SubscriptionPayment", data)
//     console.log("SubscriptionPayment societyId", societyId)
//     console.log("SubscriptionPayment user", user)
//     useEffect(() => {

//         const loadRazorpayScript = () => {

//             const script = document.createElement('script');

//             script.src = 'https://checkout.razorpay.com/v1/checkout.js';

//             script.onload = () => {

//                 console.log('Razorpay script loaded');

//             };

//             document.body.appendChild(script);

//         };



//         loadRazorpayScript();

//     }, []);
//     const handlePayment = async () => {
//         try {
//             // Create an order on the server
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-order`, {
//                 amount: data?.price, // Amount in paise
//                 currency: 'INR',
//             });
//             const createdOrder = await response?.data;
//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                 amount: createdOrder.amount,
//                 currency: createdOrder.currency,
//                 name: data?.planName,
//                 description: data?.planDescription,
//                 order_id: createdOrder?.id,
//                 handler: async (response) => {
//                     try {
//                         // Verify payment on the server
//                         await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify-payment`, {
//                             paymentId: response?.razorpay_payment_id,
//                             orderId: response?.razorpay_order_id,
//                             signature: response?.razorpay_signature,
//                             userId: user?.userId,
//                             duration: data?.duration,
//                             maxUsers: data?.maxUsers,
//                             // eventId: '123',
//                             subscriptionId: data?.subscriptionId,
//                             amount: data?.price,
//                             societyId: societyId
//                         });
//                         toast.success("Payment was done successfully")
//                         window.location.href = "/signup?signin"
//                     } catch (error) {
//                         console.error('Payment Verification Error:', error);
//                         toast.error("Payment verification failed")
//                     }
//                 },
//                 prefill: {
//                     name: `${user?.firstName} ${user?.lastName}`,
//                     // email: 'user@example.com',
//                     contact: user?.phoneNumber,
//                 },
//                 theme: {
//                     color: '#F37254',
//                 },
//             };

//             const paymentGateway = new window.Razorpay(options);

//             paymentGateway.on('payment.failed', function (response) {
//                 console.error('Payment failed', response);
//                 toast.error("Payment was canceled or failed. Please try again.")

//             });

//             paymentGateway.open();

//         } catch (error) {
//             console.error('Payment Error:', error);
//             toast.error("Payment failed")

//         }
//     };

//     return (

//         <ButtonInput
//             type="button"
//             text={text}
//             loading={false}
//             fontSize={16}
//             styles={{ maxWidth: '250px', height: '48px' }}
//             disabled={false}
//             onClick={handlePayment} />

//     );

// };



// export default SubscriptionPayment;

import { useEffect } from 'react';

import axios from 'axios';

import { Typography, Button, Input } from '@mui/material';
import { api } from '../actions/api';
import ButtonInput from './UI/Button/Button';
import toast from 'react-hot-toast';
import { useUser } from './context/UserContext';
import { useTheme } from '@mui/material';
import { setRoleAction } from '../actions/auth';


const SubscriptionPayment = ({ 
    user: propsUser, 
    total, 
    subscriptionName, 
    subscriptionId, 
    duration, 
    discountApplied,
    discountData,
    maxUsers  }: {
        total: number;
        subscriptionName: string;
        subscriptionId: string;
        duration: number;
        maxUsers: number;
        user: any;
        discountApplied: boolean;
        discountData:any

    }) => {

        console.log("SubscriptionPayment Data:", {
            total,
            subscriptionName,
            subscriptionId,
            duration,
            maxUsers,
            user:propsUser,
            discountApplied,
            discountData

        });

        const sessionPhoneNumber = sessionStorage.getItem("phoneNumber");
        const storedSocietyId  = JSON.parse(sessionStorage.getItem("socioId"));

        const storedUser = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null;
      
        // Fallback to User Context if session storage is empty
        const { user: contextUser } = useUser();
        const theme = useTheme();
        const mode = theme.palette.mode;
      
        const societyId = storedSocietyId || contextUser?.Society[0].societyId;
       
        const user = propsUser || storedUser || contextUser;
      

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


        console.log("sub payment societyId",societyId);
        console.log("subscriptionName",subscriptionName);
        console.log("subscriptionId",subscriptionId);
        console.log("duration",duration);
        console.log("maxUsers",maxUsers);
        console.log("societyId",societyId);
        console.log("user",user);

        try {

            if (!subscriptionName || !subscriptionId || !duration || !maxUsers || !user || !societyId) {
                console.error("Missing required payment details.");
                toast.error("Required details are missing. Please try again.");
                return;
            }
            
            // Create an order on the server
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/create-order`, {
                amount: total, // Amount in paise
                currency: 'INR',
            });

            const createdOrder = await response?.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: createdOrder.amount,
                currency: createdOrder.currency,
                name: subscriptionName,
                description: `Subscription for ${subscriptionName}`,
                order_id: createdOrder?.id,

                handler: async (response) => {
                    try {
                        // Verify payment on the server
                        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify-payment`, {
                            paymentId: response?.razorpay_payment_id,
                            orderId: response?.razorpay_order_id,
                            signature: response?.razorpay_signature,
                            userId: user?.userId,

                            duration: duration,
                            maxUsers: maxUsers,
                            // eventId: '123',
                            subscriptionId:  subscriptionId,
                            amount: total,
                            societyId: societyId,
                            discountApplied,
                            discountCode: discountData?.couponCode || null,
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
                backgroundColor:mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
                color: mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)',
                textTransform: 'none',
                border: 'none'
                }}
            disabled={false}
            onClick={handlePayment} />

    );

};



export default SubscriptionPayment;

