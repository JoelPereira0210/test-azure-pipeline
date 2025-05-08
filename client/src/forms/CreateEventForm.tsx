'use client'; //test to see if edit-event working
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  useTheme,
  Typography,
  Chip,
  useMediaQuery,
} from '@mui/material';
import CreateEventTab from '../component/Tabs/CreateEventTab'; // Import the Tabs component

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { EventContext } from '../component/context/EventContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../lib/zod/event';
import EventFileDropZone from '../component/UI/DropZone/EventFileDropZone'; // Adjust the path as needed
import { fileToBase64 } from '../utils/auth';
import { createEventAction } from '../actions/createevent';
import { updateEventAction } from '../actions/createevent';
import { fetchEvent } from '../actions/createevent';
import InputField from '@/src/component/UI/InputField/InputField';
import TextArea from '../component/UI/TextArea/TextArea';
import TextEditor from '../component/UI/TextEditor/TextEditor';
import CheckboxInput from '../component/UI/Checkbox/checkbox';
import ButtonInput from '../component/UI/Button/Button';
import DatePickerField from '../component/UI/DatePickerField/DatePickerField';
import TimePickerField from '../component/UI/TimePicker/TimePickerField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CreateEventType } from '@/src/lib/types/createEvent.types';
import { fetchBankDetails } from '../actions/profile';
import ConfirmBoxModel from '../component/UI/Popup/ConfirmBoxModel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { time } from 'console';

dayjs.extend(utc);
// interface CreateEventType {
//     eventName: string;
//     eventDescription: string;
//     registrationDueDate: string;
//     eventStartDate: string;
//     eventEndDate: string;
//     eventStartTime: string;
//     eventEndTime: string;
//     eventType: string;
//     allowFamilyAndFriends: boolean;
//     uploadedFiles: string[]; // Assuming base64 files are strings
//     isDeleted: boolean;
//     maxAttendees: number | null;
//     shouldPublish: boolean | null;
//     encryptedSocietyId: string | null;
//     amountPerPerson?: number; // Optional
//     ChargePerPerson?: boolean; // Optional
//     acceptDonation?: boolean; // Optional
// }

const CreateEventForm = () => {
  const {
    setCreateEvent,
    setEventActionType,
    eventId,
    setEventId,
    eventActionType,
  } = useContext(EventContext);
  const [step, setStep] = useState(1); //switch between tabs
  const [base64Files, setBase64Files] = useState([]); // Store converted base64 files

  const [combinedMediaData, setCombinedMediaData] = useState([]);
  const [timeError, setTimeError] = useState('');
  const [eventtype, setEventType] = useState('free');
  const [isPublishing, setIsPublishing] = useState(null);
  const [checkIfPublished, setCheckIfPublished] = useState(null);

  const [isDeleted, setIsDeleted] = useState('NOT_DELETED');
  const [bankDetailsAvailable, setBankDetailsAvailable] = useState(false); // State for bank details

  //   const [registrationDueDate, setRegistrationDueDate] = useState(null); // Track registration due date
  const [registrationCount, setRegistrationCount] = useState(1); // Track registration due date

  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const mode = theme.palette.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // This will return true if the screen size is small or extra small

  const CreateEventSchema = eventSchema(registrationCount);

  const methods = useForm({
    resolver: zodResolver(CreateEventSchema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    control,
    setValue, // To set default values
    formState: { errors },
    trigger,
    watch,
  } = methods;

  const formatTimeTo12Hour = (time24) => {
    if (!time24) {
      return 'Invalid time';
    }
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12; // Adjust hour to 12-hour format
    return `${adjustedHour}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (eventActionType === 'edit event' && eventId) {
      (async () => {
        try {
          const existingEvent = await fetchEvent(eventId); // Fetch event data
          console.log('Fetched event data for edit: ', existingEvent);

          // Set the basic fields
          setValue('eventName', existingEvent.event.eventName);
          setValue('eventDescription', existingEvent.event.eventDescription);
          setCheckIfPublished(existingEvent.event.shouldPublish);

          // Set the dates and times, ensuring correct formatting for your components
          setValue(
            'eventStartDate',
            dayjs(existingEvent.event.eventStartDate).format('YYYY-MM-DD')
          );
          setValue(
            'eventEndDate',
            dayjs(existingEvent.event.eventEndDate).format('YYYY-MM-DD')
          );
          setValue(
            'registrationDueDate',
            dayjs(existingEvent.event.eventRegistrationDate).format(
              'YYYY-MM-DD'
            )
          );

          setValue(
            'eventStartTime',
            dayjs.utc(existingEvent.event.eventStartTime).format('HH:mm')
          );
          setValue(
            'eventEndTime',
            dayjs.utc(existingEvent.event.eventEndTime).format('HH:mm')
          );

          // Handle event type and conditional fields
          const eventType = existingEvent.event.eventType.eventType;
          setEventType(eventType); // Set the event type in state
          setValue('eventType', eventType);
          setRegistrationCount(existingEvent.registeredMembersCount);
          // Set fields conditionally based on event type
          setValue('maxAttendees', existingEvent.event.maxPeopleAllowed || '');
          setValue(
            'allowFamilyAndFriends',
            existingEvent.event.allowFamilyandFriends || false
          );

          if (eventType === 'paid') {
            setValue('amountPerPerson', existingEvent.event.amount || '');
            setValue(
              'ChargePerPerson',
              existingEvent.event.ChargePerPerson || false
            );
          } else if (eventType === 'free') {
            setValue(
              'acceptDonation',
              existingEvent.event.acceptDonation || false
            );
          }

          // Handling uploads
          const mediaFiles = existingEvent.media || [];

          const base64Media = mediaFiles.map((file) => file.data);
          setBase64Files(base64Media); // Set the base64 data for uploads

          const combinedMedia = mediaFiles.map((file) => ({
            id: file.id, // Media ID
            data: file.data, // Base64 media data
          }));

          setCombinedMediaData(combinedMedia);
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      })();
    } else if (eventActionType === 'copy event' && eventId) {
      (async () => {
        try {
          const existingEvent = await fetchEvent(eventId); // Fetch event data
          console.log('Fetched event data for edit: ', existingEvent);

          // Set the basic fields
          setValue('eventName', existingEvent.event.eventName);
          setValue('eventDescription', existingEvent.event.eventDescription);

          // Handle event type and conditional fields
          const eventType = existingEvent.event.eventType.eventType;
          setEventType(eventType); // Set the event type in state
          setValue('eventType', eventType);

          // Set fields conditionally based on event type
          setValue('maxAttendees', existingEvent.event.maxPeopleAllowed || '');
          setValue(
            'allowFamilyAndFriends',
            existingEvent.event.allowFamilyandFriends || false
          );

          if (eventType === 'paid') {
            setValue('amountPerPerson', existingEvent.event.amount || '');
            setValue(
              'ChargePerPerson',
              existingEvent.event.ChargePerPerson || false
            );
          } else if (eventType === 'free') {
            setValue(
              'acceptDonation',
              existingEvent.event.acceptDonation || false
            );
          }

          // Handling uploads
          const mediaFiles = existingEvent.media || [];

          const base64Media = mediaFiles.map((file) => file.data);
          setBase64Files(base64Media); // Set the base64 data for uploads

          const combinedMedia = mediaFiles.map((file) => ({
            id: file.id, // Media ID
            data: file.data, // Base64 media data
          }));

          setCombinedMediaData(combinedMedia);
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      })();
    }
  }, [eventActionType, eventId, setValue]);

  const onSubmit = async (data: any) => {
    const eventStartDate = new Date(`${data.eventStartDate}`); //DD-MM-YYYY
    const eventEndDate = new Date(`${data.eventEndDate}`); //DD-MM-YYYY
    const registrationDueDate = new Date(`${data.registrationDueDate}`); //DD-MM-YYYY

    const formattedEventStartDate = eventStartDate.toISOString(); //2024-09-17T00:00:00.000Z
    const formattedEventEndDate = eventEndDate.toISOString(); //2024-09-17T00:00:00.000Z
    const formattedRegistrationDueDate = registrationDueDate.toISOString(); //2024-09-17T00:00:00.000Z

    const eventStartDateTime = new Date(
      `${data.eventStartDate}T${data.eventStartTime}:00+00:00`
    ); //Tue Sep 17 2024 21:09:00 GMT+0530 (India Standard Time)
    const eventEndDateTime = new Date(
      `${data.eventEndDate}T${data.eventEndTime}:00+00:00`
    ); //Sat Sep 21 2024 00:15:00 GMT+0530 (India Standard Time)

    // Convert to UTC (ISO string format)
    const formattedeventStartTime = eventStartDateTime.toISOString(); // Converted to UTC  //2024-09-17T15:39:00.000Z
    const formattedeventEndTime = eventEndDateTime.toISOString(); // Converted to UTC // 2024-09-20T18:45:00.000Z

    let payload: CreateEventType = {
      eventName: data.eventName,
      eventDescription: data.eventDescription,
      registrationDueDate: formattedRegistrationDueDate,
      eventStartDate: formattedEventStartDate,
      eventEndDate: formattedEventEndDate,
      eventStartTime: formattedeventStartTime,
      eventEndTime: formattedeventEndTime,
      eventType: data.eventType,
      allowFamilyAndFriends: data.allowFamilyAndFriends,
      uploadedFiles: base64Files,
      // uploadedFiles: newBase64Files,

      isDeleted: isDeleted,
      maxAttendees: data.maxAttendees,
      shouldPublish: isPublishing,
      encryptedSocietyId: localStorage.getItem('societyId'),
    };

    if (data.eventType === 'paid') {
      payload = {
        ...payload,
        amountPerPerson: data?.amountPerPerson,
        ChargePerPerson: data?.ChargePerPerson,
      };
    }

    if (data.eventType === 'free') {
      payload = {
        ...payload,
        acceptDonation: data.acceptDonation,
      };
    }

    console.log(payload); //display to be sent data

    try {
      if (eventActionType === 'edit event') {
        // console.log("btn to send patch clicked");

        // Use PATCH for updating event
        const res = await updateEventAction(eventId, payload);
        if (res.status === 200) {
          console.log('Event updated successfully:', res.data);
        }
      } else {
        // Creating new event
        console.log('btn to send create event clicked');
        const res = await createEventAction(payload);
        if (res.status === 200) {
          console.log('Event created successfully:', res.data);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setCreateEvent(false);
  };

  const validateStep = async (currentStep) => {
    if (currentStep === 1) {
      return await trigger([
        'eventName',
        'eventDescription',
        'registrationDueDate',
        'eventStartDate',
        'eventEndDate',
        'eventStartTime',
        'eventEndTime',
      ]);
    } else if (currentStep === 2) {
      return await trigger(['uploadedFiles']);
    } else if (currentStep === 3) {
      const isValid = await trigger('eventType');
      if (!isValid) return false;

      const eventType = watch('eventType'); // Get event type value
      if (eventType === 'paid') {
        const maxAttendeesValid = await trigger('maxAttendees');
        const amountPerPersonValid = await trigger('amountPerPerson');
        return maxAttendeesValid && amountPerPersonValid;
      } else if (eventType === 'free') {
        return await trigger('maxAttendees');
      }
    }
    return true;
  };

  const handleStepChange = async (newStep) => {
    // Validate current step before moving to the new step
    const isStepValid = await validateStep(step);

    if (!validateEndTime()) {
      return; // Stop form progression
    }

    if (isStepValid) {
      setStep(newStep);
    }
  };

  const handleNextStep = () => handleStepChange(step + 1); // Move to next step

  const handleFiles = async (files: File[]) => {
    const fileDataWithId = await Promise.all(
      files.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
          data: base64Data, // Base64 encoded file data
          mediaId: (file as any).mediaId, // Media ID from file object
        };
      })
    );

    setBase64Files(fileDataWithId); // Store objects with base64 data and mediaId
  };

  // useEffect to trigger form submission after isPublishing changes
  useEffect(() => {
    if (isPublishing !== null) {
      handleSubmit(onSubmit)();
    }
  }, [isPublishing]);

  const handlePublishEvent = (e: any) => {
    e.preventDefault();
    setIsPublishing(true); // This will trigger the useEffect to submit the form
  };

  const handleSaveDraft = (e: any) => {
    e.preventDefault();
    setIsPublishing(false); // This will trigger the useEffect to submit the form
  };

  console.log('error are here ', errors);
  console.log(watch('eventStartTime'));
  console.log(watch('eventEndTime'));

  const validateEndTime = () => {
    const validatestartDate = watch('eventStartDate');
    const validateEndDate = watch('eventEndDate');
    const validateStartTime = watch('eventStartTime');
    const validateEndTime = watch('eventEndTime');
    console.log(validatestartDate);
    console.log(validateEndDate);
    console.log(validateStartTime);
    console.log('validateEndTime', validateEndTime);

    // if (validatestartDate === validateEndDate) {
    //   console.log('same day event');
    //   //   console.log("formated time ",validateEndTime.format('HH:mm'));
    //   //   if((validateEndTime).format('HH:mm'))
    // }
    if (validatestartDate === validateEndDate) {
      console.log('same day event');

      // Parse the time strings into date objects for comparison
      const startTime = new Date(`1970-01-01T${validateStartTime}:00`);
      const endTime = new Date(`1970-01-01T${validateEndTime}:00`);

      if (startTime >= endTime) {
        setTimeError(
          'End time should be after the start time for a same-day event'
        );
        console.error(
          'End time should be after the start time for a same-day event'
        );
        console.log(
          'End time should be after the start time for a same-day event'
        );

        return false;
      } else {
        console.log('DONE');
        setTimeError('');
        return true;
      }
    } else {
      setTimeError('');
      return true;
    }
  };

  // Fetch bank details on load
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const bankDetails = await fetchBankDetails();
        if (bankDetails) {
          setBankDetailsAvailable(true);
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };
    fetchDetails();
  }, []);





  // console.log('registrationCount', registrationCount);


  return (
    <Box sx={{ textAlign: 'left' }} className="custom-container">
      <FormProvider {...methods}>
        <Box className="form-container">
          {isMobile && (
            <>
              <ArrowBackIcon
                fontSize="large"
                onClick={() => setCreateEvent(false)}
              />{' '}
              <br />
            </>
          )}
          <CreateEventTab step={step} setStep={handleStepChange} />

          <form>
            {step === 1 && (
              <Box className="event-details-container">
                <Box className="form-section">
                  <Typography
                    variant="text12"
                    className="form-section-title"
                    sx={{
                      color: `${mode === 'light'
                        ? 'var(--tw-text-light-mainText)'
                        : 'var(--tw-text-dark-mainText)'
                        }`,
                    }}
                  >
                    Event Details
                  </Typography>

                  <Box className="input-group" sx={{ marginTop: '2%' }}>
                    <Controller
                      name="eventName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Event Name"
                          type="text"
                          required={true}
                          errorMessage={
                            errors.eventName
                              ? String(errors.eventName.message)
                              : undefined
                          }
                          // error={errors.eventName?.message}

                          // error={errors.eventName ? String(errors.eventName.message) : undefined}
                          id="eventName"
                          className="form-input"
                          placeholder="Enter the Name of the Events"
                          style={{
                            color: `${mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-light-smallText)'
                              }`,
                            backgroundColor: `${mode === 'light'
                              ? 'var(--tw-bg-light-background)'
                              : 'var(--tw-bg-dark-background)'
                              }`,
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box className="input-group">
                    <Controller
                      name="eventDescription"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextEditor
                          {...field} // Spread the field to pass value and onChange
                          label="Event Description"
                          required={true}
                          // errorMessage={errors.eventDescription?.message}
                          errorMessage={
                            errors.eventDescription
                              ? String(errors.eventDescription.message)
                              : undefined
                          }
                          style={{
                            color: `${mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-light-smallText)'
                              }`,
                            backgroundColor: `${mode === 'light'
                              ? 'var(--tw-bg-light-background)'
                              : 'var(--tw-bg-dark-background)'
                              }`,
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>

                {/* Date & Time Section */}
                <Box className="form-section" style={{ marginTop: '3%' }}>
                  <Typography
                    variant="text12"
                    className="form-section-title"
                    sx={{
                      color: `${mode === 'light'
                        ? 'var(--tw-text-light-mainText)'
                        : 'var(--tw-text-dark-mainText)'
                        }`,
                    }}
                  >
                    Date & Time
                  </Typography>
                  <Box className="input-group" sx={{ marginTop: '2%' }}>
                    <Controller
                      name="registrationDueDate"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <DatePickerField
                          {...field}
                          label="Registration Due Date"
                          required={true}
                          // error={errors.registrationDueDate?.message}
                          error={
                            errors.registrationDueDate
                              ? String(errors.registrationDueDate.message)
                              : undefined
                          }
                          value={field.value || ''}
                          minDate={dayjs()}
                          maxDate={
                            watch('eventStartDate')
                              ? dayjs(watch('eventStartDate'))
                              : null
                          }
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            trigger('registrationDueDate');
                            //   setRegistrationDueDate(newValue);
                          }} // Pass the onChange handler
                          style={{
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-mainText)'
                                : 'var(--tw-text-light-smallText)',
                            backgroundColor:
                              mode === 'light'
                                ? 'var(--tw-bg-light-background)'
                                : 'var(--tw-bg-dark-background)',
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Box className="date-time-row">
                  <Box className="input-group">
                    <Controller
                      name="eventStartDate"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <DatePickerField
                          {...field}
                          label="Event Start Date"
                          required={true}
                          error={
                            errors.eventStartDate
                              ? String(errors.eventStartDate.message)
                              : undefined
                          }
                          // error={errors.eventStartDate?.message}
                          value={field.value || ''}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            trigger('eventStartDate');
                            validateEndTime();
                            //   setEventStartDate(newValue);
                          }} // Pass the onChange handler
                          //   minDate={
                          //       registrationDueDate
                          //           ? dayjs(registrationDueDate)
                          //           : null
                          //   }
                          minDate={
                            watch('registrationDueDate')
                              ? dayjs(watch('registrationDueDate'))
                              : dayjs()
                          }
                          maxDate={
                            watch('eventEndDate')
                              ? dayjs(watch('eventEndDate'))
                              : null
                          }
                          style={{
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-mainText)'
                                : 'var(--tw-text-light-smallText)',
                            backgroundColor:
                              mode === 'light'
                                ? 'var(--tw-bg-light-background)'
                                : 'var(--tw-bg-dark-background)',
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box className="input-group">
                    <Controller
                      name="eventEndDate"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <DatePickerField
                          {...field}
                          label="Event End Date"
                          required={true}
                          error={
                            errors.eventEndDate
                              ? String(errors.eventEndDate.message)
                              : undefined
                          }
                          // error={errors.eventEndDate?.message}
                          value={field.value || ''}
                          //   minDate={
                          //       eventStartDate
                          //           ? dayjs(eventStartDate)
                          //           : null
                          //   }
                          minDate={
                            watch('eventStartDate')
                              ? dayjs(watch('eventStartDate'))
                              : dayjs()
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            trigger('eventEndDate');
                            validateEndTime();
                          }}
                          // Pass the onChange handler
                          style={{
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-mainText)'
                                : 'var(--tw-text-light-smallText)',
                            backgroundColor:
                              mode === 'light'
                                ? 'var(--tw-bg-light-background)'
                                : 'var(--tw-bg-dark-background)',
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Box className="date-time-row">
                  <Box className="input-group">
                    <Controller
                      name="eventStartTime"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TimePickerField
                          {...field}
                          label="Event Start Time"
                          required={true}
                          error={
                            errors.eventStartTime
                              ? String(errors.eventStartTime.message)
                              : undefined
                          }
                          // error={errors.eventStartTime?.message}
                          value={field.value} // Pass the controlled value
                          onChange={(e) => {
                            // field.onChange;
                            field.onChange(e);
                            trigger('eventStartTime');
                            validateEndTime();
                          }}
                          disabled={false}
                          // infoText="Please select the start time"
                          style={{
                            color: `${mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-light-smallText)'
                              }`,
                            backgroundColor: `${mode === 'light'
                              ? 'var(--tw-bg-light-background)'
                              : 'var(--tw-bg-dark-background)'
                              }`,
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box className="input-group">
                    <Controller
                      name="eventEndTime"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TimePickerField
                          {...field}
                          label="Event End Time"
                          required={true}
                          // error={errors.eventEndTime?.message}
                          error={
                            // errors.eventEndTime
                            //   ? String(errors.eventEndTime.message)
                            //   : undefined
                            errors?.eventEndTime
                              ? String(errors.eventEndTime.message)
                              : timeError
                                ? timeError
                                : undefined
                          }
                          value={field.value} // Pass the controlled value
                          onChange={(e) => {
                            // field.onChange;
                            field.onChange(e);
                            trigger('eventEndTime');
                            validateEndTime();
                          }}
                          // Handle change
                          disabled={false}
                          minTime={
                            watch('eventStartTime')
                              ? dayjs(watch('eventStartTime')).add(1, 'hour')
                              : null
                          }
                          // minTime={ dayjs("06:30") }
                          // infoText="Please select the start time"
                          style={{
                            color: `${mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-light-smallText)'
                              }`,
                            backgroundColor: `${mode === 'light'
                              ? 'var(--tw-bg-light-background)'
                              : 'var(--tw-bg-dark-background)'
                              }`,
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box className="form-section">
                <Paper
                  elevation={4}
                  sx={{
                    width: '98%',
                    padding: '1.5%',
                    borderRadius: '16px',
                    backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'
                      }`,
                  }}
                >
                  <EventFileDropZone
                    name="uploadedFiles"
                    label="Upload Images, Videos and Audio"
                    FileSize={10} // Max file size for videos (e.g., 20MB)
                    MaxFiles={3} // Maximum number of files (adjust as needed)
                    InitialFiles={combinedMediaData} // Pass preloaded base64 files here
                    // MediaId={mediaId}

                    //   eventId ={eventId}
                    filesAccepted={{
                      'image/*': [],
                      'video/*': [],
                      'audio/*': [],
                    }} // Accept both image and video files
                    onChange={(files) => {
                      console.log(files);
                      handleFiles(files); // Process uploaded files
                      //   setValue("uploadedFiles", files); // Update form state with uploaded files
                    }}
                  />
                </Paper>
              </Box>
            )}

            {step === 3 && (
              <Box className="form-section">
                <Box className="input-group">
                  <Controller
                    name="eventType"
                    control={control}
                    defaultValue="free"
                    render={({ field }) => (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          marginBottom: '20px',
                          gap: '5%',
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            field.onChange('paid');
                            setEventType('paid');
                          }}
                          disabled={
                            ((eventActionType === 'edit event' &&
                              eventtype === 'free') || !bankDetailsAvailable)
                          }
                          sx={{
                            width: {
                              lg: '29%',
                              md: '29%',
                              sm: '50%',
                              xs: '80%',
                            },
                            height: {
                              lg: 'auto',
                              md: 'auto',
                              sm: '5rem',
                              xs: '5rem',
                            },
                            marginRight: '10px',
                            color:
                              field.value === 'paid'
                                ? mode === 'light'
                                  ? 'black'
                                  : 'white'
                                : '#9C9AA5',
                            backgroundColor:
                              field.value === 'paid'
                                ? mode === 'light'
                                  ? 'transparent'
                                  : 'transparent'
                                : mode === 'light'
                                  ? 'transparent'
                                  : 'transparent',
                            borderColor:
                              field.value === 'paid'
                                ? mode === 'light'
                                  ? 'black'
                                  : 'white'
                                : '#9C9AA5',
                            // opacity: 0.5, // Add opacity for disabled button
                            boxShadow:
                              field.value === 'paid'
                                ? '0px 4px 8px 5px rgba(0, 0, 255, 0.1)' // Add shadow to highlight the selected option
                                : 'none',
                          }}
                        >

                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={
                                mode === 'light'
                                  ? '/images/eventPaidIcon_lg.png'
                                  : '/images/eventPaidIcon_Dark.png'
                              }
                              alt="Paid Event"
                              sx={{
                                marginBottom: '2%',
                                marginTop: '5%',
                                width: { xs: 32, sm: 32, md: 65, lg: 65 },
                                height: { xs: 32, sm: 32, md: 65, lg: 65 },
                              }}
                            />
                            <Typography
                              variant="text2"
                              sx={{
                                textTransform: 'none',

                                fontSize: {
                                  xs: '0.75rem',
                                  sm: '0.75rem',
                                  md: '1rem',
                                  lg: '1rem',
                                },
                              }}
                            >
                              Paid Event
                            </Typography>
                            <Typography
                              variant="text6"
                              sx={{
                                textTransform: 'none',

                                fontSize: {
                                  xs: '0.5rem',
                                  sm: '0.5rem',
                                  md: '1rem',
                                  lg: '1rem',
                                },
                                fontWeight: {
                                  xs: 400,
                                  sm: 400,
                                  md: 300,
                                  lg: 300,
                                },
                              }}
                            >
                              Event requires tickets for entry
                            </Typography>
                          </Box>
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => {
                            field.onChange('free');
                            setEventType('free');
                            setValue('amountPerPerson', '');
                          }}
                          disabled={
                            eventActionType === 'edit event' &&
                            eventtype === 'paid'
                          }
                          sx={{
                            width: {
                              lg: '29%',
                              md: '29%',
                              sm: '50%',
                              xs: '80%',
                            },
                            height: {
                              lg: 'auto',
                              md: 'auto',
                              sm: '5rem',
                              xs: '5rem',
                            },
                            marginRight: '10px',
                            color:
                              field.value === 'free'
                                ? mode === 'light'
                                  ? 'black'
                                  : 'white'
                                : '#9C9AA5',
                            backgroundColor:
                              field.value === 'free'
                                ? mode === 'light'
                                  ? 'transparent'
                                  : 'transparent'
                                : mode === 'light'
                                  ? 'transparent'
                                  : 'transparent',
                            borderColor:
                              field.value === 'free'
                                ? mode === 'light'
                                  ? 'black'
                                  : 'white'
                                : '#9C9AA5',
                            boxShadow:
                              field.value === 'free'
                                ? '0px 4px 8px 5px rgba(0, 0, 255, 0.1)' // Add shadow to highlight the selected option
                                : 'none',
                          }}
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={
                                mode === 'light'
                                  ? '/images/eventFreeIcon_lg.png'
                                  : '/images/eventFreeIcon_Dark.png'
                              }
                              alt="Free Event"
                              sx={{
                                marginBottom: '2%',
                                marginTop: '5%',
                                width: { xs: 35, sm: 35, md: 65, lg: 65 },
                                height: { xs: 35, sm: 35, md: 65, lg: 65 },
                              }}
                            />
                            <Typography
                              variant="text2"
                              sx={{
                                textTransform: 'none',

                                fontSize: {
                                  xs: '0.75rem',
                                  sm: '0.75rem',
                                  md: '1rem',
                                  lg: '1rem',
                                },
                              }}
                            >
                              Free Event
                            </Typography>
                            <Typography
                              variant="text6"
                              sx={{
                                textTransform: 'none',
                                fontSize: {
                                  xs: '0.5rem',
                                  sm: '0.5rem',
                                  md: '1rem',
                                  lg: '1rem',
                                },
                                fontWeight: {
                                  xs: 400,
                                  sm: 400,
                                  md: 300,
                                  lg: 300,
                                },
                              }}
                            >
                              No ticket required
                            </Typography>
                          </Box>
                        </Button>
                      </Box>
                    )}
                  />
                  {errors?.eventType && (
                    <Typography className="error">
                      {typeof errors.eventType.message === 'string'
                        ? errors.eventType.message
                        : ''}
                    </Typography>
                  )}
                  {!bankDetailsAvailable && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', marginTop: '8px' }}
                    >
                      Bank details are required to create a Paid Event. Please update your bank details.
                    </Typography>
                  )}
                </Box>

                {/* Conditional Fields for Paid Event */}
                {(eventtype === 'paid' || watch('eventType') === 'paid') && (
                  <>
                    <Box
                      sx={{
                        marginTop: 2,
                        marginRight: '2%',
                        display: 'flex',
                        flexDirection: {
                          lg: 'row',
                          md: 'row',
                          sm: 'column',
                          xs: 'column',
                        },
                        gap: '5.5%',
                      }}
                    >
                      <Box
                        sx={{
                          width: {
                            lg: '30%',
                            md: '100%',
                            xs: '100%',
                          },
                        }}
                      >
                        <Controller
                          name="maxAttendees"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label="Max number of people for event"
                              type="number"
                              required={true}

                              // errorMessage={errors.maxAttendees?.message}
                              errorMessage={
                                errors.maxAttendees
                                  ? String(errors.maxAttendees.message)
                                  : undefined
                              }
                            />
                          )}
                        />
                      </Box>

                      <Box
                        sx={{
                          width: {
                            lg: '30%',
                            md: '100%',
                            xs: '100%',
                          },
                        }}
                      >
                        <Controller
                          name="amountPerPerson"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label="Amount Per Person (₹)"
                              type="number"
                              required={true}
                              // errorMessage={errors.amountPerPerson?.message}
                              errorMessage={
                                errors.amountPerPerson
                                  ? String(errors.amountPerPerson.message)
                                  : undefined
                              }
                              disabled={
                                eventActionType === 'edit event' &&
                                eventtype === 'paid'
                              }
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  </>
                )}

                {/* Conditional Fields for Free Event */}
                {(eventtype === 'free' || watch('eventType') === 'free') && (
                  <Box
                    sx={{
                      marginTop: 2,
                      marginRight: '2%',
                      display: 'flex',
                      flexDirection: {
                        lg: 'row',
                        md: 'row',
                        sm: 'column',
                        xs: 'column',
                      },
                      gap: '2%',
                    }}
                  >
                    <Box
                      sx={{
                        width: {
                          lg: '30%',
                          md: '100%',
                          xs: '100%',
                        },
                      }}
                    >
                      <Controller
                        name="maxAttendees"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <InputField
                            {...field}
                            label="Max number of people for event"
                            type="number"
                            required={true}
                            // errorMessage={errors.maxAttendees?.message}
                            errorMessage={
                              errors.maxAttendees
                                ? String(errors.maxAttendees.message)
                                : undefined
                            }
                          />
                        )}
                      />
                    </Box>
                  </Box>
                )}

                {eventtype == 'free' && (
                  <Controller
                    name="acceptDonation"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Box display="flex" alignItems="center">
                        <CheckboxInput
                          {...field}
                          label="Accept Donations"
                          id="acceptDonation"
                          classes=""
                          checked={field.value}
                          disabled={!bankDetailsAvailable}
                          color={!bankDetailsAvailable ? 'error' : 'default'}
                        />
                        {!bankDetailsAvailable && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'red',
                              marginTop: '8px',
                            }}
                          >
                            Bank details are required to enable donations. Please update your bank details.
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                )}


                <Box className="input-group" >
                  <Controller
                    name="allowFamilyAndFriends"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Box display="flex" alignItems="center">
                        <CheckboxInput
                          {...field}
                          label="Allow Family And Friends"
                          id="allowFamilyAndFriends"
                          classes=""
                          checked={field.value}
                        // onChange={(value) => field.onChange(value)} 
                        />
                      </Box>
                    )}
                  />
                </Box>


                {watch('allowFamilyAndFriends') && eventtype == 'paid' && (
                  <Box>
                    <Controller
                      name="ChargePerPerson"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Box display="flex" alignItems="center">
                          <CheckboxInput
                            label="Charge Per Person"
                            id="ChargePerPerson"
                            classes=""
                            checked={field.value}
                            {...field}

                          />
                        </Box>
                      )}
                    />
                  </Box>
                )}
              </Box>
            )}
            {step === 4 && (
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
                  }}
                >
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
                      '& .swiper-button-next, .swiper-button-prev': {
                        color: `${mode === 'light'
                          ? 'var(--tw-bg-dark-background)'
                          : 'var(--tw-bg-light-background)'
                          }`,
                      },
                      '& .swiper-button-next:hover, .swiper-button-prev:hover':
                      {
                        color: 'black', // Change color on hover
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
                      {watch('uploadedFiles') &&
                        watch('uploadedFiles').map((file, index) => (
                          <SwiperSlide key={index}>
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'contain',
                                  maxHeight: '300px',
                                  borderRadius: '16px',
                                }}
                              />
                            ) : file.type.startsWith('video/') ? (
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
                                <source
                                  src={URL.createObjectURL(file)}
                                  type={file.type}
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : file.type.startsWith('audio/') ? (
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

                                {/* File Name and Audio Player */}
                                <Box sx={{ marginLeft: '20px', flexGrow: 1 }}>
                                  <Typography variant="h6">
                                    {file.name}
                                  </Typography>{' '}
                                  <audio
                                    controls
                                    style={{
                                      width: '100%',
                                      marginTop: '10px',
                                    }}
                                  >
                                    <source
                                      src={URL.createObjectURL(file)}
                                      type={file.type}
                                    />
                                    Your browser does not support the audio tag.
                                  </audio>
                                </Box>
                              </Box>
                            ) : (
                              <div>Unsupported file format</div>
                            )}
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </Box>
                  {/* Display the Event Details */}
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="text1">
                      {watch('eventName')}
                    </Typography>

                    <Typography variant="text12">
                      {watch('amountPerPerson') ? (
                        <Chip
                          label={`₹ ${watch('amountPerPerson')}`}
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
                            boxShadow: '3px 5px 9px 0px #e0e9ff',
                            height: { md: '48px' },
                            width: { md: '112px' },
                            fontSize: '1.2rem',
                          }}
                        />
                      ) : (
                        <Chip
                          label={`Free`}
                          sx={{
                            backgroundColor:
                              mode === 'light' ? '#E7F7EF' : '#E7F7EF',
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-greenText)'
                                : 'var(--tw-text-light-greenText)',
                            borderRadius: '10px',
                            boxShadow:
                              mode === 'light'
                                ? '3px 5px 9px 0px #e0e9ff'
                                : '1px 1px 2px 0px #e0e9ff',
                            height: { md: '48px' },
                            width: { md: '112px' },
                            fontSize: '1.2rem',
                          }}
                        />
                      )}
                    </Typography>
                  </Box>
                  {/* Display the Date & Time Section */}
                  <Box
                    sx={{
                      marginBottom: {
                        xs: '4%',
                        sm: '4%',
                        md: '1%',
                        lg: '1%',
                      },
                    }}
                  >
                    <Typography variant="text12" className="form-section-title">
                      Date & Time
                    </Typography>{' '}
                    <br></br>
                    <Typography
                      variant="text4"
                      sx={{ color: 'var(--tw-text-light-redText)' }}
                    >
                      Register By: {watch('registrationDueDate')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="text2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginBottom: {
                        xs: '4%',
                        sm: '4%',
                        md: '1%',
                        lg: '1%',
                      },
                      fontSize: {
                        xs: '0.813rem',
                        sm: '0.813rem',
                        md: '1rem',
                        lg: '1rem',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        mode === 'light'
                          ? '/images/date_lg.png'
                          : '/images/date_dark.png'
                      }
                      alt="Paid Event"
                      sx={{
                        width: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                        height: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                      }}
                    />
                    {new Date(watch('eventStartDate')).toLocaleDateString(
                      'en-GB',
                      {
                        weekday: 'short', // For 'Mon', 'Tue', etc.
                        day: 'numeric', // For the day number
                        month: 'long', // For the full month name
                        year: 'numeric', // For the full year
                      }
                    )}
                  </Typography>
                  <Typography
                    variant="text2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginBottom: {
                        xs: '4%',
                        sm: '4%',
                        md: '1%',
                        lg: '1%',
                      },
                      fontSize: {
                        xs: '0.813rem',
                        sm: '0.813rem',
                        md: '1rem',
                        lg: '1rem',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        mode === 'light'
                          ? '/images/date_lg.png'
                          : '/images/date_dark.png'
                      }
                      alt="Paid Event"
                      sx={{
                        width: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                        height: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                      }}
                    />
                    {new Date(watch('eventEndDate')).toLocaleDateString(
                      'en-GB',
                      {
                        weekday: 'short', // For 'Mon', 'Tue', etc.
                        day: 'numeric', // For the day number
                        month: 'long', // For the full month name
                        year: 'numeric', // For the full year
                      }
                    )}
                  </Typography>{' '}
                  <Typography
                    variant="text2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      fontSize: {
                        xs: '0.813rem',
                        sm: '0.813rem',
                        md: '1rem',
                        lg: '1rem',
                      },
                      marginBottom: {
                        xs: '4%',
                        sm: '4%',
                        md: '1%',
                        lg: '1%',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        mode === 'light'
                          ? '/images/clock_lg.png'
                          : '/images/clock_dark.png'
                      }
                      alt="Paid Event"
                      sx={{
                        width: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                        height: {
                          xs: '15px',
                          sm: '15px',
                          md: 'auto',
                          lg: 'auto',
                        },
                      }}
                    />
                    {formatTimeTo12Hour(watch('eventStartTime'))}-{' '}
                    {formatTimeTo12Hour(watch('eventEndTime'))}
                  </Typography>
                  <br />
                  <Typography variant="text12" className="form-section-title">
                    Event Description:
                  </Typography>
                  <br></br>
                  <Typography variant="text5">
                    {parse(watch('eventDescription'))}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 4,
                    }}
                  >
                    <ButtonInput
                      disabled={false}
                      fontWeight={600}
                      text={checkIfPublished ? 'Cancel' : 'Save Draft'}
                      // fontSize={15}
                      type="button"
                      // onClick={(e) => handleSaveDraft(e)} // Arrow function passing the event object
                      onClick={
                        checkIfPublished
                          // ? () => setCreateEvent(false)
                          ? () => setOpenDialog(true)
                          : handleSaveDraft
                      }
                      styles={{
                        width: 'fit-content',
                        backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'
                          }`,
                        color: `${mode === 'light'
                          ? 'var(--tw-text-light-mainText)'
                          : 'var(--tw-text-dark-mainText)'
                          }`,
                        border: `${mode === 'light'
                          ? '1px solid var(--tw-text-light-mainText)'
                          : '1px solid var(--tw-text-dark-mainText)'
                          }`,
                      }}
                    />

                    {/* Additional Cancel Button when event is coming from draft */}
                    {!checkIfPublished && (
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text="Cancel"
                        type="button"
                        // onClick={() => setCreateEvent(false)}
                        onClick={() => setOpenDialog(true)}

                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'
                            }`,
                          color: `${mode === 'light'
                            ? 'var(--tw-text-light-mainText)'
                            : 'var(--tw-text-dark-mainText)'
                            }`,
                          border: `${mode === 'light'
                            ? '1px solid var(--tw-text-light-mainText)'
                            : '1px solid var(--tw-text-dark-mainText)'
                            }`,
                        }}
                      />
                    )}
                    <ButtonInput
                      disabled={false}
                      loading={false}
                      fontWeight={600}
                      text={
                        eventActionType === 'edit event'
                          ? 'Update Event'
                          : 'Publish Event'
                      }
                      type="submit"
                      // onClick={(e) => {handlePublishEvent(e)}}
                      onClick={handlePublishEvent}
                      styles={{
                        width: 'fit-content',
                        backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-main)'
                          : 'var(--tw-bg-light-main)'
                          }`,
                        color: `${mode === 'light'
                          ? 'var(--tw-bg-light-sidebar)'
                          : 'var(--tw-bg-light-sidebar)'
                          }`,
                        borderColor: `${mode === 'light' ? 'red' : 'red'}`,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: {
                  xs: 'center',
                  sm: 'center',
                  md: 'flex-end',
                  lg: 'flex-end',
                },
                gap: { xs: '5%', sm: '5%', md: '1%', lg: '1%' },
                marginTop: '5%',
                marginBottom: '2%',
                marginRight: '3%',
              }}
            >
              {step < 4 && (
                <ButtonInput
                  fontWeight={600}
                  disabled={false}
                  text="Cancel"
                  type="button"
                  // onClick={() => setCreateEvent(false)}
                  onClick={() => setOpenDialog(true)}
                  styles={{
                    width: 'fit-content',
                    backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'
                      }`,
                    color: `${mode === 'light'
                      ? 'var(--tw-text-light-mainText)'
                      : 'var(--tw-text-dark-mainText)'
                      }`,
                    border: `${mode === 'light'
                      ? '1px solid var(--tw-text-light-mainText)'
                      : '1px solid var(--tw-text-dark-mainText)'
                      }`,
                  }}
                />
              )}

              {step < 4 && (
                <ButtonInput
                  disabled={false}
                  fontWeight={600}
                  text="Continue"
                  type="button"
                  onClick={handleNextStep}
                  styles={{
                    width: 'fit-content',
                    backgroundColor: `${mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)'
                      }`,
                    color: `${mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)'
                      }`,
                  }}
                />
              )}
            </Box>
            <ConfirmBoxModel
              open={openDialog}
              title="Confirm Action"
              description="Are you sure you want to cancel event creation?"
              onAgree={() => {
                setCreateEvent(false);
              }}
              onDisagree={() => setOpenDialog(false)} // Close modal without action
              onClose={() => setOpenDialog(false)} // Close modal
              agreeText="Yes"
              disagreeText="No"
            />
          </form>
        </Box>
      </FormProvider>



    </Box>
  );
};

export default CreateEventForm;
