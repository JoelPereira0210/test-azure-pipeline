import AsyncStorage from '@react-native-async-storage/async-storage';
/* import { errorMessages, successMessages } from '@/src/lib/constants/messages';
 */
import { errorMessages,successMessages } from '../lib/constants/messages';


import { api } from './api';
import { AddMembersDataType } from '../lib/types/addMembers.types';
import axios, { AxiosError } from 'axios';
import { showToast } from '../utils/toastService';

export const addMembersActions = async (data: AddMembersDataType[]) => {
    try {
        const encryptedSocietyId = await AsyncStorage.getItem('societyId');

        if (!encryptedSocietyId) {
            throw new Error('No society ID found in AsyncStorage');
        }

        const payload = {
            societyId: encryptedSocietyId,
            newMembers: data,
        };

        const response = await api.post('/user/invite-members', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            console.log("Joining Link has been send to all the Members on the Mobile Number");
            showToast("Joining Link has been send to all the Members on the Mobile Number",'success');
        }
        return response;
    /* } catch (err) {
        toast.show({ type: 'error', text1: err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR });
        return err;
    } */
    } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
      
        showToast(axiosError.response?.data?.message ?? errorMessages.UNKNOWN_ERROR,'error');
      
        return err;
      }
};

export const fetchMemberData = async (contextUserId:any) => {
    try {
        const encryptedSocietyId = await AsyncStorage.getItem('societyId');
        if (!encryptedSocietyId) {
            throw new Error('No society ID found in AsyncStorage');
        }

        const response = await api.get('/addMember/fetchMemberData', {
            params: { contextUserId, societyId: encryptedSocietyId },
        });

        if (response.status === 200) {
            return response.data;
        } else if (response.status === 203) {       
            showToast('User not found','error');
        }
    } catch (error) {
        showToast('Failed to fetch user data','error');
        throw error;
    }
};

export const updateMemberData = async (contextUserId:any, dataToUpdate:any) => {
    try {
        const encryptedSocietyId = await AsyncStorage.getItem('societyId');
        if (!encryptedSocietyId) {
            throw new Error('No society ID found in AsyncStorage');
        }

        const payload = {
            ...dataToUpdate,
            societyId: encryptedSocietyId,
        };

        const response = await api.patch(`/addMember/update-member-data/${contextUserId}`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            showToast('Data updated successfully','success');

            return response;
        } else {
            showToast('Failed to update member data','error');
        }
    } 
        catch (err) {
            const axiosError = err as AxiosError<{ message: string }>; // Type assertion for AxiosError
          
            showToast(axiosError.response?.data?.message ?? errorMessages.UNKNOWN_ERROR,'error');
          
            return err;
          }
};

export const fetchDesignation = async (contextUserId:any) => {
    console.log('UserContext ID being sent to API for designation:', contextUserId);
  
    const encryptedSocietyId = await AsyncStorage.getItem('societyId');
  
    if (!encryptedSocietyId) {
      throw new Error('No society ID found in localStorage');
    }
  
    console.log('fetchDesignation Encrypted Society ID', encryptedSocietyId);
    
    try {
      const response = await api.get('/addMember/fetchDesignation', {
        params: {
          contextUserId,
          societyId: encryptedSocietyId
        },
      });
  
      // Log the response only if the status is 200 (success)
      if (response.status === 200) {
        console.log('Response from API (Success):', response.data);
        return response.data; // Return designation data
      } else if (response.status === 203) {
        // Show a toaster notification for "No designations found"
        showToast('No designations found','error'); // Error notification for no designations
      }
    } catch (error) {
      
      console.log("Error occurred while fetching user data");
      console.error('Error fetching filtered designation:', error);
      showToast('Failed to fetch user data','error'); // General error toast
      throw error; 
    }
  };


  export const fetchEventDetails = async (contextUserId:string,limit?:any,offset?:any) => {
    console.log('UserContext ID being sent to API in event details:', contextUserId);
    
    try {
      const response = await api.get('/addMember/fetchEventDetails', {
        params: {
          contextUserId,
          limit,
          offset
        },
      });
  
      // Check the response status
      if (response.status === 200) {
        console.log('Response from API:', response.data); // Log the response data
        return response; // Return event details
      } else if (response.status === 203) {
        console.log("No events")
        return response;
        // toast.error('No events found'); // Show toaster notification for no events
      }
    } catch (error:any) {
      if (error?.response?.status === 702) {
        showToast("You are not authorized to access event details.",'error'); // Custom error message for 702 status
      }else{
      console.log("Error occurred while fetching user data");
      console.error('Error fetching event details:', error);
      showToast('Failed to fetch event data','error'); // General error toast
      }
      throw error; 
    }
  };
  

  export const fetchMaintenanceDetails = async (contextUserId:string,limit?:any,offset?:any) => {
    console.log('UserContext ID being sent to API in maint details:', contextUserId);
    
    try {
      const response = await api.get('/addMember/fetchMaintenanceDetails', {
        params: {
          contextUserId,
          limit,
          offset
        },
      });
  
      // Check the response status
      if (response.status === 200) {
        console.log('Response from API:', response.data); // Log the response data
        return response; // Return event details
      } else if (response.status === 203) {
        console.log("No maintenance")
        // toast.error('No maintenance found'); // Show toaster notification for no events
      }
    } catch (error) {
      console.log("Error occurred while fetching user data");
      console.error('Error fetching event details:', error);
      showToast('Failed to fetch event data','error'); // General error toast
      throw error; 
    }
  };