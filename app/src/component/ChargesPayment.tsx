import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { api } from '../actions/api'; // Axios instance or similar
import { showToast } from '../utils/toastService'; // If you have a custom toast
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/themeProvider';
import ButtonInput from './UI/Button/Button';
import { RAZORPAY_KEY_ID } from '@env';

interface ChargesPaymentProps {
  total: number;
  chargeName: string;
  chargeId: string;
  chargeSection: string;
  user: any;
}

const ChargesPayment: React.FC<ChargesPaymentProps> = ({
  total,
  chargeName,
  chargeId,
  chargeSection,
  user,
}) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
      const navigation = useNavigation();

  useEffect(() => {
    // In a React Native app, you typically don't need to manually load a script
    // because react-native-razorpay is a native module. We'll just set the loaded state:
    setRazorpayLoaded(true);
  }, []);

  const handlePay = async () => {
    try {
      // 1) Create an order on your backend
      const response = await api.post('/payments/create-event-order', {
        amount: total, // in rupees
        currency: 'INR',
      });

      const { id: orderId, amount, currency } = response.data;

      // 2) Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID, // Replace with your Razorpay key
        amount: amount, // in paise, from your backend
        currency: currency,
        name: chargeName,
        description: chargeSection,
        order_id: orderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          contact: user.phoneNumber,
        },
        theme: {
          color: '#F37254',
        },
      };

      // 3) Open the Razorpay checkout
      RazorpayCheckout.open(options)
        .then(async (paymentResponse: any) => {
          // Payment success, verify on server
          try {
            await api.post('/payments/verify-charge-payment', {
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              signature: paymentResponse.razorpay_signature,
              chargeId: chargeId,
              userId: user.userId,
              amount: amount / 100, // Convert paise back to rupees
            });

            // showToast('Payment successful!', 'success');
            console.log('Payment successful, verified on backend.');
             showToast( 'Payment successful!' ,'success');

                  //@ts-ignore    
                  navigation.navigate("AuthNavigator", { screen: "Charges/Fees" });
          } catch (error) {
            console.error('Payment verification failed:', error);
            showToast('Payment verification failed.', 'error');
          }
        })
        .catch((error: any) => {
          console.error('Payment failed or canceled:', error);
          showToast('Payment failed. Please try again.', 'error');
        });
    } catch (error) {
      console.error('Error initiating payment:', error);
      showToast('Failed to initiate payment.', 'error');
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

export default ChargesPayment;

const styles = StyleSheet.create({
  payButton: {
    marginTop: 20,
    width: '80%',
  },
 
});
