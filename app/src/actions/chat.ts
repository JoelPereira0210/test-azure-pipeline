import { api } from './api'; // Your custom API instance
import { showToast } from '../utils/toastService';

export const getChatsAction = async (
  societyId: string,
  page: number = 1,
  limit: number = 15
) => {
  try {
    // Making the API call with pagination and societyId
    const response = await api.get('/chats', {
      params: {
        societyId: societyId,
        page: page, // Page number for pagination
        limit: limit, // Number of messages per page
      },
    });

    // Log the response data
    console.log('Chats fetched successfully:', response.data);

    // Check if the request was successful
    if (response.status === 200) {
      return response; // Return the data if successful
    } else {
      // Handle unsuccessful status code
      showToast(
       'Failed to fetch chats, please try again later.','error'
      );
      return null;
    }
  } catch (err: any) {
    // Handle any error that occurs during the API request
    console.error('Error fetching chat messages:', err);

    // Display a toast notification for the error
    showToast(
      'Error fetching chats. Please check your internet connection.','error');
    return err;
  }
};