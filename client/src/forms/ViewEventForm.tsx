'use client';

import React, { useState, useEffect, useContext,useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  CircularProgress,
} from '@mui/material';

import toast from 'react-hot-toast';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import ViewTab from '../component/Tabs/ViewTab'; // Import the Tabs component
import GroupsIcon from '@mui/icons-material/Groups';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import { fetchEventData } from '@/src/actions/createevent';
import { deleteEventPermanentlyAction } from '@/src/actions/createevent';
import { deleteEventAction } from '@/src/actions/createevent';
import { useRouter, usePathname } from 'next/navigation';
import { EventContext } from '../component/context/EventContext';
import ConfirmBoxModel from '../component/UI/Popup/ConfirmBoxModel';
import { checkIsAdminAction } from '@/src/actions/auth';
import JoinEventModal from '../component/modals/JoinEventModal';
import utc from 'dayjs/plugin/utc';
import EventCard from '../component/UI/Card/Card';

dayjs.extend(utc);

const EventListingPage = () => {
  const {
    setCreateEvent,
    setEventActionType,
    setEventId,
    registeredMembers,
    setRegisteredMembers,
    eventName,
    setEventName,
    eventSection,
    setEventSection,
  } = useContext(EventContext);
  const [step, setStep] = useState(1); // Manage active tab

  const [anchorEl, setAnchorEl] = useState(null); // For action menu
  const [activeEvent, setActiveEvent] = useState(null); // Store the active event for action menu
  const [activeEventName, setActiveEventName] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [events, setEvents] = useState([]); // Store fetched events
  const [openDialog, setOpenDialog] = useState(false); // State for handling the open state of AlertDialog
  const [deleteAction, setDeleteAction] = useState(''); // Tracks if it's 'Delete' or 'Permanently Delete'

  const scrollContainerRef = useRef(null); // Reference for scroll container
  const [page, setPage] = useState(0); // Current page
  const [hasMore, setHasMore] = useState(true); // Flag to check if more data is available


  const [openJointEventModal, setOpenJointEventModal] = useState({
    open: false,
    eventId: '',
    eventType: '',
    amountPerPerson: 0,
    allowFamilyFriends: false,
    chargePerPerson: false,
    eventName: '',
    remainingCapacity: 0,
  });

  const theme = useTheme();
  const mode = theme.palette.mode;
  const router = useRouter();

  const formatTime = (timeString) => {
    const time = new Date(timeString);

    // Get the hours and minutes in UTC
    let hours = time.getUTCHours(); // You can adjust this to 'getHours()' if you don't want to handle UTC
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 and handle 12-hour format

    return `${hours}:${minutes} ${ampm}`;
  };
   const [membershipStatus, setMembershipStatus] = useState('');


  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
    const membership = localStorage.getItem('membershipStatus');
  setMembershipStatus(membership); 
  }, []);

  useEffect(() => {
    // Update event section in context based on the step
    if (step === 1) {
      setEventSection('upcoming');
    } else if (step === 2) {
      setEventSection('past');
    } else if (step === 3) {
      setEventSection('draft');
    } else if (step === 4) {
      setEventSection('deleted');
    }
  }, [step, setEventSection]);

  // console.log("eventSection",eventSection);

  const handleOpenJointEventModal = (eventData) => {
    if (!isAdmin && !eventData.hasPaid) {
      const remainingCapacity =
        eventData.maxPeopleAllowed - eventData.registeredMembersCount;
      setOpenJointEventModal({
        open: true,
        eventId: eventData.eventId,
        eventType: eventData.eventType.eventType, // Assuming eventType is nested
        amountPerPerson: eventData.amount, // Default to 500 if amount not provided
        allowFamilyFriends: eventData.allowFamilyandFriends,
        chargePerPerson: eventData.ChargePerPerson,
        eventName: eventData.eventName,
        remainingCapacity, // Add the remaining capacity here
      });
      console.log('setOpenJointEventModal', eventData);
    }
  };

  const handleCloseJointEventModal = () => {
    setOpenJointEventModal({ ...openJointEventModal, open: false });
  };

  const handleClickMenu = (event, eventId, eventName) => {
    if (anchorEl !== event.currentTarget || activeEvent !== eventId) {
      setAnchorEl(event.currentTarget);
      setActiveEvent(eventId);
      setActiveEventName(eventName);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    if (action === 'View') {
      router.push(`events/${activeEvent}`);
    } else if (action === 'Edit' && isAdmin) {
      setEventId(activeEvent);
      setEventActionType('edit event');
      setCreateEvent(true);
      setRegisteredMembers(false);
    } else if (action === 'Delete' || action === 'Permanently Delete') {
      setDeleteAction(action);
      setOpenDialog(true); // Open confirmation dialog
    } else if (action === 'Copy' && isAdmin) {
      setEventId(activeEvent);
      setEventActionType('copy event');
      setCreateEvent(true);
      setRegisteredMembers(false);
    } else if (action === 'View Registration') {
      setEventId(activeEvent);
      setCreateEvent(false);
      setRegisteredMembers(true);
      setEventName(activeEventName);
    }

    handleCloseMenu();
  };

  const handleDelete = async () => {
    try {
      if (deleteAction === 'Delete') {
        const response = await deleteEventAction(activeEvent);
        if (response.status === 200 || response.status === 204) {
          fetchEvents(step); // Refetch events after deletion
          setCreateEvent(false);
          router.push(`/events`);
          // toast.success('Event deleted successfully');
        }
      }

      if (deleteAction === 'Permanently Delete') {
        const response = await deleteEventPermanentlyAction(activeEvent);
        if (response.status === 200 || response.status === 204) {
          fetchEvents(step); // Refetch events after deletion
          setCreateEvent(false);
          router.push(`/events`);
        }
        // toast.success('Event permanently deleted');
      }
    } catch (error) {
      // toast.error('Failed to delete event: ' + error.message);
    } finally {
      setOpenDialog(false); // Close the dialog after action
    }
  };

  const fetchEvents = async (activeTab) => {
    setLoading(true); // Start loading
    try {
      let response;

      if (activeTab === 1) {
        // Fetch Upcoming events
        response = await fetchEventData('upcoming', isAdmin);
      } else if (activeTab === 2) {
        // Fetch Past events
        response = await fetchEventData('past', isAdmin);
        // console.log("final frontend: ",response);
      } else if (activeTab === 3) {
        // Fetch Draft events
        response = await fetchEventData('draft', isAdmin);
      } else if (activeTab === 4) {
        // Fetch Deleted events
        response = await fetchEventData('deleted', isAdmin);
      }

      console.log('final frontend 2: ', response);

      setEvents(response); // Update events state
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

   // Resets when the active tab changes
   useEffect(() => {
    setEvents([]); // Clear events for the new tab
    setPage(0); // Reset page to 0
    setHasMore(true); // Reset hasMore for the new tab
  }, [step]);

  useEffect(() => {
    fetchEvents(step);
  }, [step]); // Refetch events when the active tab changes

    
  useEffect(() => {
    fetchMoreEvents();
  }, [page]); // Fetch data whenever the page changes

// Add this ref to track the scroll position
const scrollPositionRef = useRef(0);

  const fetchMoreEvents = async () => {
    if (loading || !hasMore) return;

      // Save the current scroll position
  scrollPositionRef.current = scrollContainerRef.current.scrollTop;
  
    setLoading(true);
    try {
      const limit = 10; // Number of events per page
      const offset = page * limit; // Calculate offset

      let eventType;

      // Determine event type based on the current tab
      if (step === 1) eventType = 'upcoming';
      else if (step === 2) eventType = 'past';
      else if (step === 3) eventType = 'draft';
      else if (step === 4) eventType = 'deleted';

      const response = await fetchEventData(eventType, isAdmin, limit, offset);

      // const response = await fetchEventData('upcoming', isAdmin, limit, offset);
  
      setEvents((prevEvents) => [...prevEvents, ...response]); // Append new events
      if (response.length < limit) setHasMore(false); // If fewer events are returned, no more data
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);

       // Restore the scroll position
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 50);
    
    }
  };
  
  useEffect(() => {
    const container = scrollContainerRef.current;
  
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef]);



  const handleScroll = () => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollHeight -
        scrollContainerRef.current.scrollTop <=
        scrollContainerRef.current.clientHeight + 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup
    };
  }, []);


  return (
    <Box className="custom-container"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{ height: '100vh', overflowY: 'auto' }} // Ensure container is scrollable
       
    >
      
      <ViewTab
        step={step}
        setStep={setStep}
        tabBtnTxt="Create New Event"
        actionType="event"
      />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh', // Adjust based on page height
          }}
        >
          <CircularProgress size="3rem" />
        </Box>
      ) : events.length === 0 ? (
        // Show image when there are no events
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Box
            component="img"
            src={'/images/Frame.png'}
            alt="No events available"
          />
          <Typography variant="text12" sx={{ color: 'gray' }}>
            No events available
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { sm: '1fr', md: 'repeat(2, 1fr)' },
            gap: '20px',
            marginTop: '20px',
            margin: '5%',
          }}
        >
          {events.map((event) => (
            <Card
              key={event.eventId}
              sx={{
                padding: '16px',
                border: '1px solid',
                borderColor: `${
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)'
                }`,
                borderRadius: '8px',
                position: 'relative',
                backgroundColor: `${
                  mode === 'light'
                    ? 'var(--tw-bg-light-sidebar)'
                    : 'var(--tw-bg-dark-background)'
                }`,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                marginRight: { xs: 'auto', sm: 'auto', md: '13%', lg: '13%' },
                width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography
                    variant="text2"
                    fontWeight={600}
                    sx={{
                      color: `${
                        mode === 'light'
                          ? 'var(--tw-text-light-mainText)'
                          : 'var(--tw-text-dark-mainText)'
                      }`,
                    }}
                  >
                    {event.eventName}
                  </Typography>{' '}
                  <br />
                  <Typography
                    variant="text6"
                    sx={{
                      color: `${
                        mode === 'light'
                          ? 'var(--tw-text-light-mainText)'
                          : 'var(--tw-text-dark-mainText)'
                      }`,
                    }}
                  >
                    {dayjs(event.eventStartDate).format('D MMM YYYY')},{' '}
                    {formatTime(event.eventStartTime)}
                  </Typography>
                </Box>
                {/* Free or Price tag */}
                <Typography
                  variant="text2"
                  sx={{
                    color:
                      event.eventType.eventType === 'free' ? 'green' : 'red',
                  }}
                >
                  {event.eventType.eventType === 'free'
                    ? 'Free'
                    : `₹ ${event.amount}`}
                </Typography>
              </Box>

              <Typography
                variant="text8"
                sx={{
                  color: `${
                    mode === 'light'
                      ? 'var(--tw-text-light-mainText)'
                      : 'var(--tw-text-dark-mainText)'
                  }`,
                  wordBreak: 'break-all',
                }}
              >
                {event.eventDescription.length > 80
                  ? parse(`${event.eventDescription.substring(0, 80)}...`)
                  : parse(event.eventDescription)}
              </Typography>

              {/* Attendance */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => {
                  handleOpenJointEventModal(event);
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <GroupsIcon color="primary" fontSize="large" />
                  <Typography
                    variant="text8"
                    sx={{
                      color: `${
                        mode === 'light'
                          ? 'var(--tw-text-light-mainText)'
                          : 'var(--tw-text-dark-mainText)'
                      }`,
                    }}
                  >
                    &nbsp; {event.registeredMembersCount}/
                    {event.maxPeopleAllowed}
                  </Typography>

                  <Box>
                    {event.acceptDonation && (
                      <Typography
                        variant="text8"
                        sx={{
                          color: 'var(--tw-text-light-yellowText)',
                          marginLeft: '15px',
                          textWrap: 'nowrap',
                        }}
                      >
                        Accept Donation
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Action Buttons for Non-Admin and Admin */}
                {isAdmin ? (
                  <IconButton
                    aria-label="more"
                    aria-controls="event-menu"
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleClickMenu(e, event.eventId, event.eventName)
                    }
                  >
                    <MoreHorizIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <Box
                    sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}
                  >
                    {/* Register Button */}

                    {!isAdmin && eventSection !== 'past' && (
                      <>
                        {event.registeredMembersCount ===
                        parseInt(event.maxPeopleAllowed) ? (
                          <Typography
                            variant="text6"
                            sx={{ color: 'red' }} // Style for full registration
                          >
                            Registration Full
                          </Typography>
                        ) : event.hasPaid ? (
                          <Typography variant="text6">Registered</Typography>
                        ) : (membershipStatus === 'paid') && (
                          <Typography
                            variant="text6"
                            sx={{
                              cursor: 'pointer',
                              color: `${
                                mode === 'light'
                                  ? 'var(--tw-text-light-mainText)'
                                  : 'var(--tw-text-dark-mainText)'
                              }`,
                            }}
                            // onClick={() => {
                            //   handleOpenJointEventModal(event);
                            //   console.log(event);
                            // }}
                            onClick={
                              !event.hasPaid
                                ? () => {
                                    handleOpenJointEventModal(event);
                                    console.log(event);
                                  }
                                : null // Disable click if already paid
                            }
                          >
                            Register
                          </Typography>
                        )}
                      </>
                    )}

                    {/* View Event Button */}
                    <IconButton
                      onClick={(e) => {
                        router.push(`events/${event.eventId}`);
                        e.stopPropagation();
                      }}
                      sx={{
                        color: `${
                          mode === 'light'
                            ? 'var(--tw-text-light-mainText)'
                            : 'var(--tw-text-dark-mainText)'
                        }`,
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>
          ))}
          {anchorEl && (
            <Menu
              id="event-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              sx={{
                '& .MuiPaper-root': {
                  boxShadow: '2px 2px 10px #e4e6ed', // Remove the box shadow
                },
              }}
            >
              {isAdmin ? (
                // Menu for Admin users
                <>
                  {step === 1 || step === 3 ? (
                    <>
                      <MenuItem onClick={() => handleMenuAction('View')}>
                        View Event
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuAction('Edit')}>
                        Edit Event
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuAction('Delete')}>
                        Delete Event
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuAction('View Registration')}
                      >
                        View Registration
                      </MenuItem>
                    </>
                  ) : step === 2 ? (
                    <>
                      <MenuItem onClick={() => handleMenuAction('View')}>
                        View Event
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuAction('View Registration')}
                      >
                        View Registration
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuAction('Delete')}>
                        Delete Event
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={() => handleMenuAction('View')}>
                        View Event
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuAction('View Registration')}
                      >
                        View Registration
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuAction('Permanently Delete')}
                      >
                        Delete Event
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuAction('Copy')}>
                        Copy Event
                      </MenuItem>
                    </>
                  )}
                </>
              ) : null}
            </Menu>
          )}
       
     
       {!hasMore && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          No more events to load.
        </Typography>
      )}


        </Box>
      )}
      <ConfirmBoxModel
        open={openDialog}
        title={
          deleteAction === 'Delete' ? 'Confirm Deletion' : 'Confirm Deletion'
        }
        description={
          deleteAction === 'Delete'
            ? 'Are you sure you want to delete this event?'
            : 'Are you sure you want to delete this event?'
        }
        onAgree={handleDelete}
        onDisagree={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        agreeText={deleteAction === 'Delete' ? 'Yes, Delete' : 'Yes, Delete'}
        disagreeText="No, Cancel"
      />
      <JoinEventModal
        open={openJointEventModal.open}
        onClose={handleCloseJointEventModal}
        eventId={openJointEventModal.eventId}
        eventType={openJointEventModal.eventType}
        amountPerPerson={openJointEventModal.amountPerPerson}
        allowFamilyFriends={openJointEventModal.allowFamilyFriends}
        eventName={openJointEventModal.eventName}
        remainingCapacity={openJointEventModal.remainingCapacity}
        chargePerPerson={openJointEventModal.chargePerPerson}
      />
    </Box>
  );
};

export default EventListingPage;
