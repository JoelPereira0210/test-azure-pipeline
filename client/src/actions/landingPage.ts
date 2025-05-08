import { errorMessages, successMessages } from '@/src/lib/constants/messages';

import toast from 'react-hot-toast';
import { api } from './api';
import axios from 'axios';

import { log } from 'console';

export const createLandingCardAction = async (data: any) => {
  try {
    console.log(' createLandingCardAction data', data);


    const response = await api.post('/super-admin/create-landing-card', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Landing Card created successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message ?? 'An unknown error occurred.'
      );
    }
    throw error; // Re-throw error for further handling
  }
};

export const createSliderCardAction = async (data: any) => {
  try {
    console.log('createSliderCardAction data', data);
    const response = await api.post('/super-admin/create-slider-card', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Slider Card created successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message ?? 'An unknown error occurred.'
      );
    }
    throw error; // Re-throw error for further handling
  }
};

export const editLandingCardAction = async (data: any) => {
  try {
    console.log('editLandingCardAction data', data);
    const response = await api.put('/super-admin/edit-landing-card', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Landing Card updated successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message ?? 'An unknown error occurred.'
      );
    }
    throw error; // Re-throw error for further handling
  }
};

export const editSliderCardAction = async (data: any) => {
  try {
    console.log('editLandingCardAction data', data);
    const response = await api.put('/super-admin/edit-slider-card', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Landing Card updated successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message ?? 'An unknown error occurred.'
      );
    }
    throw error; // Re-throw error for further handling
  }
};

// Delete Landing Card
export const deleteLandingCardAction = async (id) => {
  try {
    const response = await api.delete(`/super-admin/delete-landing-card/${id}`);
    toast.success('Landing Card deleted successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message || 'Failed to delete Landing Card.'
      );
    }
    throw error;
  }
};

// Delete Slider Card
export const deleteSliderCardAction = async (id) => {
  try {
    const response = await api.delete(`/super-admin/delete-slider-card/${id}`);
    toast.success('Slider Card deleted successfully');
    return response;
  } catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message || 'Failed to delete Slider Card.'
      );
    }
    throw error;
  }
};


export const deleteLandingCardMediaAction = async (imageId) => {
  try {
    const response = await api.delete(`/super-admin/delete-landing-card-media/${imageId}`);
    toast.success('Slider Card deleted successfully');
    return response;
  }
  catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message || 'Failed to delete media from this Card.'
      );
    }
    throw error;
  }
};

export const deleteSliderCardMediaAction = async (imageId) => {
  try {
    const response = await api.delete(`/super-admin/delete-slider-card-media/${imageId}`);
    toast.success('Slider Card media deleted successfully');
    return response;
  }
  catch (error) {
    if (error?.response?.status === 702) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(
        error?.response?.data.message || 'Failed to delete media from this Card.'
      );
    }
    throw error;
  }
};


//display all landing cards data to superAdmin
export const fetchLandingCardsAction = async (limit?,offset?) => {
  try {
    const response = await api.get('/super-admin/fetch-landing-cards', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Landing Cards:', error);
    throw error; // Re-throw error for further handling
  }
};

//display all slider cards data to superAdmin
export const fetchSliderCardsAction = async (limit?,offset?) => {
  try {
    const response = await api.get('/super-admin/fetch-slider-cards', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Slider Cards:', error);
    throw error; // Re-throw error for further handling
  }
};




export const fetchLandingSectionData = async (sectionType) => {
  console.log('Section Type being sent to API:', sectionType);
 
 
  try {
    const response = await api.get('landingpage/fetch-landing-section-data', {
      params: {
        sectionType,
      },
    });
 
    console.log('Response from API:', response);
 
    if (response.status === 200) {
      console.log("slider in action",response)
      return response.data; // Return the section data
    } else if (response.status === 203) {
      console.error('Section data not found for the given type');
    }
  } catch (error) {
 
      console.error('Error occurred while fetching section data:', error);
 
  }
};


// export const fetchLandingSectionData = async (sectionType) => {
//   console.log('Section Type being sent to API:', sectionType);

//   try {
//     const response = await api.get('landingpage/fetch-landing-section-data', {
//       params: {
//         sectionType,
//       },
//     });

//     console.log('Response from API:', response);

//     if (response.status === 200) {
//       // Check if data and sliderData exist and return accordingly
//       const landingCards = response.data.data;

//       // Iterate over each landing card to check for sliderData
//       landingCards.forEach((card) => {
//         if (card.sliderData) {
//           console.log('Slider Data found for card:', card.landingCardId);
//           console.log('Slider Data:', card.sliderData);
//         } else {
//           console.log('No Slider Data found for card:', card.landingCardId);
//         }
//       });

//       return landingCards; // Return the section data, now with slider data included if present

//     } else if (response.status === 203) {
//       console.error('Section data not found for the given type');
//     }
//   } catch (error) {
//     console.error('Error occurred while fetching section data:', error);
//   }
// };


// export const fetchLandingSectionData = async (sectionType) => {
//   console.log('Section Type being sent to API:', sectionType);

//   try {
//     const response = await api.get('landingpage/fetch-landing-section-data', {
//       params: {
//         sectionType,
//       },
//     });

//     console.log('Response from API:', response);

//     if (response.status === 200) {
//       // Extract landingCards and sliderCards from the response
//       const landingCards = response.data.data;
//       const sliderCards = response.data.sliderCards; // Assuming sliderCards are included in the response
// console.log("ss data",sliderCards,landingCards)

//       // // Log landing cards as you did before
//       // landingCards.forEach((card) => {
//       //   console.log('Landing Card:', card.sliderData);
//       //   if (card.sliderData) {
//       //     console.log('Slider Data found for card:', card.landingCardId);
//       //     console.log('Slider Data:', card.sliderData);
//       //   } else {
//       //     console.log('No Slider Data found for card:', card.landingCardId);
//       //   }
//       // });

//       // Log the sliderCards data
//       if (sliderCards && sliderCards.length > 0) {
//         console.log('Slider Cards Data:', sliderCards);
//       } else {
//         console.log('No Slider Cards found.');
//       }

//       return { landingCards, sliderCards };// Return the section data, now with slider data included if present

//     } else if (response.status === 203) {
//       console.error('Section data not found for the given type');
//     }
//   } catch (error) {
//     console.error('Error occurred while fetching section data:', error);
//   }
// };
