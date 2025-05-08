import { errorMessages, successMessages } from '@/src/lib/constants/messages';

import toast from 'react-hot-toast';
import { api } from './api';
import axios from 'axios';
import { ChargeFeeFormType } from '../lib/types/chargesFee.types';
import { log } from 'console';

export const createChargeAction = async (data: ChargeFeeFormType) => {
  try {
    console.log('API', api.getUri());
    console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
    const response = await api.post('/charges/create-charge', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Charge/Fee created succesfully');
    return response;
  } catch (error) {
     // Check for 702 status code to show custom authorization error
     if (error?.response?.status === 702) {
      toast.error("You are not authorized to perform this action.");
  } else { 
    toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
  }
  
  }
};

//fetch the charges according to the upcoming,past,draft,deleted
export const fetchChargeData = async (status: string,limit?,offset?) => {
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
export const fetchUserChargeData = async (status: string,limit?,offset?) => {
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
export const fetchPaymentDetails = async (chargeId: string,limit?,offset?) => {
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
    const encryptedSocietyId = localStorage.getItem('societyId');
    if (!encryptedSocietyId) {
      throw new Error('No society ID found in localStorage');
    }

    const payload = {
      ...data,
      dueDate: new Date(data.dueDate), // Ensure correct date formatting
      encryptedSocietyId, // Include the society ID in the payload
    };

    console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL); // For debugging the API URL

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

    toast.success('Charge/Fee updated successfully');
    return response;
  }catch (error) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     toast.error("You are not authorized to perform this action.");
 } else { 
   toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
 }
 
 }
};

//soft delete the charge in upcoming tab
export const softDeleteChargeAction = async (chargeId) => {
  try {
    console.log('chargeId in softDeleteChargeAction', chargeId);

    // Use PUT request for soft-deleting the charge
    const response = await api.put(`/charges/soft-delete-charge/${chargeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      toast.success(response.data.message || 'Charge deleted successfully');
    } else if (response.status === 404) {
      toast.error('Charge not found');
    }
    return response;
  }catch (error) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     toast.error("You are not authorized to perform this action.");
 } else { 
   toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
 }
 
 }
};

//hard delete the charge in upcoming tab
export const hardDeleteChargeAction = async (chargeId) => {
  try {
    console.log('chargeId in hardDeleteChargeAction', chargeId);

    // Use PUT request for hard-deleting the charge
    const response = await api.put(`/charges/hard-delete-charge/${chargeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      toast.success(response.data.message || 'Charge deleted successfully');
    } else if (response.status === 400) {
      toast.error(
        response.data.message ||
          'Cannot delete charge. Payments are associated with it.'
      );
    } else if (response.status === 404) {
      toast.error('Charge not found');
    }

    return response;
  } catch (error) {
    // Check for 702 status code to show custom authorization error
    if (error?.response?.status === 702) {
     toast.error("You are not authorized to perform this action.");
 } else { 
   toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
 }
 
 }
};

//fetch the indivual charges according to chargeId for edit charge or display or copy
export const fetchFeeTypeAction = async () => {
  const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

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
