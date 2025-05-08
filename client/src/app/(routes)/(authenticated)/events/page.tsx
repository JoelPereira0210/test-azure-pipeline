'use client';

import React, { useState, useEffect, useContext } from 'react';
import CreateEventForm from '@/src/forms/CreateEventForm';
import ViewEventForm from '@/src/forms/ViewEventForm';
import EventRegisteredMembers from '@/src/forms/EventRegisteredMembers';
import { fetchEventData } from '@/src/actions/createevent';
import { EventContext } from '@/src/component/context/EventContext';
import { EventProvider } from '@/src/component/context/EventContext';


import './style.scss';

import { Box, CircularProgress } from '@mui/material';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import { Footer } from '@/src/component/UI/Footer/Foter';
import { MoreDetailsProvider } from '@/src/component/context/MoreDetails';

const CreateEventPage: React.FC = () => {
  const { createEvent, setCreateEvent, setEventActionType, eventId, setEventId, eventActionType, registeredMembers, setRegisteredMembers } = useContext(EventContext);
  const [eventsPresent, setEventsPresent] = useState(true); // Indicates if events are present

  // const [eventActionType, setEventActionType] = useState('edit event');
  const [loading, setLoading] = useState(true);
   const [membershipStatus, setMembershipStatus] = useState('');
   const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
      // Check the `flow` value from localStorage and set state
      const role = localStorage.getItem('flow');
      setIsAdmin(role === 'admin');
      const membership = localStorage.getItem('membershipStatus');
    setMembershipStatus(membership); 
    }, []);


  // Fetch events when the page loads

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response1 = await fetchEventData('upcoming', isAdmin); // Fetch events from your API
        const response2 = await fetchEventData('past', isAdmin); // Fetch events from your API
        const response3 = await fetchEventData('draft', isAdmin); // Fetch events from your API
        const response4 = await fetchEventData('deleted', isAdmin); // Fetch events from your API

        if (response1.length > 0 || response2.length > 0 || response3.length > 0 || response4.length > 0) {
          setEventsPresent(true); // Set to true if events are present
        } else {
          setEventsPresent(false); // Set to false if no events are present
        }

      } catch (error) {
        console.error('Error fetching events:', error);
        setEventsPresent(false); // Set to false if error occurs and no events found
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEvents();
  }, [createEvent]);

  // Show loading indicator while fetching data
  if (loading) {
    return (<Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // Adjust based on page height
      }}
    >
      <CircularProgress size="3rem" />
    </Box>);
  }

  return (
    <>
    <MoreDetailsProvider>

      {
        registeredMembers ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Box sx={{
              width: 'calc(100% - 240px)',
              borderRadius: '20px',
              border: '1px solid #9C9AA533',
              '@media (max-width:767px)': {
                width: '100%',
              },marginBottom:"3%"

            }}>

              <EventRegisteredMembers />
            </Box>
          </Box>
        ) :
          createEvent && (isAdmin && membershipStatus === 'paid') ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <Box sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }

              }}>

                {/* Create Event Form with the cancel functionality */}
                <CreateEventForm />
              </Box>
            </Box>
          ) : eventsPresent ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <Box sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }

              }}>


                <ViewEventForm />
                <Footer/>
              </Box>
           
            </Box>
          ) : isAdmin ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <Box sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }

              }}>

                <BaseContainer text="No Events">
                  <ButtonInput
                    type="button"
                    text="Create Event"
                    onClick={() => setCreateEvent(true)}
                    disabled={isAdmin && membershipStatus === 'unpaid'}
                    loading={false}
                    styles={{ maxWidth: '230px' }}
                  />
                </BaseContainer>
                <Footer/>
              </Box>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <Box sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }

              }}>

                <BaseContainer text="No Events Available" />
                <Footer/>
              </Box>
            </Box>
          )}
          
          </MoreDetailsProvider>
    </>
  );
};

export default CreateEventPage;

