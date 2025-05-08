import { api } from './api';
import { errorMessages, successMessages } from '@/src/lib/constants/messages';

import toast from 'react-hot-toast';
// Subscriptions
export const createSubscriptionAction = async (data) => {
    try {
        console.log("createSubscriptionAction", data)
        const response = await api.post('/super-admin/create-subscription', data);
        console.log("rrr", response)
        if (response.status === 200) {
            toast.success("Subscription created successfully")
        }
        return response
    } catch (error) {
        toast.error("Something went wrong")
        console.log("Error while creating subscription", error)
    }
}
export const updateSubscriptionAction = async (data) => {
    try {
        console.log("createSubscriptionAction", data)
        const response = await api.patch(`/super-admin/update-subscription/${data.subscriptionId}`, data);
        console.log("updateSubscriptionAction", response)
        if (response.status === 200) {
            toast.success("Subscription created successfully")
        }
        return response
    } catch (error) {
        toast.error("Something went wrong")
        console.log("Error while creating subscription", error)
    }
}
export const getSubscriptionsAction = async (type: string) => {
    try {
        const response = await api.get('/super-admin/subscriptions', {
            params: {
                type
            }
        });
        console.log("subscriptions", response)
        if (response.status === 200) {
            return response?.data
        }
    } catch (error) {
        toast.error("Something went wrong")
        console.log("Error while creating Subscriptions", error)
    }
}
export const deleteSubscriptionAction = async (subscriptionId: string, isDeleted) => {
    try {
        const response = await api.delete(`/super-admin/delete-subscription/${subscriptionId}`, { data: isDeleted });
        if (response.status === 200) {
            toast.success("Subscription deleted successfully")
        }
        return response
    } catch (error) {
        console.log("error", error)
        toast.error("Something went wrong")
    }
}

// Coupons

export const createCouponAction = async (data) => {
    try {
        console.log("createCouponAction", data)
        const response = await api.post('/super-admin/create-coupon', data);
        console.log("rrr", response)
        if (response.status === 200) {
            toast.success("Coupon created successfully")
        }
        return response
    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log("Error while creating coupon", error)
    }
}
export const updateCouponAction = async (data) => {
    try {
        console.log("createCouponAction", data)
        const response = await api.patch(`/super-admin/update-coupon/${data.couponId}`, data);
        console.log("updateCouponAction", response)
        if (response.status === 200) {
            toast.success("Coupon created successfully")
        }
        return response
    } catch (error) {
        toast.error("Something went wrong")
        console.log("Error while creating coupon", error)
    }
}
export const getCouponsAction = async (type: string) => {
    try {
        const response = await api.get('/super-admin/coupons', {
            params: {
                type
            }
        });
        console.log("coupons", response)
        if (response.status === 200) {
            return response?.data
        }
    } catch (error) {
        toast.error("Something went wrong")
        console.log("Error while creating Coupons", error)
    }
}
export const deleteCouponAction = async (couponId: string, isDeleted) => {
    try {
        const response = await api.delete(`/super-admin/delete-coupon/${couponId}`, { data: isDeleted });
        if (response.status === 200) {
            toast.success("Coupon deleted successfully")
        }
        return response
    } catch (error) {
        console.log("error", error)
        toast.error("Something went wrong")
    }
}
export const bankDetailsAction = async () => {
    try {
        const response = await api.get('/super-admin/bank-details');
        console.log("coupons", response)
        if (response.status === 200) {
            return response?.data
        }
    } catch (error) {
        console.log("error", error)
        toast.error("Something went wrong")
    }
}
export const updateBankDetailsAction = async (data) => {
    try {
        const response = await api.patch('/super-admin/bank-details', data);
        console.log("coupons", response)
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        console.log("error", error)
        toast.error("Something went wrong")
    }
}



export const fetchSocietiesAction = async () => {
    try {
      const response = await api.get('/super-admin/societies'); // Call your societies endpoint
  
      // Log the received societies data
      console.log('Received Societies Data:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('Error fetching societies:', error);
      throw error;
    }
  };



