import { errorMessages } from '../lib/constants/messages';
import { showToast } from '../utils/toastService';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';  // For local storage in React Native

// Function to check if a user is a societySuperAdmin
export const checkSocietySuperAdmin = async (userId: string) => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

    if (!societyId) {
      return
    }

    console.log('Society ID:', societyId);
    console.log('Checking if user is a societySuperAdmin:', userId);

    // Make the API call to check if the user is a societySuperAdmin
    const response = await api.get('/profile/check-society-superadmin', {
      params: {
        societyId, // Pass the societyId as a query parameter
        userId,    // Pass the userId as a query parameter
      },
    });

    if (response.status === 200) {
      const { isSuperAdmin } = response.data;
      return isSuperAdmin; // Return the boolean result
    }
  } catch (error) {
    console.error('Error checking societySuperAdmin status:', error);
    throw error; // Re-throw the error for further handling
  }
};



// Function to change the societySuperAdmin
export const changeSocietySuperAdmin = async (loggedInUserId: string, newSuperAdminUserId: string) => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);
    console.log('Current SuperAdmin User ID:', loggedInUserId);
    console.log('New SuperAdmin User ID:', newSuperAdminUserId);

    // Make the API call to update the roles
    const response = await api.patch('/profile/change-society-superadmin', {
      societyId,               // Pass the societyId
      currentSuperAdminId: loggedInUserId,  // Current SuperAdmin's ID
      newSuperAdminId: newSuperAdminUserId, // New SuperAdmin's ID
    });

    if (response.status === 200) {
      showToast('Super Admin successfully changed.','success');
      return response.data;
    } else if (response.status === 400) {
      showToast('Bad request. Please check the provided data.','error');
    } else if (response.status === 404) {
      showToast('Society or users not found. Please ensure the users and society exist.','error');
    } else if (response.status === 500) {
      showToast('Internal Server Error. Please try again later.','error');
    } else {
      showToast('Failed to change Super Admin. Please try again.','error');
    }
  } catch (error:any) {
    if (error.response && error.response.status === 403) {
      showToast('You do not have permission to change the Super Admin.','error');
    } else if (error.message === 'No society ID found in localStorage') {
      showToast('Unable to find your society. Please log in again.','error');
    } else if (error.message.includes('LoggedInUserId or newSuperAdminUserId is missing')) {
      showToast('Required user information is missing. Please refresh the page and try again.', 'error');
    } else {
      console.error('Error changing societySuperAdmin:', error);
      showToast('An unexpected error occurred while changing the Super Admin. Please try again.','error');
    }
    throw error; // Re-throw the error for further handling if necessary
  }
};





export const fetchBankDetails = async () => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in profile action:', societyId);

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);

    // Fetch bank details with the societyId
    const response = await api.get('/profile/bank-details', {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

    // Log the fetched bank details
    console.log('Fetched Bank Details:', response.data);

    return response.data; // Return the data to be used in the useEffect
  } catch (error) {
    console.error('Error fetching bank details:', error);
    throw error; // Re-throw the error to be handled in useEffect
  }
};



export const updateBankDetails = async (data:any) => {
  console.log("Updating bank details:", data);
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in profile action:', societyId);

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    // Fetch bank details with the societyId and pass data in the request body
    const response = await api.put('/profile/update-bank-details', data, {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

    console.log('Bank details update response:', response);

    // Handle responses based on status codes
    if (response.status === 200) {
      showToast("Bank details updated successfully", 'success');
      return { data: response.data, success: true, action: 'update' };
    } else if (response.status === 201) {
      showToast("Bank details created successfully", 'success');
      return { data: response.data, success: true, action: 'create' };
    } else {
      throw new Error("Unexpected response from the server");
    }
  } catch (error:any) {
    console.error("Error updating bank details:", error);

    // Handle specific error messages
    const errorMessage =
      error?.response?.data?.message || "Failed to update bank details";

    showToast(errorMessage, 'error');
    return { data: null, success: false };
  }
};

export const updateSocietyDetailsAction = async (formData:any) => {
  console.log("Updating society details:", formData);
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in profile action:', societyId);
 
    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }
 
    // Fetch bank details with the societyId and pass data in the request body
    const response = await api.put('/profile/update-society-details', formData, {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });
 
    console.log('society details update response:', response);
 
    // Handle responses based on status codes
    if (response.status === 200) {
      showToast("Society details updated successfully", 'success');
     
      return { data: response.data, success: true, action: 'update' };
    } else if (response.status === 201) {
      showToast("Society details created successfully", 'success');
      return { data: response.data, success: true, action: 'create' };
    } else {
      throw new Error("Unexpected response from the server");
    }
  } catch (error:any) {
    console.error("Error updating bank details:", error);
 
    // Handle specific error messages
    const errorMessage =
      error?.response?.data?.message || "Failed to update bank details";
 
    showToast(errorMessage, 'error');
    return { data: null, success: false };
  }
};



export const fetchMembershipAmount = async (data: any) => {
  console.log("Updating Membership:", data);
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in membership action:', societyId);

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);

    const response = await api.get('/profile/fetch-membership-data', {
      params: { societyId, ...data }, // Ensure you're passing additional data if needed
    });


    // Check response status and handle accordingly
    if (response.status === 200) {
      const { chargeMembershipFees, membershipFeeAmount } = response.data.data;
      console.log("Membership fee amount:", membershipFeeAmount, chargeMembershipFees);


      // Return the data if needed
      return { data: response.data, success: true };
    }
  } catch (error:any) {
    // Handle errors based on status code
    if (error.response?.status === 404) {
      showToast("Failed to fetch Society ID", 'error');
    } else if (error.response?.status === 500) {
      showToast("Failed to update membership data", 'error');
    } else {
      showToast(error?.response?.data?.message ?? "An error occurred", 'error');
    }

    console.error("Error updating membership data:", error);
    return { data: null, success: false };
  }
};








export const updateMembershipAmount = async (data:any) => {
  console.log("Updating memrship details:", data);
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in profile action:', societyId);

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);

    // // Fetch bank details with the societyId and pass data in the request body
    const response = await api.put('/profile/update-membership-amount', data, {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

  } catch (error:any) {
    console.error("Error updating bank details:", error); // More detailed error logging
    showToast(
      error?.response?.data?.message ?? "Failed to update bank details",'error'
    );

  }
};


export const validateIfsc = async (ifscCode: string) => {
  console.log("Validating IFSC:", ifscCode);
  try {
    const response = await api.post('/profile/ifscbankdetails', { ifscCode });
    console.log("IFSC validation response:", response);

    if (response && response.data) {
      return response.data; // Return bankName and branchName if valid
    }

    throw new Error('No data found for IFSC code');
  } catch (error:any) {
    console.error("Error validating IFSC code:", error);

    // Handle 408 error (Invalid IFSC Code)
    if (error?.response?.status === 408) {
      showToast("You entered an invalid IFSC code. Please check and try again.", 'error');
    }
    else {
      // showToast(error?.response?.data?.message ?? "Failed to validate IFSC code");
    }

    throw error; // Re-throw to propagate the error
  }
};


