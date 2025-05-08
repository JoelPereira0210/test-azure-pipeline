import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import { Chip, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom components (assumed implemented)
import ConfirmBoxModal from '../../../component/UI/Popup/ConfirmBoxModal';
import JoinEventModal from '../../../component/modals/JoinEventModal';
import DonationModal from '../../../component/modals/AcceptDonationModal';
// Context & actions
import { EventContext } from '../../../component/context/EventContext';
import { fetchEvent, deleteEventAction, deleteEventPermanentlyAction } from '../../../actions/createevent';
import { useTheme } from '../../../../theme/themeProvider';
import ButtonInput from '../../../component/UI/Button/Button';

dayjs.extend(utc);

const EventId = () => {
  // Get eventId from route params
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Context values (for deletion, editing, etc.)
  const {    setCreateEvent,
    setEventActionType,
    setEventId,
    registeredMembers,
    setRegisteredMembers,
    eventName,
    setEventName,
    eventSection,
    setEventSection,} = useContext(EventContext);

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch membership and role from AsyncStorage (or your equivalent)
  useEffect(() => {
    const getLocalData = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
      const membership = await AsyncStorage.getItem('membershipStatus');
      setMembershipStatus(membership || '');
    };
    getLocalData();
  }, []);

  // Fetch event data by eventId
  const fetchEventById = async () => {
    setEventId(eventId);
    setLoading(true);
    try {
      const fetchedEvent = await fetchEvent(eventId);
      setEventData(fetchedEvent);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventById();
  }, [eventId]);

  const remainingCapacity =
    eventData?.event?.maxPeopleAllowed - eventData?.registeredMembersCount || 0;

  // Format date/time
  const formatDate = (dateString: string, type: 'short' | 'long' = 'long') => {
    const date = new Date(dateString);
    if (type === 'short') {
      return date.toLocaleDateString('en-GB');
    } else {
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    let hours = time.getUTCHours();
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Delete event handler
  const handleDelete = async () => {
    try {
      if (eventSection === 'deleted') {
        const response = await deleteEventPermanentlyAction(eventId);
        if (response.status === 200) {
            //@ts-ignore
            navigation.navigate('Events');
        }
      } else {
        const response = await deleteEventAction(eventId);
        if (response.status === 200 || response.status === 204) {
            //@ts-ignore
          navigation.navigate('Events');
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setOpenDialog(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.main} />
      </View>
    );
  }

  console.log("membershipStatus", membershipStatus);
  return (

       <View style={[styles.container,{backgroundColor:theme.colors.background, marginBottom: 20}]}>
    <ScrollView contentContainerStyle={[styles.stepContainer,{backgroundColor:theme.colors.background}]}>
      {/* Media Swiper */}
      {eventData?.media && eventData.media.length > 0 && (
        <Swiper
          style={styles.swiperContainer}
          loop={true}
          showsPagination={true}
          showsButtons={true}
        >
          {eventData.media.map((file: any, index: number) => {
            const isImage = file.type.startsWith('image');
            const isVideo = file.type.startsWith('video');
            const isAudio = file.type.startsWith('audio');
            return (
              <View key={index} style={styles.swiperSlide}>
                {isImage ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${file.data}` }}
                    style={styles.swiperImage}
                  />
                ) : isVideo ? (
                  <WebView
                    style={styles.videoWebView}
                    originWhitelist={['*']}
                    source={{ uri: `data:video/mp4;base64,${file.data}` }}
                  />
                ) : isAudio ? (
               
    
                    <WebView
                      style={styles.audioWebView}
                      originWhitelist={['*']}
                      source={{ uri: `data:audio/mpeg;base64,${file.data}` }}
                    />
             
                ) : (
                  <Text>Unsupported format or not an image.</Text>
                )}
              </View>
            );
          })}
        </Swiper>
      )}

      {/* Event Name and Price Chip */}
      <View style={styles.sameRow}>
    <Text style={[styles.reviewText, theme.typography.text12]}>
          {eventData?.event?.eventName}
        </Text>
        <Chip
          mode="flat"
          style={[
            {
              backgroundColor:
                eventData?.event?.eventType.eventType === 'paid'
                  ? theme.colors.redBackground
                  : theme.colors.greenBackground,
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
            color:
              eventData?.event?.eventType.eventType === 'paid' ? 'red' : 'green',
          }}
        >
          {eventData?.event?.eventType.eventType === 'paid'
            ? `₹ ${eventData?.event?.amount}`
            : 'Free'}
        </Chip>
      </View>

      {/* Date & Time */}
      <Text style={[styles.reviewText,theme.typography.text12]}>
        Date & Time
      </Text>
      <Text style={[styles.reviewText,, theme.typography.text5, { color: theme.colors.error }]}>
        Registration By: {formatDate(eventData?.event?.eventRegistrationDate, 'short')}
      </Text>
      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-month" size={18} color={theme.colors.mainText} />
        <Text style={[styles.reviewText, theme.typography.text5]}>
          {formatDate(eventData?.event?.eventStartDate, 'long')}
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-month" size={18} color={theme.colors.mainText} />
        <Text style={[styles.reviewText , theme.typography.text5]}>
          {formatDate(eventData?.event?.eventEndDate, 'long')}
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <MaterialIcons name="access-time" size={18} color={theme.colors.mainText} />
        <Text style={[styles.reviewText, theme.typography.text5]}>
          {formatTime(eventData?.event?.eventStartTime)} - {formatTime(eventData?.event?.eventEndTime)}
        </Text>
      </View>

      {/* Event Description */}
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
                    padding: 10px;
                    color: ${theme.colors.mainText};
                    background-color: ${theme.colors.background};
                  }
                </style>
              </head>
              <body>
                ${eventData?.event?.eventDescription || ''}
              </body>
            </html>
          `,
        }}
        style={[styles.htmlWebView, { backgroundColor: theme.colors.background }]}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        pinchGestureEnabled={true}
      />

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        {isAdmin ? (
          <>
            <ButtonInput
              text="Edit"
              onPress={() => {
                // Edit action
                setEventActionType('edit event');
                setCreateEvent(true);
                setRegisteredMembers(false);
                console.log("edit indivual event called");
                //@ts-ignore
                navigation.navigate("Events", { screen: "EventsMain" });

              }}
              width={130}
              buttonBackgroundColor={theme.colors.background}
              borderColor={theme.colors.mainText}
              buttonFontColor={theme.colors.mainText}

            />
             
            <ButtonInput
              text="Delete"
              width={130}
              onPress={() => {
                setOpenDialog(true);
              }}
             
            />
         
          </>
        ) : (
          <>
            {eventData?.event?.eventType.eventType === 'paid' ? (
              <View style={{ alignItems: 'center' }}>
                {String(eventData?.event?.maxPeopleAllowed) ===
                  String(eventData?.registeredMembersCount) && (
                  <Text style={{ color: '#E41D1D', fontWeight: '600', marginBottom: 5 }}>
                    You can't register as the event is already full
                  </Text>
                )}
                <ButtonInput
                 text= {eventData?.hasPaid ? 'Registered' : 'Pay Now'}
                  onPress={() => setOpenJoinModal(true)}
                  disabled={
                    eventData?.hasPaid ||
                    String(eventData?.event?.maxPeopleAllowed) === String(eventData?.registeredMembersCount)
                    ||
                    membershipStatus === 'unpaid'
                  }
                  buttonBackgroundColor={ (eventData?.hasPaid ||
                    String(eventData?.event?.maxPeopleAllowed) === String(eventData?.registeredMembersCount)) ||  membershipStatus === 'unpaid'? '#9C9AA5'
                    :undefined
                }

                  width={130}

                />

            
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                {String(eventData?.event?.maxPeopleAllowed) ===
                  String(eventData?.registeredMembersCount) && (
                  <Text style={{ color: '#E41D1D', fontWeight: '600', marginBottom: 5 }}>
                    You can't register as the event is already full
                  </Text>
                )}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <ButtonInput
                   text={eventData?.hasPaid ? 'Registered' : 'Register'}
                    onPress={() => setOpenJoinModal(true)}
                    disabled={
                      eventData?.hasPaid ||
                      String(eventData?.event?.maxPeopleAllowed) === String(eventData?.registeredMembersCount)
                      ||
                       membershipStatus === 'unpaid'
                    }
                    width={130}
                    buttonBackgroundColor={   (eventData?.hasPaid ||
                        String(eventData?.event?.maxPeopleAllowed) === String(eventData?.registeredMembersCount))
                        ||
                         membershipStatus === 'unpaid'
                        ?'#9C9AA5'
                        :undefined
                    }
                  />
                    
                  {eventData?.event?.acceptDonation && (
                    <ButtonInput
                      text='Donate Now'
                      onPress={() => setOpenDonationModal(true)}
                      width={138}
                      buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                    />
                    
                 
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </View>
      <ConfirmBoxModal
        open={openDialog}
        title="Confirm Deletion"
        description="Are you sure you want to delete this event?"
        onAgree={handleDelete}
        onDisagree={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        agreeText="Yes, Delete"
        disagreeText="No, Cancel"
      />
      <JoinEventModal
        open={openJoinModal}
        onClose={() => setOpenJoinModal(false)}
        amountPerPerson={eventData?.event?.amount || 0}
        eventId={eventData?.event?.id || eventId}
        eventType={eventData?.event?.eventType.eventType}
        allowFamilyFriends={eventData?.event?.allowFamilyandFriends}
        eventName={eventData?.event?.eventName}
        remainingCapacity={remainingCapacity}
        chargePerPerson={eventData?.event?.ChargePerPerson}
      />
      <DonationModal
        open={openDonationModal}
        onClose={() => setOpenDonationModal(false)}
        eventId={eventData?.event?.eventId}
        eventName={eventData?.event?.eventName}
      />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    // paddingTop:30,
    marginTop:30,
    padding: 20,
    // margin:'auto'
  },
  container: {
    // flex: 1,
    height:'100%',
  },
  swiperContainer: {
    height: 200,
    marginBottom: 10,
  },
  swiperSlide: {
    width: '100%',
    height: 200,
  },
  swiperImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  videoWebView: {
    width: '100%',
    height: 200,
  },
  audioWebView: {
    width: '100%',
    height: 50,
    backgroundColor:'transparent',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  sameRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  reviewText: {
    marginBottom: 4,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  htmlWebView: {
    width: '100%',
    minHeight: 100,
    marginBottom: 5,
  },

  errorText: {
    color: 'red',
    marginTop: 5,
  },
  reviewSubTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom:20
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
});

export default EventId;
