import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { showToast } from '../utils/toastService';

export const fetchMembersAction = async (roleId: string | null = null, sortOption: string | null = null, searchTerm: string = '',limit?:number,offset?:number) => {
    
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve societyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    // const params: { societyId: string; roleId?: string | null; sortOption?: string | null; searchTerm?: string; limit?:string; offset?:string; } = { societyId };
  
    const params: { 
      societyId: string;
      roleId?: string | null;
      sortOption?: string | null;
      searchTerm?: string;
      limit?: number;
      offset?: number;
    } = { societyId };

    // Include roleId if it's provided
    if (roleId) {
      params.roleId = roleId; // Add roleId to params if present
    }
    console.log("Sort option before adding to params:", sortOption);
    if (sortOption) {
      params.sortOption = sortOption; // Add sortOption to params if present
      console.log("Sort option term being sent to server:", sortOption);
    }
    if (searchTerm) {
      params.searchTerm = searchTerm; // Add searchTerm to params if present
      console.log("Search term being sent to server:", searchTerm);
    }

    console.log("sort", params.sortOption)

    
    if (limit !== undefined) {
      params.limit = limit;
      console.log("Limit being sent to server:", limit);
    }
    if (offset !== undefined) {
      params.offset = offset;
      console.log("Offset being sent to server:", offset);
    }

    console.log('Parameters sent to server:', params);

    // Fetch designation data with the societyId and optional roleId
    const response = await api.get('/user/display-members', { params });


    return response.data;
  } catch (error) {
    
    console.error('Error fetching designation data:', error);
    throw error;
  }
};



export const fetchDesignationFilterAction = async () => {
  try {
    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve hashedSocietyId directly

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }

    console.log('Society IDs in fetch designation:', societyId);

    // Fetch designation data with the societyId
    const response = await api.get('/user/display-filterDesignation', {
      params: { societyId }, // Pass the hashedSocietyId as a query parameter
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching designation data:', error);
    throw error;
  }
};

export const fetchFilterDesignation = async (designationId:any) => {
  console.log('Designation ID being sent to API:', designationId);

  try {
    const response = await api.get('/user/filteredDesignation', {
      params: {
        designationId,
      },
    });

    console.log('Response from API:', response);
    return response;
  } catch (error) {
    console.log("no")
    // console.error('Error fetching filtered designation:', error);
    throw error; // Optional: re-throw the error for further handling
  }
};

export const deleteUserAction = async (userId:any) => {
  const response = await api.delete(`/user/delete-user/${userId}`, {
    method: 'DELETE',
  });
  console.log('userId in action ', userId);
  return response;
};

export const updateUserProfileData = async (data: any) => {
  try {
    const response = await api.patch('/user/update-user', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    showToast( 'Failed to update user profile','error');
    throw error;
  }
};

export const societySuperAdminAccess = async (userId: any) => {
  console.log("uod in ",userId);
  
  //NOT USED ANYWHERE

  // try {
  //   const response = await api.get('/user/society-superAdmin-access', {
  //     params: { userId },
  //   });
  //   return response;
  // } catch (error) {
  //   Alert.alert('Error', 'Error checking admin access');
  //   throw error;
  // }
};

export const updateUserProfile = async (data: any) => {
  try {
    const response = await api.patch('/user', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    showToast( 'Failed to update profile','error');
    throw error;
  }
};
