  'use client';
  import React, { useState, useEffect, useContext } from 'react';
  import toast from 'react-hot-toast';
  import { useRouter } from 'next/navigation';
  import {
    Box,
    useTheme,
    Typography,
    Chip,
    CircularProgress,
  } from '@mui/material';
  import {
    deleteEventPermanentlyAction,
    fetchEvent,
  } from '@/src/actions/createevent';
  import { deleteEventAction } from '@/src/actions/createevent';
  import { EventContext } from '@/src/component/context/EventContext';
  import ButtonInput from '@/src/component/UI/Button/Button';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
  import 'react-quill/dist/quill.snow.css';
  import parse, { domToReact } from 'html-react-parser';
  import './style.scss';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { ClipLoader } from 'react-spinners';
  import ConfirmBoxModel from '@/src/component/UI/Popup/ConfirmBoxModel';
  import { checkIsAdminAction } from '@/src/actions/auth';
  import JoinEventModal from '@/src/component/modals/JoinEventModal';
  import DonationModal from '@/src/component/modals/AcceptDonationModal';


  dayjs.extend(utc);

  const DisplayEvent = ({ params }) => {
    const {
      setCreateEvent,
      setEventActionType,
      eventId,
      setEventId,
      eventActionType,
      eventSection,
      setEventSection,
    } = useContext(EventContext);
    const [loading, setLoading] = useState(true); // State to track loading
    const [eventData, setEventData] = useState(null); // State to store the fetched event data
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteAction, setDeleteAction] = useState(''); // To track 'Delete' action

    const [openJoinModal, setOpenJoinModal] = useState(false);
    const [openDonationModal, setOpenDonationModal] = useState(false);


     const [membershipStatus, setMembershipStatus] = useState('');
   
   
     const [isAdmin, setIsAdmin] = useState(false);
     useEffect(() => {
       // Check the `flow` value from localStorage and set state
       const role = localStorage.getItem('flow');
       setIsAdmin(role === 'admin');
       const membership = localStorage.getItem('membershipStatus');
     setMembershipStatus(membership); 
     }, []);


    const fetchEventById = async () => {
      setEventId(params.eventId);

      console.log('event ID to be displayed by state: ', eventId);
      console.log('event ID to be displayed by params: ', params.eventId);
      setLoading(true);

      try {
        const eventData = await fetchEvent(params.eventId);
        setEventData(eventData); // Store the fetched event data
        console.log('The event fetched is', eventData); // Successfully fetched event data
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log(
              'Bad Request: Missing eventId or other required parameters'
            );
          } else if (error.response.status === 404) {
            console.log(
              'Event Not Found: The event with the specified ID does not exist'
            );
          } else if (error.response.status === 500) {
            console.log(
              'Internal Server Error: There was a problem fetching the event'
            );
          } else {
            console.log(`Unexpected error: ${error.response.data.message}`);
          }
        } else {
          console.log(`Network or unexpected error occurred: ${error.message}`);
        }
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    };

    const remainingCapacity = eventData?.event?.maxPeopleAllowed - eventData?.registeredMembersCount || 0;

    useEffect(() => {
      fetchEventById();
    }, []);

    const theme = useTheme();
    const mode = theme.palette.mode;
    const router = useRouter();

    // Function to format time to 12-hour format
    const formatDate = (dateString, type = 'long') => {
      const date = new Date(dateString);

      if (type === 'short') {
        // Short format for the registration due date
        return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
      } else if (type === 'long') {
        // Long format for the event start/end date
        return date.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    };

    const handleDelete = async () => {
      try {
        if (eventSection === 'upcoming') {
          const response = await deleteEventAction(eventId);

          if (response.status === 200 || response.status === 204) {
            // Refresh or navigate after deletion
            router.push(`/events`);
          } 
        }
        else if  (eventSection === 'past') { 

          const response = await deleteEventAction(eventId);
    
          if (response.status === 200 || response.status === 204) {
            // Refresh or navigate after deletion
            router.push(`/events`);
          } 
        }
        else if  (eventSection === 'draft') { 

          const response = await deleteEventAction(eventId);
    
          if (response.status === 200 || response.status === 204) {
            // Refresh or navigate after deletion
            router.push(`/events`);
          } 
        }
        else if (eventSection === 'deleted') { 

          const response = await deleteEventPermanentlyAction(eventId);

          if (response.status === 200) {
            // Refresh or navigate after deletion
            router.push(`/events`);
          }
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      } finally {
        setOpenDialog(false); // Close the dialog
      }
    };

    const formatTime = (timeString) => {
      const time = new Date(timeString);

      // Get the hours and minutes in UTC
      let hours = time.getUTCHours();
      const minutes = String(time.getUTCMinutes()).padStart(2, '0');

      // Determine AM or PM suffix
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert 24-hour time to 12-hour format
      hours = hours % 12 || 12; // Convert 0 or 12 to 12 for 12-hour format

      return `${hours}:${minutes} ${ampm}`;
    };

    const transformLinks = (domNode) => {
      if (domNode.name === 'a') {
        const href = domNode.attribs.href;
        if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
          // Prepend 'http://' if the href does not already contain a protocol
          domNode.attribs.href = `http://${href}`;
        }
      }
    };

    const description = eventData?.event?.eventDescription;
    const descriptionWithCorrectedLinks =
      typeof description === 'string'
        ? parse(description, {
            replace: transformLinks,
          })
        : null;

        const handleCloseDonationModal = () => {
          setOpenDonationModal(false);
        };

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            width: 'calc(100% - 240px)',
            '@media (max-width:767px)': {
              width: '100%',
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Takes the full height of the viewport
              }}
            >
              <CircularProgress size="3rem" />
            </Box>
          ) : (
            <Box className="custom-container">
              <Box className="form-section">
                <Box
                  className="review-section"
                  sx={{
                    textAlign: {
                      lg: 'left',
                      md: 'left',
                      sm: 'left',
                      xs: 'left',
                    },
                    paddingRight: '2%',
                    marginTop: '2%',
                    marginBottom: '2%',
                  }}
                >
                  <ArrowBackIcon
                    fontSize="large"
                    onClick={() => {
                      router.push('/events');
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%', // Ensure Swiper takes the full width of its container
                      maxWidth: '85vw', // Limit max width to viewport width
                      height: 'auto', // Adjust height automatically based on content
                      display: 'flex', // Use flexbox for alignment
                      justifyContent: 'center', // Center content horizontally
                      alignItems: 'center', // Center content vertically
                      // overflow: 'hidden', // Hide any overflowing content
                      padding: '0 10px', // Add padding for small screens
                      margin: 'auto',
                      marginTop: '1%',

                      '& .swiper-button-next, .swiper-button-prev': {
                        color: `${
                          mode === 'light'
                            ? 'var(--tw-bg-dark-background)'
                            : 'var(--tw-bg-light-background)'
                        }`,
                      },
                      '& .swiper-button-next:hover, .swiper-button-prev:hover': {
                        color: 'black', // Change color on hover
                        cursor: 'default' 
                      },
                    }}
                  >
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      spaceBetween={10}
                      slidesPerView={1}
                      loop={true}
                      pagination={{ clickable: true }}
                      navigation
                      onSlideChange={() => {
                        const videos = document.querySelectorAll('video');
                        videos.forEach((video) => video.pause());

                        const audios = document.querySelectorAll('audio');
                        audios.forEach((audio) => audio.pause());
                      }}
                      style={{
                        width: '100%',
                        height: 'auto',
                        marginBottom: '2%',
                       
                      }}
                      breakpoints={{
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 10,
                        },
                        600: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 1,
                          spaceBetween: 30,
                        },
                      }}
                    >
                      {eventData?.media.map((file, index) => (
                        <SwiperSlide key={index}>
                          {file.type.startsWith('image') ? (
                            // Image rendering
                            (() => {
                              const base64String = `data:image/jpeg;base64,${file.data}`;
                              return (
                                <img
                                  src={base64String}
                                  alt={`Preview ${index}`}
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    maxHeight: '300px',
                                    borderRadius: '16px',
                                  }}
                                />
                              );
                            })()
                          ) : file.type.startsWith('video') ? (
                            // Video rendering
                            (() => {
                              const base64String = `data:video/mp4;base64,${file.data}`;
                              return (
                                <video
                                  controls
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    maxHeight: '300px',
                                    borderRadius: '16px',
                                  }}
                                >
                                  <source src={base64String} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              );
                            })()
                          ) : file.type.startsWith('audio') ? (
                            // Audio rendering
                            (() => {
                              const base64String = `data:audio/mpeg;base64,${file.data}`;
                              return (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'var(--tw-bg-light-sidebar)',
                                    borderRadius: '16px',
                                    padding: '10px',
                                  }}
                                >
                                  <img
                                    src="/images/audioFile.png"
                                    alt="Audio Thumbnail"
                                    style={{
                                      width: '40%',
                                      height: '98%',
                                      borderRadius: '8px',
                                      objectFit: 'contain',
                                      marginLeft: '2%',
                                    }}
                                  />

                                  <Box sx={{ marginLeft: '20px', flexGrow: 1 }}>
                                    <Typography variant="h6">
                                      Audio File
                                    </Typography>{' '}
                                    <audio
                                      controls
                                      style={{
                                        width: '100%',
                                        marginTop: '10px',
                                      }}
                                    >
                                      <source
                                        src={base64String}
                                        type="audio/mpeg"
                                      />
                                      Your browser does not support the audio tag.
                                    </audio>
                                  </Box>
                                </Box>
                              );
                            })()
                          ) : (
                            <div>Unsupported file format</div>
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                  {/* Display the Event Details */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: { xs: '2%', sm: '2%', md: '0', lg: '0' },
                    }}
                  >
                    <Typography variant="text1">
                      {eventData?.event?.eventName}
                    </Typography>

                    <Typography variant="text12">
                      {eventData?.event?.eventType.eventType === 'paid' ? (
                        <Chip
                          label={`₹ ${eventData?.event?.amount}`}
                          sx={{
                            backgroundColor:
                              mode === 'light'
                                ? 'var(--tw-bg-light-redBackground)'
                                : 'var(--tw-bg-dark-redBackground)', // Adjust for light and dark backgrounds
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-redText)'
                                : 'var(--tw-text-dark-redText)', // Adjust for text color in light and dark modes
                            borderRadius: '10px',
                            boxShadow: '3px 5px 9px 0px #e0e9ff', // Add shadow effect
                            height: {
                              xs: '35px',
                              sm: '35px',
                              md: '48px',
                              lg: '48px',
                            },
                            width: {
                              xs: '100px',
                              sm: '100px',
                              md: '112px',
                              lg: '112px',
                            },
                            fontSize: '1.2rem',
                            marginRight: '25px',
                          }}
                        />
                      ) : (
                        <Chip
                          label={`Free`}
                          sx={{
                            backgroundColor:
                              mode === 'light' ? '#E7F7EF' : '#E7F7EF', // Adjust for light and dark backgrounds
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-greenText)'
                                : 'var(--tw-text-light-greenText)', // Adjust for text color in light and dark modes
                            borderRadius: '10px',
                            boxShadow: '3px 5px 9px 0px #e0e9ff',
                            height: {
                              xs: '35px',
                              sm: '35px',
                              md: '48px',
                              lg: '48px',
                            },
                            width: {
                              xs: '100px',
                              sm: '100px',
                              md: '112px',
                              lg: '112px',
                            },
                            fontSize: '1.2rem',
                            marginRight: '25px',
                          }}
                        />
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      marginBottom: { xs: '1%', sm: '1%', md: '1%', lg: '1%' },
                    }}
                  >
                    <Typography variant="text12" className="form-section-title">
                      Date & Time
                    </Typography>
                    <br></br>
                    <Typography
                      variant="text4"
                      sx={{ color: 'var(--tw-text-light-redText)' }}
                    >
                      Register By:
                      {formatDate(
                        eventData?.event?.eventRegistrationDate,
                        'short'
                      )}
                    </Typography>
                  </Box>
                  <Typography
                    variant="text2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginBottom: {
                        xs: '1.5%',
                        sm: '1.5%',
                        md: '1%',
                        lg: '1%',
                      },
                    }}
                  >
                    <img
                      src={
                        mode === 'light'
                          ? '/images/date_lg.png'
                          : '/images/date_dark.png'
                      }
                      alt="Paid Event"
                    />
                    {formatDate(eventData?.event?.eventStartDate, 'long')}
                  </Typography>

                  <Typography
                    variant="text2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginBottom: {
                        xs: '1.5%',
                        sm: '1.5%',
                        md: '1%',
                        lg: '1%',
                      },
                    }}
                  >
                    <img
                      src={
                        mode === 'light'
                          ? '/images/date_lg.png'
                          : '/images/date_dark.png'
                      }
                      alt="Paid Event"
                    />
                    {formatDate(eventData?.event?.eventEndDate, 'long')}
                  </Typography>

                  <Typography
                    variant="text2"
                    sx={{ display: 'flex', alignItems: 'center', gap: '1%' }}
                  >
                    <img
                      src={
                        mode === 'light'
                          ? '/images/clock_lg.png'
                          : '/images/clock_dark.png'
                      }
                      alt="Paid Event"
                    />
                    {formatTime(eventData?.event?.eventStartTime)} -{' '}
                    {formatTime(eventData?.event?.eventEndTime)}
                  </Typography>
                  <br />
                  <Typography variant="text12" className="form-section-title">
                    Event Description:
                  </Typography>
                  <br></br>
                  <Typography variant="text5">
                    {descriptionWithCorrectedLinks}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: { xs: '5%', sm: '5%', md: '1%', lg: '1%' },
                      mt: 4,
                    }}
                  >
                

  {isAdmin ? (
    <>
      {/* Edit Button for Admin */}
      <ButtonInput
        disabled={false}
        fontWeight={600}
        text="Edit"
        type="button"
        onClick={() => {
          setEventActionType('edit event');
          setCreateEvent(true);
          router.push(`/events`);
        }}
        styles={{
          display: `${
            eventSection === 'past' || eventSection === 'deleted'
              ? 'none'
              : 'block'
          }`,
          width: 'fit-content',
          backgroundColor: mode === 'light' ? 'transparent' : 'transparent',
          color:
            mode === 'light'
              ? 'var(--tw-text-light-mainText)'
              : 'var(--tw-text-dark-mainText)',
          border:
            mode === 'light'
              ? '1px solid var(--tw-text-light-mainText)'
              : '1px solid var(--tw-text-dark-mainText)',
        }}
      />
      {/* Delete Button for Admin */}
      <ButtonInput
        disabled={false}
        fontWeight={600}
        text="Delete"
        type="submit"
        onClick={() => {
          setDeleteAction('Delete');
          setOpenDialog(true);
        }}
        styles={{
          width: 'fit-content',
          backgroundColor:
            mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
          color:
            mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)',
        }}
      />
    </>
  ) : (
    // For Non-Admin Users: Register button if paid, other button otherwise

    eventData?.event?.eventType.eventType === 'paid' ? (
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'5px'}}>
      {eventData?.event?.maxPeopleAllowed===(eventData?.registeredMembersCount).toString()  && (
        <Typography variant="text8" color="#E41D1D" fontWeight={600}>You cant register as the event is already full</Typography>
      )} 
    <ButtonInput
    disabled={eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() || eventSection === 'past' || membershipStatus === 'unpaid'}
    fontWeight={600}
    text={eventData?.hasPaid ? "Registered" : ((eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString()) && (membershipStatus === 'paid') ) ? "Register" : (membershipStatus === 'paid') ? "Pay Now" : "Register"}
    type="button"
    onClick={() => setOpenJoinModal(true)}
    styles={{
      width: 'fit-content',
      backgroundColor: eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() || eventSection === 'past' || membershipStatus === 'unpaid'
        ? '#9C9AA5'  // Gray color when registered or full
        : (mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'),
      color: eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() || eventSection === 'past'
        ? (mode === 'light' ? 'white' : 'black')  // White text in light mode, black in dark mode for Registered/Full state
        : (mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'),
      borderRadius: '8px',  // To match rounded style
      
      padding: '10px 20px',
      boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.4)',  // Light blue shadow for active state
    }}
  />

      </Box>
    ) : (
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'5px'}}> 
      {eventData?.event?.maxPeopleAllowed===(eventData?.registeredMembersCount).toString() && (
        <Typography variant="text8" color="#E41D1D" fontWeight={600}>You cant register as the event is already full</Typography>
      )} 
    <Box sx={{ display: 'flex', gap: 2 }}>
    <ButtonInput
      disabled={eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() || eventSection === 'past' || membershipStatus === 'unpaid'}
      fontWeight={600}
      text={eventData?.hasPaid ? "Registered" : (eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() && (membershipStatus === 'paid')) ? "Register" : ((membershipStatus === 'paid')) ? "Register"  : "Register"}
      type="button"
      onClick={() => {
        // Define the action for the Learn More button here
        setOpenJoinModal(true);
      }}
      styles={{
        width: 'fit-content',
        backgroundColor: eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString()  || eventSection === 'past' || membershipStatus === 'unpaid'
          ? '#9C9AA5'  // Gray color for Registered or Full state
          : (mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'),
        color: eventData?.hasPaid || eventData?.event?.maxPeopleAllowed === (eventData?.registeredMembersCount).toString() || eventSection === 'past'
          ? (mode === 'light' ? 'white' : 'black')  // White in light mode, black in dark mode for Registered/Full state
          : (mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'),
        borderRadius: '8px',  // To match rounded style
        padding: '10px 20px',
        boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.4)',  // Light blue shadow for active state
      }}
    />
      {/* Conditionally Render Donate Button for Free Events */}
    {eventData?.event?.acceptDonation && (
      <ButtonInput
        fontWeight={600}
        disabled={eventSection==='past'}
        text="Donate Now"
        type="button"
        onClick={() => setOpenDonationModal(true)} 
        styles={{
          width: 'fit-content',
          backgroundColor: 'transparent',
          color: mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
          border: `1px solid ${mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'}`,
          boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.4)', // Light blue shadow
          '&:hover': {
            backgroundColor: mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)',
            color: mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)',
            boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.6)', // Slightly stronger shadow on hover
          },
        }}
      />
    )}
  </Box>
      </Box>
    )
  )}

                    
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          <ConfirmBoxModel
            open={openDialog}
            title="Confirm Deletion"
            description="Are you sure you want to delete this event?"
            onAgree={handleDelete} // Call handleDelete on confirmation
            onDisagree={() => setOpenDialog(false)} // Close dialog on cancel
            onClose={() => setOpenDialog(false)} // Close dialog on background click
            agreeText="Yes, Delete"
            disagreeText="No, Cancel"
          />
      <JoinEventModal
    open={openJoinModal}
    onClose={() => setOpenJoinModal(false)}
    amountPerPerson={eventData?.event?.amount || 0} // Pass amount per person if available
    eventId={eventData?.event?.id || params.eventId} // Pass event ID
    eventType={eventData?.event?.eventType.eventType } // Pass event type, replace 'default-type' with a fallback if necessary
    allowFamilyFriends = {eventData?.event?.allowFamilyandFriends}
    eventName= {eventData?.event?.eventName}
    remainingCapacity= {remainingCapacity}
    chargePerPerson = {eventData?.event?.ChargePerPerson}
  />

  <DonationModal open={openDonationModal} onClose={handleCloseDonationModal} eventId={eventData?.event?.eventId} eventName={eventData?.event?.eventName}/>

        </Box>
      </Box>
    );
  };

  export default DisplayEvent;
