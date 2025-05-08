import { api } from './api';
import { errorMessages,successMessages } from '../lib/constants/messages';
import { ToastAndroid, Alert, Platform } from 'react-native';

const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        Alert.alert(message);
    }
};

// Subscriptions
export const createSubscriptionAction = async (data: any) => {
    try {
        const response = await api.post('/super-admin/create-subscription', data);
        if (response.status === 200) {
            showToast("Subscription created successfully");
        }
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error while creating subscription", error);
    }
};

export const updateSubscriptionAction = async (data: { subscriptionId: any; }) => {
    try {
        const response = await api.patch(`/super-admin/update-subscription/${data.subscriptionId}`, data);
        if (response.status === 200) {
            showToast("Subscription updated successfully");
        }
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error while updating subscription", error);
    }
};

export const getSubscriptionsAction = async (type: any) => {
    try {
        const response = await api.get('/super-admin/subscriptions', { params: { type } });
        return response?.data;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error while fetching subscriptions", error);
    }
};

export const deleteSubscriptionAction = async (subscriptionId: any, isDeleted: any) => {
    try {
        const response = await api.delete(`/super-admin/delete-subscription/${subscriptionId}`, { data: isDeleted });
        if (response.status === 200) {
            showToast("Subscription deleted successfully");
        }
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error deleting subscription", error);
    }
};

// Coupons
export const createCouponAction = async (data: any) => {
    try {
        const response = await api.post('/super-admin/create-coupon', data);
        if (response.status === 200) {
            showToast("Coupon created successfully");
        }
        return response;
    } catch (error:any) {
        showToast(error?.response?.data?.message || "Something went wrong");
        console.error("Error while creating coupon", error);
    }
};

export const updateCouponAction = async (data: { couponId: any; }) => {
    try {
        const response = await api.patch(`/super-admin/update-coupon/${data.couponId}`, data);
        if (response.status === 200) {
            showToast("Coupon updated successfully");
        }
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error while updating coupon", error);
    }
};

export const getCouponsAction = async (type: any) => {
    try {
        const response = await api.get('/super-admin/coupons', { params: { type } });
        return response?.data;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error while fetching coupons", error);
    }
};

export const deleteCouponAction = async (couponId: any, isDeleted: any) => {
    try {
        const response = await api.delete(`/super-admin/delete-coupon/${couponId}`, { data: isDeleted });
        if (response.status === 200) {
            showToast("Coupon deleted successfully");
        }
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error deleting coupon", error);
    }
};

// Bank Details
export const bankDetailsAction = async () => {
    try {
        const response = await api.get('/super-admin/bank-details');
        return response?.data;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error fetching bank details", error);
    }
};

export const updateBankDetailsAction = async (data: any) => {
    try {
        const response = await api.patch('/super-admin/bank-details', data);
        return response;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error updating bank details", error);
    }
};

// Societies
export const fetchSocietiesAction = async () => {
    try {
        const response = await api.get('/super-admin/societies');
        return response?.data;
    } catch (error) {
        showToast("Something went wrong");
        console.error("Error fetching societies", error);
    }
};
