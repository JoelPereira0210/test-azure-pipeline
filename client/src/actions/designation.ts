import { Add_designationTypes } from '../lib/types/addDesignationTypes';
import toast from 'react-hot-toast';
import { api } from './api';
// import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

import { errorMessages, successMessages } from '@/src/lib/constants/messages';


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

    toast.success(successMessages.DESIGNATION_SUCCESS);
    return response;
    
  } catch (err: any) {
    const status = err?.response?.status;
    // Check if the error message or status code matches the duplicate designation case
    if (status === 702) {
      toast.error('Unauthorized user. You do not have permission to create a designation.');
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

//   return response;
// } catch (err: any) {
//   toast.error(err?.response?.data?.message ?? errorMessages.DUPLICATE_DESIGNATION);
//   return err;
// }
// };

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
    toast.success(successMessages.DESIGNATION_UPDATE_SUCCESS); // Assuming you have a success message constant for updates
    return response;
  } catch (err: any) {
    // Check if the error response has a status of 702
    if (err?.response?.status === 704) {
      toast.error("You don't have permission to update this designation."); // Custom error message for 702 status
    } else if (err?.response?.status === 809) {
      toast.error("Number of position cannot be less than the count of assigned users"); // Custom error message for 702 status
    } 
    else {
      toast.error(
        err?.response?.data?.message ?? errorMessages.UPDATE_DESIGNATION_FAILED
      ); // Generic error message
    }
    return err;
  }
};





export const deletedesignationAction = async (designationId) => {
  try {
    const response = await api.delete(
      `/designations/delete-designation/${designationId}`,
      {
        method: 'DELETE',
      }
    );

    
    return response;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error("Unauthorized user. You do not have permission to delete a designation.");
    } else {
      console.error('Error deleting designation:', error);
      toast.error('An error occurred while deleting the designation');
    }
  }
};






export const fetchDesignationData = async () => {
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

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

export const fetchMembers = async (limit?,offset?) => {



  try {

    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/designations/display-members', {
      params: { societyId,limit,offset }, // Pass the hashedSocietyId as a query parameter
    });

  

    return response.data;
  } catch (error) {
    if  (error?.response?.status === 702) {
      toast.error("You are not authorized to add members to designation."); // Custom error message for 702 status
    }else{
    console.error('Error fetching designation data:', error);
    }
    throw error;
  }
};

export const addMemebersDesignation = async (
  designation,
  count,
  selectedUserIds
) => {
  try {

    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

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

    
  } catch (error) {
    if  (error?.response?.status === 702) {
      toast.error("You are not authorized to add members to designation."); // Custom error message for 702 status
    } 
    console.error('Error submitting designation data:', error);
    throw error;
  }
};

export const updateDesignationCountAPI = async (
  totalCheckedCount,
  selectedDesignation
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
      toast.error(response.data.message);
    }
    return response.data;
  }
   catch (error) {
    console.error('Error submitting designation data:', error);

    // Check if the error response exists and has a message
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message); // Display error message using toaster
    } else if  (error?.response?.status === 702) {
      toast.error("You are not authorized to update a designation."); // Custom error message for 702 status
    } 
    else {
      toast.error('An unexpected error occurred.'); // Fallback message
    }

    throw error; // Rethrow the error if you want to handle it further up
  }
};

// export const fetchSelectedDesignationMembers = async (
//   designation: string,
//   sortOption: string | null = null,
//   searchTerm: string = ''
// ) => {
//   try {
//     // Log the designation for debugging
//     console.log(
//       'Passed selected designation in action:',
//       designation,
//       sortOption
//     );

//     // Create params object
//     const params: {
//       designation: string;
//       sortOption?: string | null;
//       searchTerm?: string;
//     } = { designation };

//     // Include sortOption if it's provided
//     if (sortOption) {
//       params.sortOption = sortOption;
//       console.log('Sort option being sent to server:', sortOption);
//     }
//     if (searchTerm) {
//       params.searchTerm = searchTerm; // Add searchTerm to params if present
//       console.log('Search term being sent to serverr:', searchTerm);
//     }

//     // Example API endpoint
//     const response = await api.get(
//       '/designations/fetchSelectedDesignationMember',
//       {
//         params,
//       }
//     );

//     if (response.status === 200) {
//       return response.data;
//     }
//     if (response.status === 203) {
//       toast.error('No members found');
//       return response.data;
//     }
//   } catch (error) {
//     console.error('Error fetching designation data:', error);
//     throw error;
//   }
// };
export const fetchSelectedDesignationMembers = async (
  designation: string,
  sortOption: string | null = null,
  searchTerm: string = '',
  limit?,
  offset?,

) => {
  try {
    // Log the designation for debugging
    console.log(
      'Passed selected designation in action:',
      designation,
      sortOption
    );

    // Retrieve societyId from local storage
    const societyId = localStorage.getItem('societyId'); // Retrieve societyId

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
      offset?
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
      toast.error('No members found');
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching designation data:', error);
    throw error;
  }
};

// export const updateDesignationDataOfMember = async (
//   designationData,
//   userId
// ) => {
//   try {
//     console.log('Updating designation data for member:', designationData);
//     console.log('User ID:', userId); // Log the user ID

//     // // Use GET method with query parameters
//     const response = await api.put(
//       '/designations/updateDesignationDataofmember',
//       {
//         params: {
//           designation: designationData.designationName, // Ensure it's correctly named
//           isAdmin: designationData.isAdmin, // Include any additional parameters if needed
//           userId, // Pass the userId as a query parameter
//         },
//       }
//     );

//     console.log('Received designation name:', designationData.designationName);

//     // Return the response status
//     // return response.status;
//   } catch (error) {
//     console.error('Error updating designation data:', error);
//     throw error; // Rethrow the error for handling in the calling function
//   }
// };


// export const updateDesignationDataOfMember = async (
//   designationData,
//   userId
// ) => {
//   try {
//     console.log('Updating designation data for member:', designationData);
//     console.log('User ID:', userId); // Log the user ID

//     // Use PUT method for updating data
//     const response = await api.put(
//       '/designations/updateDesignationDataofmember',
//       {
//         designation: designationData.designationName, // Ensure it's correctly named
//         isAdmin: designationData.isAdmin, // Include any additional parameters if needed
//         userId, // Pass the userId as part of the request body
//       }
//     );

//     console.log('Received designation name:', response);
//     if (response.status === 200) {
//       toast.success('User designation updated successfully!');
//     } else if (response.status === 203) {
//       toast.error('No remaining positions available for this designation.');
//     } 
//     else {
//       console.log(`Unhandled response status: ${response.status}`);
//     }

//     // Return the response status
//     return response.status;
//     // Return the response status
//     return response.status; // Return status for further handling
//   } catch (error) {
//     if  (error?.response?.status === 702) {
//       toast.error("You are not authorized to update a designation."); // Custom error message for 702 status
//     } 
//     console.error('Error updating designation data:', error);
//     throw error; // Rethrow the error for handling in the calling function
//   }
// };
export const updateDesignation = async (designationName, userId) => {
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
export const updateAdminStatus = async (isAdmin, userId) => {
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


export const fetchActiveMembers = async (limit?,offset?) => {
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/designations/display-active-members', {
      params: { societyId,limit,offset }, // Pass the hashedSocietyId as a query parameter
    });

    return response.data;
  } catch (error) {
    if  (error?.response?.status === 702) {
      toast.error("You are not authorized user.") 
    }else{

    
    console.error('Error fetching designation data:', error);
    }
    throw error;
  }
};