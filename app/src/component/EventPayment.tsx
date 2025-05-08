import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { Button } from 'react-native-paper';
import { useTheme } from '../../theme/themeProvider';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { showToast } from '../utils/toastService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../actions/api';
import ButtonInput from './UI/Button/Button';
import { RAZORPAY_KEY_ID } from '@env';


export const registerFreeEventAction = async ({ eventId, userId, numberOfRegistrations }: any) => {
    try {
        const response = await api.post(`/payments/register-free-event`, {
            eventId,
            userId,
            amount: 0, // Free event registration
            numberOfRegistrations,
        });

        if (response.status === 200) {
            showToast( 'Successfully registered for the free event!' ,'success');
            return true;
        } else {
            showToast( 'Failed to register for the free event.' ,'error');
            return false;
        }
    } catch (error) {
        console.error('Error registering free event:', error);
        showToast('An error occurred during free event registration.' ,'error');
        return false;
    }
};

const EventPayment = ({ total, planName, planId, user, noOfRegistrations,planSection }: any) => {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);


    console.log("total, planName, planId, user, noOfRegistrations,planSection in EventPayment", total, planName, planId, user, noOfRegistrations,planSection)

    // Function to load Razorpay script
    useEffect(() => {
        console.log('Razorpay script initialized in React Native');
        setRazorpayLoaded(true);
    }, []);

    // Function to handle event payment
    const handlePay = async () => {
        try {
            // Step 1: Create Razorpay order from backend
            const response = await api.post(`/payments/create-event-order`, {
                amount: total,
                currency: 'INR',
            });

            const { id: orderId, amount, currency } = response.data;
            console.log("response.data", response.data)


            // Step 2: Configure Razorpay options
            const options = {
                key: RAZORPAY_KEY_ID,
                amount,
                currency,
                name: planName,
                description: planSection,
                order_id: orderId,
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    contact: `${user.phoneNumber}`,
                },
                theme: {
                    color: '#F37254',
                },
            };

         // Step 4: Open Razorpay Payment Gateway
         RazorpayCheckout.open(options)
         .then(async (response: any) => {
             console.log('Payment Success:', response);
             try{
                console.log("Verifying Payment on Server...");

                await api.post(`/payments/verify-event-payment`, {
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    eventId: planId,
                    userId: user.userId,
                    amount: amount / 100, // Convert back to rupees
                    numberOfRegistrations: noOfRegistrations,
                });

                console.log("came here in payment success")
                showToast( 'Payment successful!' ,'success');
                //@ts-ignore    
             navigation.navigate("AuthNavigator", { screen: "Events" });

             }
           
               
                
                   
                 catch (error) {
                    console.error('Payment verification failed:', error);
                    showToast('Payment verification failed.','error');
                }
            
         })
         .catch((error: any) => {
             console.error('Payment failed:', error);
             showToast('Payment was canceled or failed. Please try again.', 'error');
         });

        } catch (error) {
            console.error('Error initiating payment:', error);
            showToast('Failed to initiate payment.','error');
        }
    };

    return (
        <ButtonInput
        text={`Pay Rs. ${total}`}
          onPress={handlePay}
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

export default EventPayment;
