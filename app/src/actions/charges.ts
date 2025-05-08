
import { errorMessages, successMessages } from '../lib/constants/messages';
import { showToast } from '../utils/toastService';
import { api } from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { ChargeFeeFormType } from '../lib/types/chargeFee.types';


export const createChargeAction = async (data: ChargeFeeFormType) => {
  try {
    // console.log('API', api.getUri());
    // console.log('API URL:', process.env['EXPO_PUBLIC_BASE_URL']);
    console.log("data in createChargeAction",data);

    const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

    if (!societyId) {
      throw new Error('No society ID found in localStorage');
    }
  
    console.log('Society ID:', societyId);

    const requestBody = {
      ...data,
      encryptedSocietyId:societyId, 
    };

    const response = await api.post('/charges/create-charge', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    showToast('Charge/Fee created succesfully','success');
    return response;
  } catch (error:any) {
     // Check for 702 status code to show custom authorization error
     if (error?.response?.status === 702) {
      showToast("You are not authorized to perform this action.",'error');
  } else { 
    showToast(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR,'error');
  }
  
  }
};

//fetch the charges according to the upcoming,past,draft,deleted
export const fetchChargeData = async (status: string,limit?:any,offset?:any) => {
  console.log("came here in fetchChargeData")
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);
  console.log('Fetching charges for chargeType:', status);

  try {
    const response = await api.get(`/charges/fetch-charges`, {
      params: { societyId, status,limit,offset }, // Send status as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching charges:', error);
    throw error;
  }
};

//fetch pending or paid charge for non admin users
export const fetchUserChargeData = async (status: string,limit?:any,offset?:any) => {
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);
  console.log('Fetching user charges for chargeType:', status);

  try {
    const response = await api.get(`/charges/fetch-user-charges`, {
      params: { societyId, status,limit,offset }, // Send status as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user charges:', error);
    throw error;
  }
};

//fetch the payment status for the charges view payment status page
export const fetchPaymentDetails = async (chargeId: string,limit?:any,offset?:any) => {
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);
  console.log('Fetching charges for chargeType:', chargeId);

  try {
    const response = await api.get(`/charges/fetch-payment-details`, {
      params: {
        societyId,
        chargeId,
        limit,
        offset
      },
    });

    return response.data;
  }
   catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Could not fetch payment details');
  }
};

//fetch the indivual charges according to chargeId for edit charge or display or copy
export const fetchChargeAction = async (chargeId: string) => {
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);
  console.log('Fetching data for the charge for chargeId:', chargeId);

  try {
    const response = await api.get(`/charges/fetch-charge`, {
      params: {
        societyId,
        chargeId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching the indiviual charge details:', error);
    throw error;
  }
};


export const fetchChargeReceiptAction = async (chargeId: string) => {
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);
  console.log('Fetching data for the charge for chargeId:', chargeId);

  try {
    const response = await api.get(`/charges/fetch-charge-receipt`, {
      params: {
        societyId,
        chargeId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching the indiviual charge details:', error);
    throw error;
  }
};

// Update the charge on edit
export const editChargeAction = async (
  chargeId: string,
  data: ChargeFeeFormType
) => {
  try {
    const encryptedSocietyId = await AsyncStorage.getItem('societyId');
    if (!encryptedSocietyId) {
      throw new Error('No society ID found in localStorage');
    }

    const payload = {
      ...data,
      dueDate: new Date(data.dueDate), // Ensure correct date formatting
      encryptedSocietyId, // Include the society ID in the payload
    };



    // Sending PUT request to update the charge with chargeId as a URL parameter
    const response = await api.put(
      `/charges/edit-charge/${chargeId}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    showToast('Charge/Fee updated successfully','success');
    return response;
  }catch (error:any) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     showToast("You are not authorized to perform this action.",'error');
 } else { 
   showToast(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR,'error');
 }
 
 }
};

//soft delete the charge in upcoming tab
export const softDeleteChargeAction = async (chargeId:string) => {
  try {
    console.log('chargeId in softDeleteChargeAction', chargeId);

    // Use PUT request for soft-deleting the charge
    const response = await api.put(`/charges/soft-delete-charge/${chargeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      showToast(response.data.message || 'Charge deleted successfully','success');
    } else if (response.status === 404) {
      showToast('Charge not found','error');
    }
    return response;
  }catch (error:any) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     showToast("You are not authorized to perform this action.",'error');
 } else { 
   showToast(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR,'error');
 }
 
 }
};

//hard delete the charge in upcoming tab
export const hardDeleteChargeAction = async (chargeId:string) => {
  try {
    console.log('chargeId in hardDeleteChargeAction', chargeId);

    // Use PUT request for hard-deleting the charge
    const response = await api.put(`/charges/hard-delete-charge/${chargeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
     showToast(response.data.message || 'Charge deleted successfully','success');
    } else if (response.status === 400) {
      showToast(
        response.data.message ||
          'Cannot delete charge. Payments are associated with it.',
          'error'
      );
    } else if (response.status === 404) {
      showToast('Charge not found','error');
    }

    return response;
  } catch (error:any) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     showToast("You are not authorized to perform this action.",'error');
 } else { 
   showToast(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR,'error');
 }
 
 }
};

//fetch the indivual charges according to chargeId for edit charge or display or copy
export const fetchFeeTypeAction = async () => {
  const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage

  if (!societyId) {
    throw new Error('No society ID found in localStorage');
  }

  console.log('Society ID:', societyId);

  try {
    const response = await api.get(`/charges/fetch-fee-type`, {
      params: {
        societyId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching the indiviual charge details:', error);
    throw error;
  }
};
