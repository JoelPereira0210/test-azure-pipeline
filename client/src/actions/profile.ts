import { errorMessages } from '@/src/lib/constants/messages';
import toast from 'react-hot-toast';
import { api } from './api';


// Function to check if a user is a societySuperAdmin
export const checkSocietySuperAdmin = async (userId: string) => {
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
    const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
      toast.success('Super Admin successfully changed.');
      return response.data;
    } else if (response.status === 400) {
      toast.error('Bad request. Please check the provided data.');
    } else if (response.status === 404) {
      toast.error('Society or users not found. Please ensure the users and society exist.');
    } else if (response.status === 500) {
      toast.error('Internal Server Error. Please try again later.');
    } else {
      toast.error('Failed to change Super Admin. Please try again.');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error('You do not have permission to change the Super Admin.');
    } else if (error.message === 'No society ID found in localStorage') {
      toast.error('Unable to find your society. Please log in again.');
    } else if (error.message.includes('LoggedInUserId or newSuperAdminUserId is missing')) {
      toast.error('Required user information is missing. Please refresh the page and try again.');
    } else {
      console.error('Error changing societySuperAdmin:', error);
      toast.error('An unexpected error occurred while changing the Super Admin. Please try again.');
    }
    throw error; // Re-throw the error for further handling if necessary
  }
};





export const fetchBankDetails = async () => {
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
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






// export const updateBankDetails = async (data) => {
//   console.log("Updating bank details:", data);
//   try {
//     const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
//     console.log('societyId in profile action:', societyId);

//     if (!societyId) {
//       throw new Error('No society ID found in localStorage');
//     }

//     console.log('Society ID:', societyId);

//     // Fetch bank details with the societyId and pass data in the request body
//     const response = await api.put('/profile/update-bank-details', data, {
//       params: { societyId }, // Pass the hashedSocietyId as a query parameter
//     });

//     console.log('Bank details update response:', response);
//     toast.success("Bank details updated successfully");
//     return { data: response.data, success: true }; 
//   } catch (error) {
//     console.error("Error updating bank details:", error); // More detailed error logging
//     toast.error(
//       error?.response?.data?.message ?? "Failed to update bank details"
//     );
//     return { data: null, success: false };
//   }
// };

export const updateBankDetails = async (data) => {
  console.log("Updating bank details:", data);
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
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
      toast.success("Bank details updated successfully");
      return { data: response.data, success: true, action: 'update' };
    } else if (response.status === 201) {
      toast.success("Bank details created successfully");
      return { data: response.data, success: true, action: 'create' };
    } else {
      throw new Error("Unexpected response from the server");
    }
  } catch (error) {
    console.error("Error updating bank details:", error);

    // Handle specific error messages
    const errorMessage =
      error?.response?.data?.message || "Failed to update bank details";

    toast.error(errorMessage);
    return { data: null, success: false };
  }
};

export const updateSocietyDetailsAction = async (formData) => {
  console.log("Updating society details:", formData);
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
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
      toast.success("Society details updated successfully");
     
      return { data: response.data, success: true, action: 'update' };
    } else if (response.status === 201) {
      toast.success("Society details created successfully");
      return { data: response.data, success: true, action: 'create' };
    } else {
      throw new Error("Unexpected response from the server");
    }
  } catch (error) {
    console.error("Error updating bank details:", error);
 
    // Handle specific error messages
    const errorMessage =
      error?.response?.data?.message || "Failed to update bank details";
 
    toast.error(errorMessage);
    return { data: null, success: false };
  }
};



export const fetchMembershipAmount = async (data) => {
  console.log("Updating Membership:", data);
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
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
  } catch (error) {
    // Handle errors based on status code
    if (error.response?.status === 404) {
      toast.error("Failed to fetch Society ID");
    } else if (error.response?.status === 500) {
      toast.error("Failed to update membership data");
    } else {
      toast.error(error?.response?.data?.message ?? "An error occurred");
    }

    console.error("Error updating membership data:", error);
    return { data: null, success: false };
  }
};








export const updateMembershipAmount = async (data) => {
  console.log("Updating memrship details:", data);
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly
    console.log('societyId in profile action:', societyId);

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society ID:', societyId);

    // // Fetch bank details with the societyId and pass data in the request body
    const response = await api.put('/profile/update-membership-amount', data, {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

  } catch (error) {
    console.error("Error updating bank details:", error); // More detailed error logging
    toast.error(
      error?.response?.data?.message ?? "Failed to update bank details"
    );

  }
};








import { debounce } from 'lodash';

export const validateIfsc = async (ifscCode: string) => {
  console.log("Validating IFSC:", ifscCode);
  try {
    const response = await api.post('/profile/ifscbankdetails', { ifscCode });
    console.log("IFSC validation response:", response);

    if (response && response.data) {
      return response.data; // Return bankName and branchName if valid
    }

    throw new Error('No data found for IFSC code');
  } catch (error) {
    console.error("Error validating IFSC code:", error);

    // Handle 408 error (Invalid IFSC Code)
    if (error?.response?.status === 408) {
      toast.error("You entered an invalid IFSC code. Please check and try again.");
    }
    else {
      // toast.error(error?.response?.data?.message ?? "Failed to validate IFSC code");
    }

    throw error; // Re-throw to propagate the error
  }
};





// export const validateSwift = async (swiftCode: string) => {
//   console.log('Validating SWIFT Code:', swiftCode);
//   try {
//     // Send the SWIFT code to the server for validation
//     const response = await api.post('/profile/swiftbankdetails', { swiftCode });
//     console.log('SWIFT validation response:', response);

//     if (response && response.data) {
//       // Check if the SWIFT code is valid
//       if (response.data.message === 'SWIFT code is valid') {
//         // Success toast if valid
//         toast.success("Valid SWIFT code");
//       }
//       return response.data; // Return bankName and branchName if available
//     }

//     throw new Error('No data found for SWIFT code');
//   } catch (error) {
//     console.error('Error validating SWIFT code:', error);

//     // Handle 408 error (Invalid SWIFT Code)
//     if (error?.response?.status === 408) {
//       toast.error('You entered an invalid SWIFT code. Please check and try again.');
//     } else {
//       toast.error(error?.response?.data?.message ?? 'Failed to validate SWIFT code');
//     }

//     throw error; // Re-throw to propagate the error
//   }
// };
