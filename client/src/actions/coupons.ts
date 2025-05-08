import { api } from './api';
import { errorMessages, successMessages } from '@/src/lib/constants/messages';

import toast from 'react-hot-toast';

export const validateCoupon = async (couponCode) => {
    try {
        const response = await api.get('/payments/validate-coupon', {
            params: {
                code: couponCode,
            },
        });
        console.log("validateCoupon Response:", response);

        if (response.status === 200) {
            toast.success("Coupon applied successfully");
            return response.data; // Assuming the API response contains discount information
        }
    } catch (error) {
        console.error("Error while validating coupon:", error);
        const errorMessage = error?.response?.data?.message || "Invalid Coupon Code";
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};