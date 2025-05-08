import { api } from './api';  // Your custom API instance
import Toast from 'react-native-toast-message';  // For displaying toast notifications

export const validateCoupon = async (couponCode: string) => {
  try {
    // Making the API request to validate the coupon code
    const response = await api.get('/payments/validate-coupon', {
      params: {
        code: couponCode,
      },
    });

    console.log('validateCoupon Response:', response);

    // Check if the response status is 200 (successful)
    if (response.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Coupon applied successfully',
      });
      return response.data; // Assuming the API response contains discount information
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to apply coupon. Please try again.',
      });
    }
  } catch (error: any) {
    console.error('Error while validating coupon:', error);

    // Display a toast notification for error with a fallback message
    const errorMessage = error?.response?.data?.message || 'Invalid Coupon Code';
    Toast.show({
      type: 'error',
      text1: errorMessage,
    });

    // Throw an error if needed
    throw new Error(errorMessage);
  }
};