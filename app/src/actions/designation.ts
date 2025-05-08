import axios from 'axios';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { showToast } from '../utils/toastService';

import { errorMessages,successMessages } from '../lib/constants/messages';
import { Add_designationTypes } from '../lib/types/addDesignationTypes';

export const adddesignationAction = async (data: Add_designationTypes) => {
  try {
    console.log('datainauth', data);
    const response = await api.post(`/designations/create-designation`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    console.log("resdd",response.status)
    console.log('desig res', response);

    showToast(successMessages.DESIGNATION_SUCCESS,'success');
    return response;
    
  } catch (err: any) {
    const status = err?.response?.status;
    // Check if the error message or status code matches the duplicate designation case
    if (status === 702) {
      showToast('Unauthorized user. You do not have permission to create a designation.','error');
    }
    else if (err?.response?.data?.message === errorMessages.DUPLICATE_DESIGNATION) {
      console.log(
        'Duplicate designation detected',
        err?.response?.data?.message
      );
    } 
  

    return err;
  }
};


export const updatedesignationAction = async (data: any) => {
  try {
    const response = await api.patch(
      `/designations/update-designation/${data.designationId}`, // Update the URL to include the designationId
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Designation update response:', response);
    showToast(successMessages.DESIGNATION_UPDATE_SUCCESS,'success'); // Assuming you have a success message constant for updates
    return response;
  } catch (err: any) {
    // Check if the error response has a status of 702
    if (err?.response?.status === 704) {
      showToast("You don't have permission to update this designation.",'error'); // Custom error message for 702 status
    } else if (err?.response?.status === 809) {
      showToast("Number of position cannot be less than the count of assigned users",'error'); // Custom error message for 702 status
    } 
    else {
      showToast(
        err?.response?.data?.message ?? errorMessages.UPDATE_DESIGNATION_FAILED,'error'
      ); // Generic error message
    }
    return err;
  }
};

export const updateAdminStatus = async (isAdmin:any, userId:any) => {
  try {
    const response = await api.put('/designations/updateAdminStatus', {
      isAdmin,
      userId,
    });
    return response.status;
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
};

export const updateDesignation = async (designationName:any, userId:any) => {
  try {
    const response = await api.put('/designations/updateDesignation', {
      designation: designationName,
      userId,
    });
    return response.status;
  } catch (error) {
    console.error('Error updating designation:', error);
    throw error;
  }
};

export const deletedesignationAction = async (designationId:any) => {
  try {
    const response = await api.delete(
      `/designations/delete-designation/${designationId}`,
      {
        method: 'DELETE',
      }
    );

    
    return response;
  } catch (error:any) {
    if (error.response && error.response.status === 403) {
      showToast("Unauthorized user. You do not have permission to delete a designation.",'error');
    } else {
      console.error('Error deleting designation:', error);
      showToast('An error occurred while deleting the designation','error');
    }
  }
};


export const fetchDesignationData = async () => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/designations/display-designation', {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching designation data:', error);
    throw error;
  }
};


export const fetchMembers = async (limit?:any,offset?:any) => {

  try {

    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/designations/display-members', {
      params: { societyId,limit,offset }, // Pass the hashedSocietyId as a query parameter
    });

  

    return response.data;
  } catch (error:any) {
    if  (error?.response?.status === 702) {
      showToast("You are not authorized to add members to designation.",'error'); // Custom error message for 702 status
    }else{
    console.error('Error fetching designation data:', error);
    }
    throw error;
  }
};

export const addMemebersDesignation = async (
  designation:any,
  count:any,
  selectedUserIds:any
) => {
  try {

    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Log the designation and count for debugging
    console.log(
      'Submitting designation:',
      designation,
      'with count:',
      count,
      selectedUserIds,
      societyId
    );

    // Example API endpoint
    const response = await api.post('/designations/addmemberdesignation', {
      designation,
      count,
      selectedUserIds,
      societyId
    });
    return response.data;

    
  } catch (error:any) {
    if  (error?.response?.status === 702) {
      showToast("You are not authorized to add members to designation.",'error'); // Custom error message for 702 status
    } 
    console.error('Error submitting designation data:', error);
    throw error;
  }
};

export const updateDesignationCountAPI = async (
  totalCheckedCount:any,
  selectedDesignation:any
) => {
  try {
    // Log the designation and count for debugging
    console.log('with count:', totalCheckedCount);

    // Example API endpoint
    const response = await api.post('/designations/updateDesignationCount', {
      totalCheckedCount,
      selectedDesignation,
    });
    if (response.status === 201) {
      showToast(response.data.message,'success');
    }
    return response.data;
  }
   catch (error:any) {
    console.error('Error submitting designation data:', error);

    // Check if the error response exists and has a message
    if (error.response && error.response.data && error.response.data.message) {
      showToast(error.response.data.message,'error'); // Display error message using toaster
    } else if  (error?.response?.status === 702) {
      showToast("You are not authorized to update a designation.",'error'); // Custom error message for 702 status
    } 
    else {
      showToast('An unexpected error occurred.','error'); // Fallback message
    }

    throw error; // Rethrow the error if you want to handle it further up
  }
};

export const fetchSelectedDesignationMembers = async (
  designation: string,
  sortOption: string | null = null,
  searchTerm: string = '',
  limit?:any,
  offset?:any,

) => {
  try {
    // Log the designation for debugging
    console.log(
      'Passed selected designation in action:',
      designation,
      sortOption
    );

    // Retrieve societyId from local storage
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve societyId

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);

    // Create params object
    const params: {
      designation: string;
      societyId: string; // Include societyId in params
      sortOption?: string | null;
      searchTerm?: string;
      limit?: string;
      offset?:any
    } = { designation, societyId }; // Pass societyId here

    // Include sortOption if it's provided
    if (sortOption) {
      params.sortOption = sortOption;
      console.log('Sort option being sent to server:', sortOption);
    }
    
    // Include searchTerm if it's provided
    if (searchTerm) {
      params.searchTerm = searchTerm; // Add searchTerm to params if present
      console.log('Search term being sent to server:', searchTerm);
    }

    // Example API endpoint
    const response = await api.get(
      '/designations/fetchSelectedDesignationMember',
      {
        params,
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    if (response.status === 203) {
      showToast('No members found','error');
      return response.data;
    }
  } catch (error) {
    // console.error('Error fetching designation data:', error);
    // throw error;
  }
};


export const fetchActiveMembers = async (limit?:any,offset?:any) => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/designations/display-active-members', {
      params: { societyId,limit,offset }, // Pass the hashedSocietyId as a query parameter
    });

    return response.data;
  } catch (error:any) {
    if  (error?.response?.status === 702) {
      showToast("You are not authorized user.",'error') 
    }else{

    
    console.error('Error fetching designation data:', error);
    }
    throw error;
  }
};