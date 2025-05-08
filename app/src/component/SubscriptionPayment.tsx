import React, { useEffect, useContext,useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { Button } from 'react-native-paper';
import { useUser } from './context/UserContext';
import { useTheme } from '../../theme/themeProvider';
import { PaymentContext } from './context/PaymentContext';
import { fetchLoggedInUserdata, setRoleAction } from '../actions/auth';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { showToast } from '../utils/toastService';
import ButtonInput from './UI/Button/Button';
import { RAZORPAY_KEY_ID,EXPO_PUBLIC_BASE_URL } from '@env';

const SubscriptionPayment = ({ 
    user: propsUser, 
    total, 
    subscriptionName, 
    subscriptionId, 
    duration, 
    discountApplied,
    discountData,
    maxUsers  
}: {
    total: number;
    subscriptionName: string;
    subscriptionId: string;
    duration: number;
    maxUsers: number;
    user: any;
    discountApplied: boolean;
    discountData: any;
}) => {

     const navigation = useNavigation();

         const [razorpayLoaded, setRazorpayLoaded] = useState(false);
   
        const [user, setUser] = useState<any>(null);

           // Function to load Razorpay script
            useEffect(() => {
                console.log('Razorpay script initialized in React Native');
                setRazorpayLoaded(true);
            }, []);
    
    console.log("SubscriptionPayment Data:", {
        total,
        subscriptionName,
        subscriptionId,
        duration,
        maxUsers,
        user: propsUser,
        discountApplied,
        discountData
    });

    useEffect(()=>{
        const getUserDetails = async () =>{
            const resp  = await fetchLoggedInUserdata();
            console.log("getUserDetails",resp);
            setUser(resp);
        }
        getUserDetails();
    },[])


    // Fetch user details from context
    // const { user: contextUser } = useUser();

  
    // useEffect(() => {
    //     console.log("User Context Updated:", contextUser);
    //     if (contextUser) setUser(contextUser);
    //   }, [contextUser]); // ✅ Run only when contextUser changes
      
    const theme = useTheme();
    
    // Determine the current user and societyId
    // const user = contextUser;
    const societyId = user?.Society?.[0]?.societyId;

    useEffect(() => {
        console.log("Razorpay script initialized (handled internally in React Native)");
    }, []);

    const handlePayment = async () => {
        console.log("Processing Payment...");
        console.log("User Details:", user);
        console.log("Subscription Details:", { subscriptionName, subscriptionId, duration, maxUsers });

        try {
            if (!subscriptionName || !subscriptionId || !duration || !maxUsers || !user || !societyId) {
                console.error("Missing required payment details.");
                showToast(
                   'Required details are missing','error'
                    
                );
                return;
            }

            // Create an order on the server
            const response = await axios.post(`${EXPO_PUBLIC_BASE_URL}/payments/create-order`, {
                amount: total, // Amount in paise (since Razorpay works in smallest currency unit)
                currency: 'INR',
            });

            const createdOrder = response?.data;

            const options = {

                key: RAZORPAY_KEY_ID,
                amount: createdOrder.amount,
                currency: createdOrder.currency,
                name: subscriptionName,
                description: `Subscription for ${subscriptionName}`,
                order_id: createdOrder?.id,

                prefill: {
                    name: `${user?.firstName} ${user?.lastName}`,
                    contact: user?.phoneNumber,
                },
                theme: {
                    color: 'orange',
                },
            };

            // Open Razorpay Payment Gateway
            RazorpayCheckout.open(options)
                .then(async (response:any) => {
                    console.log("Payment Success Response:", response);
                    
                    // Verify payment on the server
                    
                    try {
                        await axios.post(`${EXPO_PUBLIC_BASE_URL}/payments/verify-payment`, {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            userId: user?.userId,
                            duration: duration,
                            maxUsers: maxUsers,
                            subscriptionId: subscriptionId,
                            amount: total,
                            societyId: societyId,
                            discountApplied,
                            discountCode: discountData?.couponCode || null,
                        });

                        Toast.show({
                            type: 'success',
                            text1: 'Payment Successful!',
                        });

                        // await setRoleAction();
                        // navigation.navigate("Members");
                        //@ts-ignore
                        navigation.navigate("AuthNavigator", { screen: "Members" });
                    } catch (error) {
                        console.error('Payment Verification Error:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Payment verification failed',
                        });
                    }
                })
                .catch((error:any) => {
                    console.error('Payment failed', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Payment was canceled or failed.',
                        text2: 'Please try again.',
                    });
                });

        } catch (error) {
            console.error('Payment Error:', error);
            showToast(
                'Payment failed',
                'error'
            );
        }
    };

    return (
        
<ButtonInput
text={`Pay Rs. ${total}`}
  onPress={handlePayment}
  disabled={!razorpayLoaded}
  styles={styles.payButton}

/>
    );
};

const styles = StyleSheet.create({
  payButton: {
    marginTop: 20,
    width: '80%',
  },
 
});

export default SubscriptionPayment;
