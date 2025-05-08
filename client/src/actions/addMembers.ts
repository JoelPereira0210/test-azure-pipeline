import { errorMessages, successMessages } from '@/src/lib/constants/messages';
import {
} from '@/src/lib/types/registerNumber.types';
import toast from 'react-hot-toast';
import { api } from './api';
import { AddMembersDataType } from '../lib/types/addMembers.types';

export const addMembersActions = async (data: AddMembersDataType[]) => {
    try {

      const encryptedSocietyId  = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

      if (!encryptedSocietyId ) {
          throw new Error('No society ID found in localStorage');
      }

      // console.log('Society ID:', encryptedSocietyId);

        // const response = await api.post("/auth/register-otp", data);

        const payload = {
          societyId: encryptedSocietyId, // Send the encrypted ID as it is
          newMembers: data, // Add the members data
        };

        const response = await api.post(`/user/invite-members`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('RRRR', response);
        if (response.status === 200) {
            console.log("SSSS", response)
            toast.success(successMessages.REQUEST_TO_JOIN);
        }
        return response;
    } catch (err: any) {
/*         toast.success("ssss");
 */        toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
        return err;
    }
};



export const fetchMemberData = async (contextUserId) => {
    console.log('UserContext ID being sent to API:', contextUserId);
    
    const encryptedSocietyId = localStorage.getItem('societyId');

    if (!encryptedSocietyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('fetchMemberData Encrypted Society ID', encryptedSocietyId);


    try {
      const response = await api.get('/addMember/fetchMemberData', {
        params: {
          contextUserId,
          societyId: encryptedSocietyId
        },
      });

      console.log('Response from API:', response);

      if (response.status === 200) {
        // toast.success('User data fetched successfully!'); // Success notification
        return response.data; // Return user data
      } else if (response.status === 203) {
        toast.error('User not found'); // Error notification for user not found
      }
    } catch (error) {
      if (error?.response?.status === 702) {
        toast.error("You are not authorised user."); // Custom error message for 702 status
      } else{
      console.log("Error occurred while fetching user data");
      console.error('Error fetching filtered designation:', error);
      toast.error('Failed to fetch user data'); // General error toast
      }
      throw error; 
    }
};



export const fetchEventDetails = async (contextUserId,limit?,offset?) => {
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
      return response.data; // Return event details
    } else if (response.status === 203) {
      console.log("No events")
      // toast.error('No events found'); // Show toaster notification for no events
    }
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error("You are not authorized to access event details."); // Custom error message for 702 status
    }else{
    console.log("Error occurred while fetching user data");
    console.error('Error fetching event details:', error);
    toast.error('Failed to fetch event data'); // General error toast
    }
    throw error; 
  }
};



export const fetchDesignation = async (contextUserId) => {
  console.log('UserContext ID being sent to API for designation:', contextUserId);

  const encryptedSocietyId = localStorage.getItem('societyId');

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
      toast.error('No designations found'); // Error notification for no designations
    }
  } catch (error) {
    
    console.log("Error occurred while fetching user data");
    console.error('Error fetching filtered designation:', error);
    toast.error('Failed to fetch user data'); // General error toast
    throw error; 
  }
};




export const updateMemberData = async (contextUserId, dataToUpdate) => {
  console.log('Updating member data:', { contextUserId, dataToUpdate });
  
  try {

     // Retrieve the encryptedSocietyId from localStorage
     const encryptedSocietyId = localStorage.getItem('societyId');

     if (!encryptedSocietyId) {
       throw new Error('No society ID found in localStorage');
     }
 
     console.log('Encrypted Society ID from localStorage:', encryptedSocietyId);
 
     // Add the encryptedSocietyId to the data to be sent
     const payload = {
       ...dataToUpdate,
       societyId: encryptedSocietyId, // Include the encrypted societyId
     };

      const response = await api.patch(
          `/addMember/update-member-data/${contextUserId}`, // Update the URL to include the userId
          payload,
          {
              headers: {
                  'Content-Type': 'application/json',
              },
          }
      );

      console.log('Response from update API:', response);

      if (response.status === 200) {
          toast.success("Data updated successfully"); // Or a different success message
          return response // Return updated member data if needed
      } else {
          toast.error('Failed to update member data'); // General error notification
      }
  } catch (err: any) {
      console.error("Error updating member data:", err);
      toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR); // Handle errors gracefully
      return err;
  }
};





export const fetchMaintenanceDetails = async (contextUserId,limit?,offset?) => {
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
      return response.data; // Return event details
    } else if (response.status === 203) {
      console.log("No maintenance")
      // toast.error('No maintenance found'); // Show toaster notification for no events
    }
  } catch (error) {
    console.log("Error occurred while fetching user data");
    console.error('Error fetching event details:', error);
    toast.error('Failed to fetch event data'); // General error toast
    throw error; 
  }
};
