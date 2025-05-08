//alister

import { errorMessages, successMessages } from '@/src/lib/constants/messages';

import toast from 'react-hot-toast';
import { api } from './api';
import axios from 'axios';
import { CreateEventType } from '../lib/types/createEvent.types';
import { log } from 'console';

export const createEventAction = async (data: CreateEventType) => {
    try {
        console.log('API', api.getUri());
        console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
        const response = await api.post('/events/create-event', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        toast.success("event created succesfully");
        return response;
    }  catch (error) {
        // Check for 702 status code to show custom authorization error
        if (error?.response?.status === 702) {
            toast.error("You are not authorized to perform this action.");
        } else {
            // Handle other errors with a generic message or a specific error message if available
            toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
        }
    }
};

export const fetchEventData = async (eventType,checkIsAdmin?, limit = 10, offset = 0) => {
    try {
        const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

        if (!societyId) {
            throw new Error('No society ID found in localStorage');
        }

        console.log('Society ID:', societyId);
        console.log('Fetching events for eventType:', eventType);


        // Fetch event data with the societyId and eventType
        const response = await api.get('/events/display-events', {
            params: {
                societyId,     // Pass the societyId as a query parameter
                eventType,     // Pass the eventType (upcoming, past, draft, deleted) as a query parameter
                checkIsAdmin,
                limit,         // Pass the limit parameter
                offset  
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
    }
};




// Fetch individual event in view event
export const fetchEvent = async (eventId) => {
    try {
        const societyId = localStorage.getItem('societyId');
        if (!societyId) {
            throw new Error('No society ID found in localStorage');
        }

        console.log('Fetching events for eventId:', eventId);

        const response = await api.get('/events/individual-event', {
            params: {
                eventId, // Pass the eventId as a query parameter
            },
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch event details with status code ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};


//patch for edit event action
export const updateEventAction = async (eventId, data) => {
    try {
        // console.log('API', api.getUri());
        // console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
        console.log("patch data here in server ",data)
        
        // Use PATCH request for updating the event
        const response = await api.put(`/events/update-event/${eventId}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        toast.success("Event updated successfully");
        return response;
    }  catch (error) {
        // Check for 702 status code to show custom authorization error
        if (error?.response?.status === 702) {
            toast.error("You are not authorized to perform this action.");
        } else {
            // Handle other errors with a generic message or a specific error message if available
            toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};

export const deleteEventAction = async (eventId) => {
    try {

        console.log('eventId in deletEventAction ',eventId)
        // Use PUT request for deleting the event
        const response = await api.put(`/events/delete-event/${eventId}`,  {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status === 200) {
            toast.success(response.data.message || "Event deleted successfully");
        } else if (response.status === 404) {
            toast.error("Event not found");
        }
        return response;
    }catch (error) {
        // Check for 702 status code to show custom authorization error
        if (error?.response?.status === 702) {
            toast.error("You are not authorized to perform this action.");
        } else {
            // Handle other errors with a generic message or a specific error message if available
            toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};



//this is for dropzone
export const deleteMediaAction = async (mediaId) => {
    try {
        console.log('mediaId in deleteMediaAction', mediaId);

        // Send DELETE request to delete media by mediaId
        const response = await api.delete(`/events/delete-media/${mediaId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            toast.success(response.data.message || "Media deleted successfully");
        } else if (response.status === 404) {
            toast.error("Media not found");
        }

        return response;
    }  catch (error) {
        // Check for 702 status code to show custom authorization error
        if (error?.response?.status === 702) {
            toast.error("You are not authorized to perform this action.");
        } else {
            // Handle other errors with a generic message or a specific error message if available
            toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};



//delete medias by eventID
export const deleteEventPermanentlyAction = async (eventID) => {
    try {
        

        // Send DELETE request to delete media by mediaId
        const response = await api.put(`/events/hard-delete-event/${eventID}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            toast.success(response.data.message || "Event permanently deleted succesfully");
        } else if (response.status === 404) {
            toast.error("Medias not found");
        }

        return response;
    } catch (error) {
        // Check for 702 status code to show custom authorization error
        if (error?.response?.status === 702) {
            toast.error("You are not authorized to perform this action.");
        } else {
            // Handle other errors with a generic message or a specific error message if available
            toast.error(error?.response?.data.message ?? errorMessages.UNKNOWN_ERROR);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};

//fetch registered Members data for event 
export const fetchEventRegisteredMembersAction = async (eventID,limit?,offset?) => {
    try {
        const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

        if (!societyId) {
            throw new Error('No society ID found in localStorage');
        }

        console.log('Society ID:', societyId);
        console.log('Fetching Registered Members for eventId:', eventID);

        // Fetch event data with the societyId and eventType
        const response = await api.get('/events/display-event-member-registration', {
            params: {
                eventID,     // Pass the eventType (upcoming, past, draft, deleted) as a query parameter
                societyId,
                limit,
                offset,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
    }
}