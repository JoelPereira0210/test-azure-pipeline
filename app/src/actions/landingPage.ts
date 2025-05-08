import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const showToast = (type:any, message:any) => {
  Toast.show({
    type: type,
    text1: message,
  });
};

export const createLandingCardAction = async (data:any) => {
  try {
    console.log(' createLandingCardAction data', data);
    const response = await api.post('/super-admin/create-landing-card', data);
    showToast('success', 'Landing Card created successfully');
    return response;
  } catch (error:any) {
    showToast('error', error?.response?.data?.message ?? 'An unknown error occurred.');
    throw error;
  }
};

export const createSliderCardAction = async (data:any) => {
  try {
    console.log('createSliderCardAction data', data);
    const response = await api.post('/super-admin/create-slider-card', data);
    showToast('success', 'Slider Card created successfully');
    return response;
  } catch (error:any) {
    showToast('error', error?.response?.data?.message ?? 'An unknown error occurred.');
    throw error;
  }
};

export const editLandingCardAction = async (data:any) => {
  try {
    console.log('editLandingCardAction data', data);
    const response = await api.put('/super-admin/edit-landing-card', data);
    showToast('success', 'Landing Card updated successfully');
    return response;
  } catch (error:any) {
    showToast('error', error?.response?.data?.message ?? 'An unknown error occurred.');
    throw error;
  }
};

export const deleteLandingCardAction = async (id:string) => {
  try {
    const response = await api.delete(`/super-admin/delete-landing-card/${id}`);
    showToast('success', 'Landing Card deleted successfully');
    return response;
  } catch (error:any) {
    showToast('error', error?.response?.data?.message || 'Failed to delete Landing Card.');
    throw error;
  }
};

export const fetchLandingCardsAction = async () => {
  try {
    const response = await api.get('/super-admin/fetch-landing-cards');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Landing Cards:', error);
    throw error;
  }
};

export const fetchLandingSectionData = async (sectionType:string) => {
  try {
    console.log('Section Type being sent to API:', sectionType);
    const response = await api.get('/landingpage/fetch-landing-section-data', {
      params: { sectionType },
    });
    return response.data;
  } catch (error) {
    console.error('Error occurred while fetching section data:', error);
    throw error;
  }
};
