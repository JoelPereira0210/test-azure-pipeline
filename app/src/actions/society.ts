import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { api } from './api';
import { UserVerificationDataType } from '../lib/types/registerNumber.types';
import { decryptValue } from '../utils/encryptiondecryption';
import { showToast } from '../utils/toastService';

export const getSocietyAction = async () => {
  const EncryptedSocietyId = await AsyncStorage.getItem('societyId');
  const decryptedSocietyId = await decryptValue(EncryptedSocietyId);
  console.log("Society ID in getSocietyAction:", decryptedSocietyId);
  try {
    const response = await api.get(`/society/restricted-society/${decryptedSocietyId}`);
    // console.log('SocietyData', response);
    return response;
  } catch (err:any) {
    showToast(err?.response?.data?.message ?? 'An unknown error occurred.','error');
    return err;
  }
};

export const getInviteUserAction = async (params: any) => {
  try {
    const response = await api.get(`/user/invite-member-data/${params}`);
    console.log("getInviteUserAction", response);
    return response.data;
  } catch (error) {
    console.log("getInviteUserAction Error", error);
  }
};

export const verifySocietyUserAction = async (data: UserVerificationDataType) => {
  try {
    const response = await api.post(`/auth/user-register-otp`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    showToast('OTP Sent Successfully','success');
    return response;
  } catch (err:any) {
    console.log("ERR", err);
    showToast(err?.response?.data?.message ?? 'An unknown error occurred.','error');
    return err;
  }
};

export const acceptUserAction = async (data: any) => {
  try {


      // Make the API request
      const response = await api.post('/auth/user-accept', data, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      // Check the response status and display appropriate toast messages
      if (response?.status === 200) {
          if (response?.data) {
             await AsyncStorage.setItem("user", JSON.stringify(response?.data?.data))
          }
          console.log("amoun", response.data.membershipFeeAmount
          )
          showToast(
              response?.data.message ||
              "User Registration is Completed. Please Pay Membership Fees to unlock all the features of the App.",
              "success"
          );
      } else if (response?.status === 209) {
          if (response?.data) {
            await AsyncStorage.setItem("user", JSON.stringify(response?.data?.data))
          }
          showToast(
              response?.data.message ||
              "User Registration is Completed.",
              "success"
          );
      }

      console.log("Response:", response);
      return response;
  } catch (error:any) {
      // Handle and log errors
      console.error("Error:", error);
      showToast(
          error?.response?.data?.error ||
          "An unknown error occurred. Please try again later.",
          "error"
      );
  }
};

export const checkMembership = async () => {
  const storedSocietyId = await AsyncStorage.getItem('societyId');
  if (!storedSocietyId) {
    showToast("Society ID is not available in storage.",'error');
    return;
  }

  try {
    const response = await api.get('/auth/checkMembership', {
      params: { societyId: storedSocietyId },
    });

     // Handle different response statuses
     if (response.status === 200) {
      console.log("Membership Fee Amount:", response.data.membershipFeeAmount);
      showToast(response.data.message ?? "Membership fee is applicable.",'success');
  } else if (response.status === 209) {
      console.log("No membership fee required no amount found.");
      // toast.info(response.data.message ?? "No membership fee is applicable.");
  }

  } catch (error:any) {
    showToast(error?.response?.data?.message ?? "An unknown error occurred.",'error');
  }
};

export const getSocietyDataAction = async (societyId: any) => {
  try {
    const response = await api.get(`/society`, { params: { societyId } });
    return response;
  } catch (error) {
    console.log("Error fetching society data", error);
  }
};

export const societySubscriptionAction = async (societyId: any) => {
  try {
    const response = await api.get(`society/${societyId}/subscription-details`);
    return response?.data;
  } catch (error) {
    console.log("Error fetching subscription details", error);
  }
};
