import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useTheme } from '../../theme/themeProvider';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../lib/zod/event';
import Swiper from 'react-native-swiper';
import { Image } from 'react-native';
import { EventContext } from '../component/context/EventContext';
import {
  fetchEvent,
  createEventAction,
  updateEventAction,
} from '../actions/createevent';
import { fetchBankDetails } from '../actions/profile';
import { fileToBase64 } from '../utils/auth';

// Custom UI components – make sure these are adapted for React Native.
import CreateEventTab from '../component/Tabs/CreateEventTab';
import EventFileDropZone from '../component/UI/DropZone/EventFileDropZone';
import TextEditor from '../component/UI/TextEditor/TextEditor';
import CheckboxInput from '../component/UI/CheckBox/CheckBox';
import ButtonInput from '../component/UI/Button/Button';
import DatePickerField from '../component/UI/DatePickerField/DatePickerField';
import TimePickerField from '../component/UI/TimePicker/TimePickerField';
import ConfirmBoxModal from '../component/UI/Popup/ConfirmBoxModal';
import InputField from '../component/UI/InputField/InputField';
import WebView from 'react-native-webview';
import { Chip } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { date } from 'zod';


const CreateEventForm: React.FC = () => {
  const {
    setCreateEvent,
    setEventActionType,
    eventId,
    setEventId,
    eventActionType,
  } = useContext(EventContext);

  const [step, setStep] = useState<number>(1);
  const [base64Files, setBase64Files] = useState<any[]>([]);
  const [combinedMediaData, setCombinedMediaData] = useState<any[]>([]);
  const [timeError, setTimeError] = useState('');
  const [eventType, setEventType] = useState<string>('free');
  const [isPublishing, setIsPublishing] = useState<boolean | null>(null);
  const [checkIfPublished, setCheckIfPublished] = useState<boolean | null>(null);
  const [isDeleted, setIsDeleted] = useState('NOT_DELETED');
  const [bankDetailsAvailable, setBankDetailsAvailable] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const {theme,mode} = useTheme();

  const CreateEventSchema = eventSchema(registrationCount);
  const methods = useForm({
    resolver: zodResolver(CreateEventSchema),
    mode: 'onBlur',
  });
  const { handleSubmit, control, setValue, formState: { errors }, trigger, watch } = methods;

  // Format time (12-hour)
  const formatTimeTo12Hour = (time24: string) => {
    if (!time24) return 'Invalid time';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minutes} ${ampm}`;
  };

  // On load, if editing or copying an event, fetch data
  useEffect(() => {
    (async () => {
      if ((eventActionType === 'edit event' || eventActionType === 'copy event') && eventId) {
        try {
          const existingEvent: any = await fetchEvent(eventId);
          setValue('eventName', existingEvent.event.eventName);
          setValue('eventDescription', existingEvent.event.eventDescription);
          setCheckIfPublished(existingEvent.event.shouldPublish);

          if (eventActionType === 'edit event') {
            setValue('eventStartDate', dayjs(existingEvent.event.eventStartDate).format('YYYY-MM-DD'));
            setValue('eventEndDate', dayjs(existingEvent.event.eventEndDate).format('YYYY-MM-DD'));
            setValue('registrationDueDate', dayjs(existingEvent.event.eventRegistrationDate).format('YYYY-MM-DD'));
            setValue('eventStartTime', dayjs.utc(existingEvent.event.eventStartTime).format('HH:mm'));
            setValue('eventEndTime', dayjs.utc(existingEvent.event.eventEndTime).format('HH:mm'));
            setRegistrationCount(existingEvent.registeredMembersCount);
          }
          const eType = existingEvent.event.eventType.eventType;
          setEventType(eType);
          setValue('eventType', eType);
          setValue('maxAttendees', existingEvent.event.maxPeopleAllowed || '');
          setValue('allowFamilyAndFriends', existingEvent.event.allowFamilyandFriends || false);
          if (eType === 'paid') {
            setValue('amountPerPerson', existingEvent.event.amount || '');
            setValue('ChargePerPerson', existingEvent.event.ChargePerPerson || false);
          } else if (eType === 'free') {
            setValue('acceptDonation', existingEvent.event.acceptDonation || false);
          }
          const mediaFiles = existingEvent.media || [];
          const base64Media = mediaFiles.map((file: any) => file.data);
       
            // console.log("base64Media in edit event", base64Media);
          
          setBase64Files(base64Media);
          const combinedMedia = mediaFiles.map((file: any) => ({
            id: file.id,
            data: file.data,
          }));
          setCombinedMediaData(combinedMedia);
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      }
    })();
  }, [eventActionType, eventId, setValue]);

  // On form submission
  const onSubmit = async (data: any) => {
    try {
    
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

      let payload: any = {
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
        isDeleted: isDeleted,
        maxAttendees: data.maxAttendees,
        shouldPublish: isPublishing,
        encryptedSocietyId: await AsyncStorage.getItem('societyId'),
      };

      if (data.eventType === 'paid') {
        payload.amountPerPerson = data?.amountPerPerson;
        payload.ChargePerPerson = data?.ChargePerPerson;
      } else if (data.eventType === 'free') {
        payload.acceptDonation = data.acceptDonation;
      }

      if (eventActionType === 'edit event') {
        const res = await updateEventAction(eventId, payload);
        if (res?.status === 200) {
          // console.log('Event updated successfully:', res.data);
        }
      } else {
        const res = await createEventAction(payload);
        if (res?.status === 200) {
          // console.log('Event created successfully:', res.data);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setCreateEvent(false);
  };

  const validateStep = async (currentStep: number) => {
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
      const eType = watch('eventType');
      if (eType === 'paid') {
        const maxAttendeesValid = await trigger('maxAttendees');
        const amountPerPersonValid = await trigger('amountPerPerson');
        return maxAttendeesValid && amountPerPersonValid;
      } else if (eType === 'free') {
        return await trigger('maxAttendees');
      }
    }
    return true;
  };

  const handleStepChange = async (newStep: number) => {
    const isStepValid = await validateStep(step);
    if (!validateEndTime()) {
      return;
    }
    if (isStepValid) {
      setStep(newStep);
    }
  };

  const handleNextStep = () => {
    handleStepChange(step + 1);
  };

  const handleFiles = async (files: any[]) => {
    // console.log("handleFiles", files);
    try {
      const fileDataWithId = await Promise.all(
        files.map(async (file) => {
          // This call now returns a complete data URI
          const base64Data = await fileToBase64(file);
          return {
            data: base64Data,  // Data URI string including "data:...;base64,"
            mediaId: file.mediaId,
          };
        })
      );
      setBase64Files(fileDataWithId);
    } catch (err) {
      console.error('Error converting files to base64:', err);
    }
  };
  

  useEffect(() => {
    if (isPublishing !== null) {
      handleSubmit(onSubmit)();
    }
  }, [isPublishing]);

  const handlePublishEvent = () => {
    setIsPublishing(true);
  };

  const handleSaveDraft = () => {
    setIsPublishing(false);
  };

  const validateEndTime = () => {
    const startDate = watch('eventStartDate');
    const endDate = watch('eventEndDate');
    const startTime = watch('eventStartTime');
    const endTime = watch('eventEndTime');
    if (!startDate || !endDate || !startTime || !endTime) {
      return true;
    }
    if (startDate === endDate) {
      const sTime = new Date(`1970-01-01T${startTime}:00`);
      const eTime = new Date(`1970-01-01T${endTime}:00`);
      if (sTime >= eTime) {
        setTimeError('End time should be after the start time for a same-day event');
        return false;
      } else {
        setTimeError('');
        return true;
      }
    } else {
      setTimeError('');
      return true;
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const bankDetails = await fetchBankDetails();
        if (bankDetails) setBankDetailsAvailable(true);
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };
    fetchDetails();
  }, []);

  const eventPaidIcon = mode === 'dark'
  ? require('../images/eventPaidIcon_dark.png')
  : require('../images/eventPaidIcon_lg.png');

  const eventFreeIcon = mode === 'dark'
  ? require('../images/eventFreeIcon_dark.png')
  : require('../images/eventFreeIcon_lg.png');

  console.log("eventStartDate",watch('eventStartDate'));
  console.log("eventEndDate",watch('eventEndDate'));
  console.log("registrationDueData",watch('registrationDueData'));
  console.log("eventStartTime",watch('eventStartTime'));
  console.log("eventEndTime",watch('eventEndTime'));
  
  return (
    <FormProvider {...methods}>
    
      <View style={[styles.container,{backgroundColor:theme.colors.background, marginBottom: 20}]}>
        <CreateEventTab step={step} setStep={handleStepChange} />
        {step === 1 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Event Details</Text>
            <Controller
              name="eventName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Event Name"
                  required
                  errorMessage={errors.eventName ? String(errors.eventName.message) : undefined}
                />
              )}
            />
            <Controller
              name="eventDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  {...field}
                  label="Event Description"
                  required
                  errorMessage={errors.eventDescription ? String(errors.eventDescription.message) : undefined}
                />
              )}
            />
            <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Date & Time</Text>
            <Controller
              name="registrationDueDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <DatePickerField
                  {...field}
                  label="Registration Due Date"
                  required
                  error={errors.registrationDueDate ? String(errors.registrationDueDate.message) : undefined}
                  minDate={dayjs().toDate()}
                  maxDate={
                    watch('eventStartDate')
                      ? dayjs(watch('eventStartDate')).toDate()
                      : undefined
                  }
                />
              )}
            />
            <View style={styles.row}>
              <Controller
                name="eventStartDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePickerField
                    {...field}
                    label="Event Start Date"
                    required
                    error={errors.eventStartDate ? String(errors.eventStartDate.message) : undefined}
            
                                              minDate={
                                                watch('registrationDueDate')
                                                  ? dayjs(watch('registrationDueDate')).toDate()
                                                  : dayjs().toDate()
                                              }
                                              maxDate={
                                                watch('eventEndDate')
                                                  ? dayjs(watch('eventEndDate')).toDate()
                                                  : undefined
                                              }
                    onChange={(value) => {
                      field.onChange(value);
                      trigger('eventStartDate');
                      validateEndTime();
                    }}
                  />
                )}
              />
              <Controller
                name="eventEndDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePickerField
                    {...field}
                    label="Event End Date"
                    required
                    error={errors.eventEndDate ? String(errors.eventEndDate.message) : undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger('eventEndDate');
                      validateEndTime();
                    }}
                      minDate={
                                                watch('eventStartDate')
                                                  ? (dayjs(watch('eventStartDate')).toDate())
                                                  : dayjs().toDate()
                                              }
                  />
                )}
              />
            </View>
            <View>
              <Controller
                name="eventStartTime"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TimePickerField
                    {...field}
                    label="Event Start Time"
                    required
                    error={errors.eventStartTime ? String(errors.eventStartTime.message) : undefined}
                    onChange={(value:any) => {
                      field.onChange(value);
                      trigger('eventStartTime');
                      validateEndTime();
                    }}
                  />
                )}
              />
              <Controller
                name="eventEndTime"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TimePickerField
                    {...field}
                    label="Event End Time"
                    required
                    error={
                      errors.eventEndTime
                        ? String(errors.eventEndTime.message)
                        : timeError
                        ? timeError
                        : undefined
                    }
                    onChange={(value:any) => {
                      field.onChange(value);
                      trigger('eventEndTime');
                      validateEndTime();
                    }}
                  />
                )}
              />
            </View>
            <View style={styles.buttonRow}>
              <ButtonInput
                text="Cancel"
                type="button"
                width={130}
                buttonBackgroundColor={theme.colors.background}
            buttonFontColor={theme.colors.mainText}
            borderColor={theme.colors.mainText}
                onPress={() => setOpenDialog(true)}
                // styles={styles.cancelButton}
              />
              <ButtonInput
                text="Continue"
                type="button"
                width={130}
                onPress={handleNextStep}
                // styles={styles.nextButton}
              />
            </View>
          </ScrollView>
        )}
        {step === 2 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <EventFileDropZone
              name="uploadedFiles"
              label="Upload Images, Videos, Audio"
              MaxFiles={3}
              InitialFiles={combinedMediaData}
              onChange={(files: any) => handleFiles(files)}
            />
            <View style={styles.buttonRow}>
              <ButtonInput
                text="Cancel"
                type="button"
                width={130}
                buttonBackgroundColor={theme.colors.background}
                borderColor={theme.colors.mainText}
            buttonFontColor={theme.colors.mainText}
                onPress={() => setOpenDialog(true)}
                // styles={styles.cancelButton}
              />
              <ButtonInput
                text="Continue"
                type="button"
                width={130}
                onPress={handleNextStep}
                // styles={styles.nextButton}
              />
            </View>
          </ScrollView>
        )}
        {step === 3 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Controller
              name="eventType"
              control={control}
              defaultValue="free"
              render={({ field }) => (
                <View style={styles.eventTypeRow}>
                  <TouchableOpacity
                    style={[
                      styles.eventTypeButton,
                      field.value === 'paid' && styles.eventTypeButtonActive,
                    ]}
                    onPress={() => {
                      if (!bankDetailsAvailable) {
                        Alert.alert(
                          'Bank Details Required',
                          'Please update your bank details to create a paid event.'
                        );
                        return;
                      }
                      field.onChange('paid');
                      setEventType('paid');
                    }}
                    disabled={(eventActionType === 'edit event' && eventType === 'free') || !bankDetailsAvailable}
                  >
                    <Image  source={eventPaidIcon} style={styles.iconStyle} />
                    <Text style={[styles.eventTypeButtonText,{color:theme.colors.smallText}]}>Paid Event</Text>
                    <Text style={[styles.eventTypeSubText, {color:theme.colors.mainText}]}>
                      requires tickets 
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.eventTypeButton,
                      field.value === 'free' && styles.eventTypeButtonActive,
                    ]}
                    onPress={() => {
                      if (eventActionType === 'edit event' && eventType === 'paid') {
                        Alert.alert('Cannot switch from paid to free in edit mode');
                        return;
                      }
                      field.onChange('free');
                      setEventType('free');
                      setValue('amountPerPerson', '');
                    }}
                  >
                     <Image  source={eventFreeIcon} style={styles.iconStyle} />
                    <Text style={[styles.eventTypeButtonText,{color:theme.colors.smallText}]}>Free Event</Text>
                    <Text style={[styles.eventTypeSubText, {color:theme.colors.mainText}]}>
                    No ticket required
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.eventType && (
              <Text style={styles.errorText}>{String(errors.eventType.message)}</Text>
            )}
            {!bankDetailsAvailable && (
              <Text style={[styles.errorText, { marginVertical: 8 }]}>
                Bank details are required to create a Paid Event.
              </Text>
            )}
            {(eventType === 'paid' || watch('eventType') === 'paid') && (
              <View style={styles.row}>
                <Controller
                  name="maxAttendees"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Max number of people for event"
                      type="number"
                      required
                      errorMessage={errors.maxAttendees ? String(errors.maxAttendees.message) : undefined}
                    />
                  )}
                />
                <Controller
                  name="amountPerPerson"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Amount Per Person (₹)"
                      type="number"
                      required
                      errorMessage={errors.amountPerPerson ? String(errors.amountPerPerson.message) : undefined}
                      disabled={eventActionType === 'edit event' && eventType === 'paid'}
                    />
                  )}
                />
              </View>
            )}
            {(eventType === 'free' || watch('eventType') === 'free') && (
              <View style={styles.row}>
                <Controller
                  name="maxAttendees"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Max number of people for event"
                      type="number"
                      required
                      errorMessage={errors.maxAttendees ? String(errors.maxAttendees.message) : undefined}
                    />
                  )}
                />
              </View>
            )}
            {(eventType === 'free' || watch('eventType') === 'free') && (
              <Controller
                name="acceptDonation"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <CheckboxInput
                    label="Accept Donations"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={!bankDetailsAvailable}
                  />
                )}
              />
            )}
            <Controller
              name="allowFamilyAndFriends"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <CheckboxInput
                  label="Allow Family And Friends"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {watch('allowFamilyAndFriends') && eventType === 'paid' && (
              <Controller
                name="ChargePerPerson"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <CheckboxInput
                    label="Charge Per Person"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
            <View style={styles.buttonRow}>
              <ButtonInput
                text="Cancel"
                type="button"
                onPress={() => setOpenDialog(true)}
                width={130}
                buttonBackgroundColor={theme.colors.background}
                borderColor={theme.colors.mainText}
            buttonFontColor={theme.colors.mainText}
              />
              <ButtonInput
                text="Continue"
                type="button"
                onPress={handleNextStep}
       
                width={130}
              />
            </View>
          </ScrollView>
        )}
 {step === 4 && (
  <ScrollView 
    contentContainerStyle={styles.stepContainer} 
    nestedScrollEnabled={false}  // enable nested scrolling for outer ScrollView
  >
    {/* Swiper for Media Preview */}
    {base64Files.length > 0 && (
      <Swiper
        style={styles.swiperContainer}
        loop={true}
        showsPagination={true}
        showsButtons={true}
      >
        {base64Files.map((file, index) => {
          const isImage = file.data.startsWith('data:image');
          const isVideo = file.data.startsWith('data:video');
          const isAudio = file.data.startsWith('data:audio');
          return (
            <View key={index} style={styles.swiperSlide}>
              {isImage ? (
                <Image
                  source={{ uri: file.data }}
                  style={styles.swiperImage}
                />
              ) : isVideo ? (
                <WebView
                  style={styles.videoWebView}
                  originWhitelist={['*']}
                  source={{ uri: file.data }}
                />
              ) : isAudio ? (
                <WebView
                  style={styles.audioWebView}
                  originWhitelist={['*']}
                  source={{ uri: file.data }}
                />
              ) : (
                <Text>Unsupported format or not an image.</Text>
              )}
            </View>
          );
        })}
      </Swiper>
    )}

    {/* Display Event Details */}
    <View style={[styles.sameRow]}>
    <Text style={[styles.reviewText, theme.typography.text12]}>
      {watch('eventName')}
    </Text>

    <Chip
      mode="flat"
      style={[
        {
          backgroundColor: watch('amountPerPerson') ? theme.colors.redBackground : theme.colors.greenBackground,
          borderRadius: 10,
          width: 'auto',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          shadowColor: '#e0e9ff',
          shadowOffset: { width: 3, height: 5 },
          shadowOpacity: 0.5,
          shadowRadius: 9,
          elevation: 5,
        },
      ]}
      textStyle={{
        fontSize: 18,
        color: watch('amountPerPerson') ? 'red' : 'green',
      }}
    >
      {watch('amountPerPerson') ? `₹ ${watch('amountPerPerson')}` : 'Free'}
    </Chip>
   </View>
    <Text style={[styles.reviewText, theme.typography.text12]}>
      Date & Time
    </Text>
    <Text style={[styles.reviewText, theme.typography.text5,{color:theme.colors.error}]}>
      Registration By: {watch('registrationDueDate')}
    </Text>
    <View style={styles.dateContainer}>
      <MaterialIcons 
      name="calendar-month" 
      size={18} 
      color={theme.colors.mainText}
      />
        <Text style={[styles.reviewText, theme.typography.text5]}>
      {watch('eventStartDate')}
      </Text>
    </View>
    <View style={styles.dateContainer}>
      <MaterialIcons 
      name="calendar-month" 
      size={18} 
      color={theme.colors.mainText}
      />
    <Text style={[styles.reviewText, theme.typography.text5]}>
      {watch('eventEndDate')}
    </Text>
    </View>
    <View style={styles.dateContainer}>
      <MaterialIcons 
      name="access-time" 
      size={18} 
      color={theme.colors.mainText}
      />
    <Text style={[styles.reviewText, theme.typography.text5]}>
      {formatTimeTo12Hour(watch('eventStartTime'))} - {formatTimeTo12Hour(watch('eventEndTime'))}
    </Text>
    </View>

    <Text style={[styles.reviewText, theme.typography.text12]}>
      Description
    </Text>

    <WebView
      originWhitelist={['*']}
      source={{ 
      html: `
        <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=1">
        <style>
          body {
          font-size: 14px;
          margin: 0;
          color: ${theme.colors.mainText};
          background-color: ${theme.colors.background};
          }
        </style>
        </head>
        <body>
        ${watch('eventDescription')}
        </body>
        </html>
      `
      }}
      style={[
      styles.htmlWebView,
      {
        backgroundColor: theme.colors.background
      }
      ]}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      pinchGestureEnabled={true}
    />

    <View style={styles.buttonColumn}>
      <ButtonInput
        text={checkIfPublished ? 'Cancel' : 'Save Draft'}
        type="button"
        width={130}
        buttonBackgroundColor={theme.colors.background}
        borderColor={theme.colors.mainText}
        buttonFontColor={theme.colors.mainText}
        onPress={checkIfPublished ? () => setOpenDialog(true) : handleSaveDraft}
      />
      {!checkIfPublished && (
        <ButtonInput
          text="Cancel"
          type="button"
          width={130}
          buttonBackgroundColor={theme.colors.background}
          borderColor={theme.colors.mainText}
          buttonFontColor={theme.colors.mainText}
          onPress={() => setOpenDialog(true)}
        />
      )}
      <ButtonInput
        text={eventActionType === 'edit event' ? 'Update Event' : 'Publish Event'}
        type="button"
        width={180}
        onPress={handlePublishEvent}
      />
    </View>
  </ScrollView>
)}

        <ConfirmBoxModal
          open={openDialog}
          title="Confirm Action"
          description="Are you sure you want to cancel event creation?"
          onAgree={() => setCreateEvent(false)}
          onDisagree={() => setOpenDialog(false)}
          onClose={() => setOpenDialog(false)}
          agreeText="Yes"
          disagreeText="No"
        />
      </View>
    </FormProvider>
  );
};

export default CreateEventForm;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height:'100%',
    // marginBottom:20
    // backgroundColor: '#fff',
  },
  //for description
  htmlWebView: {
    width: '100%',
    minHeight:100 ,
    marginBottom: 5,
  },
  stepContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  iconStyle: {
    width: 32,
    height: 32,
    marginBottom: 8,
    margin:'auto',
    resizeMode: 'contain',
  },
  eventTypeSubText: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom:20
  },
 
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  eventTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:20,
    marginVertical: 10,
  },
  eventTypeButton: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginRight: 10,
    minWidth:150,
  },
  eventTypeButtonActive: {
    borderColor: '#1976d2',
    // backgroundColor: '#e0e9ff',
  },
  eventTypeButtonText: {
    fontSize: 14,
    textAlign: 'center',
    },
  reviewText: {
    // fontSize: 14,
    marginBottom: 4,
    fontWeight:'600'
  },
  sameRow:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop:5,
  },
  reviewSubTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  reviewHTML: {
    // fontSize: 12,
    marginBottom: 10,
  },
  swiperContainer: {
    height: 200,
    marginBottom: 10,
  },
  swiperSlide: {
width:'100%',
height:200,
  },
  swiperImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  videoWebView: {
    width: '100%',
    maxHeight: 200,
  },
  audioWebView: {
    width: '100%',
    minHeight: 60,
  },
  dateContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop:10,
    gap: 5,
  }
  
});
