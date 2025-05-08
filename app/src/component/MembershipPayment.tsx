// MembershipPayment.tsx
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import ButtonInput from './UI/Button/Button'; // Adjust the path as needed
import { useUser } from './context/UserContext';
import { useTheme } from '../../theme/themeProvider';
import { fetchLoggedInUserdata, setRoleAction } from '../actions/auth';
import { decryptValue } from '../utils/encryptiondecryption';
import { showToast } from '../utils/toastService';
import { RAZORPAY_KEY_ID,EXPO_PUBLIC_BASE_URL } from '@env';
interface MembershipPaymentProps {
  total: number;
  membershipName: string;
  membershipId?: string;
}

const MembershipPayment: React.FC<MembershipPaymentProps> = ({
  total,
  membershipName,
  membershipId,
}) => {
  // Load stored values from AsyncStorage
  const [storedSocietyId, setStoredSocietyId] = useState<string>('');
  const [useSocietyId, setUseSocietyId] = useState<string>('');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [user, setUser] = useState<any>(null);

    
  const { theme } = useTheme();
  const navigation = useNavigation();

useEffect(() => {
    // In a React Native app, you typically don't need to manually load a script
    // because react-native-razorpay is a native module. We'll just set the loaded state:
    setRazorpayLoaded(true);
  }, []);

      useEffect(()=>{
          const getUserDetails = async () =>{
              const resp  = await fetchLoggedInUserdata();
              console.log("getUserDetails",resp);
              setUser(resp);
          }
          getUserDetails();
      },[])
      
  // Load societyId from AsyncStorage and decrypt if needed
  useEffect(() => {
    const loadSocietyId = async () => {
      try {
        const societyIdStr = await AsyncStorage.getItem('societyId');
        if (societyIdStr) {
          setStoredSocietyId(societyIdStr);
          setUseSocietyId( await decryptValue(societyIdStr));
        }
      } catch (e) {
        console.error("Error loading societyId", e);
      }
    };
    loadSocietyId();
  }, []);

  // Load user from AsyncStorage if available
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const userStr = await AsyncStorage.getItem('userId');
//         if (userStr) {
//           setStoredUser(JSON.parse(userStr));
//         }
//       } catch (e) {
//         console.error("Error loading user", e);
//       }
//     };
//     loadUser();
//   }, []);

  // Use stored user or fallback to context user
  // Use society id from either source
  const societyId = useSocietyId;

  useEffect(() => {
    console.log("MembershipPayment Data:", {
      total,
      membershipName,
      membershipId,
      societyId,
      user,
    });
    console.log("Razorpay checkout will be used (no script loading needed in native)");
  }, [total, membershipName, membershipId, societyId, user]);

  const handlePayment = async () => {
    console.log("Processing payment for societyId:", societyId);
    try {
      // Create order on the server
      const response = await axios.post(
        `${EXPO_PUBLIC_BASE_URL}/payments/create-membership-order`,
        {
          amount: total, // Amount in paise
          currency: 'INR',
        }
      );
      const createdOrder = response.data;

      // Prepare Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID, // Ensure this is set in your native env
        amount: createdOrder.amount,
        currency: createdOrder.currency,
        name: membershipName,
        description: `membership for ${membershipName}`,
        order_id: createdOrder.id,
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          contact: user?.phoneNumber,
        },
        theme: {
          color: '#F37254',
        },
      };

      // Open Razorpay payment gateway
      RazorpayCheckout.open(options)
        .then(async (paymentResponse: any) => {
          console.log("Payment Success Response:", paymentResponse);
          try {
            // Verify payment on the server
            await axios.post(
              `${EXPO_PUBLIC_BASE_URL}/payments/verify-payment-membership`,
              {
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                userId: user.userId,
                duration: '0',
                maxUsers: '2',
                eventId: '123',
                membershipId: '345',
                amount: total,
                societyId: societyId,
              }
            );
        
            showToast('Payment was done successfully','success');
           
            const roleSet = await setRoleAction();
            //@ts-ignore
            navigation.navigate('AuthNavigator', { screen: 'Members' }); // Navigate to Members page
          } catch (error) {
            console.error('Payment Verification Error:', error);
                showToast('Payment verification failed','error');
          }
        })
        .catch((error: any) => {
          console.error('Payment failed', error);
         showToast('Payment was canceled or failed. Please try again.','error');
        });
    } catch (error) {
      console.error('Payment Error:', error);
      showToast('Payment failed','error');
    }
  };

//   console.log("user in membership payment",user.userId);
//   console.log("societyId in membership payment",societyId);
  return (
    <ButtonInput
      type="button"
      text={`Pay Rs. ${total}`}
      loading={false}
      styles={{
        marginTop: 20,
        width: '80%',
      }}
      disabled={!razorpayLoaded}
      onPress={handlePayment}
    />
  );
};

export default MembershipPayment;
