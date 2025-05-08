import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../../theme/themeProvider';// or your custom hook
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import AsyncStorage from '@react-native-async-storage/async-storage';

// Actions (assumed to work in RN)
import { fetchEventData, deleteEventAction, deleteEventPermanentlyAction } from '../actions/createevent';
// Context and modal components
import { EventContext } from '../component/context/EventContext';
import ConfirmBoxModal from '../component/UI/Popup/ConfirmBoxModal';
import JoinEventModal from '../component/modals/JoinEventModal';
// Custom Tabs component for switching between event sections
import ViewTab from '../component/Tabs/ViewTab';
// You may use react-native-vector-icons for icons
import Icon from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import DOMParser from 'react-native-html-parser';

const EventListingPage = () => {
  // Context & state variables
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

  const [step, setStep] = useState(1); // Active tab: 1=upcoming,2=past,3=draft,4=deleted
  const [menuVisible, setMenuVisible] = useState(false); // Instead of anchorEl from web
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeEventName, setActiveEventName] = useState(null);
  const [loading, setLoading] = useState(true);
  interface Event {
    eventId: string;
    eventName: string;
    eventDescription: string;
    eventStartDate: string;
    eventStartTime: string;
    registeredMembersCount: number;
    maxPeopleAllowed: number;
    acceptDonation: boolean;
    hasPaid: boolean;
    eventType: { eventType: string };
    amount: number;
    allowFamilyandFriends: boolean;
    ChargePerPerson: boolean;
  }

  const [events, setEvents] = useState<Event[]>([]); // Fetched events
  const [openDialog, setOpenDialog] = useState(false); // Confirmation dialog open
  const [deleteAction, setDeleteAction] = useState(''); // 'Delete' or 'Permanently Delete'
  const scrollContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
  const [membershipStatus, setMembershipStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {theme,mode} = useTheme();
  const navigation = useNavigation();
  const parser = new DOMParser.DOMParser();


  // Format time in 12-hour format
  const formatTime = (timeString:any) => {
    const time = new Date(timeString);
    let hours = time.getUTCHours(); // Using UTC here; adjust if needed
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Check role and membership status (using AsyncStorage)
  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
      const membership = await AsyncStorage.getItem('membershipStatus');
      setMembershipStatus(membership || '');
    };
    checkRole();
  }, []);

  // Update event section in context based on the active tab (step)
  useEffect(() => {
    if (step === 1) setEventSection('upcoming');
    else if (step === 2) setEventSection('past');
    else if (step === 3) setEventSection('draft');
    else if (step === 4) setEventSection('deleted');
  }, [step, setEventSection]);

  // Open Join Event modal for non-admins (if event not already paid)
  const handleOpenJointEventModal = (eventData:any) => {
    if (!isAdmin && !eventData.hasPaid) {
      const remainingCapacity = eventData.maxPeopleAllowed - eventData.registeredMembersCount;
      setOpenJointEventModal({
        open: true,
        eventId: eventData.eventId,
        eventType: eventData.eventType.eventType,
        amountPerPerson: eventData.amount,
        allowFamilyFriends: eventData.allowFamilyandFriends,
        chargePerPerson: eventData.ChargePerPerson,
        eventName: eventData.eventName,
        remainingCapacity,
      });
      console.log('setOpenJointEventModal', eventData);
    }
  };

  const handleCloseJointEventModal = () => {
    setOpenJointEventModal(prev => ({ ...prev, open: false }));
  };

  // Menu handling
  const handleClickMenu = (eventId:any, eventName:any) => {
    setActiveEvent(eventId);
    setActiveEventName(eventName);
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuAction = (action:any) => {
    if (action === 'View') {
      //@ts-ignore
      navigation.navigate('EventId', { eventId: activeEvent });
    } else if (action === 'Edit' && isAdmin) {
      setEventId(activeEvent);
      setEventActionType('edit event');
      setCreateEvent(true);
      setRegisteredMembers(false);
    } else if (action === 'Delete' || action === 'Permanently Delete') {
      setDeleteAction(action);
      setOpenDialog(true);
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

  // Delete event handler
  const handleDelete = async () => {
    try {
      if (deleteAction === 'Delete') {
        const response = await deleteEventAction(activeEvent);
        if (response.status === 200 || response.status === 204) {
          fetchEvents(step);
          setCreateEvent(false);
          //@ts-ignore
          navigation.navigate("AuthNavigator",{ screen: "Events" });
 

        }
      }
      if (deleteAction === 'Permanently Delete') {
        const response = await deleteEventPermanentlyAction(activeEvent);
        if (response.status === 200 || response.status === 204) {
          fetchEvents(step);
          setCreateEvent(false);
          //@ts-ignore
          navigation.navigate("AuthNavigator",{ screen: "Events" });
        }
      }
    } catch (error) {
      console.error('Failed to delete event: ', error);
    } finally {
      setOpenDialog(false);
    }
  };

  // Fetch events for the active tab
  const fetchEvents = async (activeTab:any) => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 1) response = await fetchEventData('upcoming', isAdmin);
      else if (activeTab === 2) response = await fetchEventData('past', isAdmin);
      else if (activeTab === 3) response = await fetchEventData('draft', isAdmin);
      else if (activeTab === 4) response = await fetchEventData('deleted', isAdmin);
      console.log('Fetched events: ', response);
      setEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset events when active tab changes
  useEffect(() => {
    setEvents([]);
    setPage(0);
    setHasMore(true);
  }, [step]);

  // Fetch events when the tab (step) changes
  useEffect(() => {
    fetchEvents(step);
  }, [step]);

  // Fetch more events for pagination when page changes
  useEffect(() => {
    fetchMoreEvents();
  }, [page]);

  const fetchMoreEvents = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const limit = 10;
      const offset = page * limit;
      let eventType;
      if (step === 1) eventType = 'upcoming';
      else if (step === 2) eventType = 'past';
      else if (step === 3) eventType = 'draft';
      else if (step === 4) eventType = 'deleted';
      const response = await fetchEventData(eventType, isAdmin, limit, offset);
      setEvents(prevEvents => [...prevEvents, ...response]);
      if (response.length < limit) setHasMore(false);
    } catch (error) {
      console.error('Error fetching more events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler using onScroll
  const handleScroll = (event:any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 100) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <ScrollView
      ref={scrollContainerRef}
      style={[styles.container]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* Tabs component */}
      <ViewTab step={step} setStep={setStep} tabBtnTxt="Create New Event" actionType="event" />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.main} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../images/Frame.png')} style={styles.emptyImage} resizeMode="contain" />
          <Text style={styles.emptyText}>No events available</Text>
        </View>
      ) : (
        <View style={styles.eventsGrid}>
          {events.map((event) => (
            <View  key={event.eventId} style={[styles.card, { backgroundColor: theme.colors.sidebar, borderColor: theme.colors.mainText }]}>
            {/* Header: Event Name and Free/Paid tag */}
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={[styles.cardTitle, { color: theme.colors.mainText }]}>{event.eventName}</Text>
                <Text style={[styles.cardSubTitle, { color: theme.colors.mainText }]}>
                  {dayjs(event.eventStartDate).format('D MMM YYYY')}, {formatTime(event.eventStartTime)}
                </Text>
              </View>
              <Text style={[styles.priceTag, { color: event.eventType.eventType === 'free' ? 'green' : 'red' }]}>
                {event.eventType.eventType === 'free' ? 'Free' : `₹ ${event.amount}`}
              </Text>
            </View>
      
            {/* Description */}
            <Text style={[styles.cardDescription, { color: theme.colors.mainText }]}>
                {(() => {
                  const plainText = parser
                    .parseFromString(event.eventDescription, 'text/html')
                    .documentElement.textContent;
                  return plainText.length > 80
                    ? plainText.substring(0, 80) + '...'
                    : plainText;
                })()}
</Text>

      
            {/* Attendance and Actions */}
            <TouchableOpacity
              style={styles.attendanceContainer}
              onPress={() => handleOpenJointEventModal(event)}
            >
              <View style={styles.attendance}>
                <Icon name="groups" size={24} color={theme.colors.main} />
                <Text style={[styles.attendanceText, { color: theme.colors.mainText }]}>
                  {' '}{event.registeredMembersCount}/{event.maxPeopleAllowed}
                </Text>
                {event.acceptDonation && (
                  <Text style={styles.donationText}>Accept Donation</Text>
                )}
              </View>
      
              {isAdmin ? (
                <TouchableOpacity onPress={() => handleClickMenu(event.eventId, event.eventName)}>
                  <Icon name="more-horiz" size={24} color={theme.colors.smallText} />
                </TouchableOpacity>
              ) : (
                <View style={styles.actionContainer}>
                  {!isAdmin && eventSection !== 'past' && (
                    <>
                      {event.registeredMembersCount === event.maxPeopleAllowed ? (
                        <Text style={[styles.registerText, { color: theme.colors.error }]}>Registration Full</Text>
                      ) : event.hasPaid ? (
                        <Text style={[styles.registerText, { color: theme.colors.mainText }]}>Registered</Text>
                      ) : membershipStatus === 'paid' ? (
                        <TouchableOpacity onPress={() => !event.hasPaid && handleOpenJointEventModal(event)}>
                          <Text style={[styles.registerText, { color: theme.colors.mainText }]}>Register</Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                  <TouchableOpacity onPress={() => { 
                    handleClickMenu(event.eventId, event.eventName);
                    //@ts-ignore
                    navigation.navigate('Events', { screen: 'EventId', params: { eventId: event.eventId } });
        
                  }}>
                    <Icon name="info-outline" size={20} color={theme.colors.mainText} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
          ))}
          {!hasMore && (
            <Text style={styles.noMoreText}>No more events to load.</Text>
          )}
        </View>
      )}

      {/* Custom Menu (rendered as a floating view) */}
      {menuVisible && (
  <Modal
    animationType="fade"
    transparent={true}
    visible={menuVisible}
    onRequestClose={handleCloseMenu}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={handleCloseMenu} // Close modal when tapping outside
    >
      <BlurView
        style={styles.blurContainer}
        blurType="light"
        blurAmount={20}
        reducedTransparencyFallbackColor="white"
      >
        <View style={styles.modalContent}>
          {isAdmin ? (
            <>
              {(step === 1 || step === 3) ? (
                <>
                  <TouchableOpacity onPress={() => handleMenuAction('View')}>
                    <Text style={styles.menuItem}>View Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('Edit')}>
                    <Text style={styles.menuItem}>Edit Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('Delete')}>
                    <Text style={styles.menuItem}>Delete Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('View Registration')}>
                    <Text style={styles.menuItem}>View Registration</Text>
                  </TouchableOpacity>
                </>
              ) : step === 2 ? (
                <>
                  <TouchableOpacity onPress={() => handleMenuAction('View')}>
                    <Text style={styles.menuItem}>View Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('View Registration')}>
                    <Text style={styles.menuItem}>View Registration</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('Delete')}>
                    <Text style={styles.menuItem}>Delete Event</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => handleMenuAction('View')}>
                    <Text style={styles.menuItem}>View Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('View Registration')}>
                    <Text style={styles.menuItem}>View Registration</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('Permanently Delete')}>
                    <Text style={styles.menuItem}>Delete Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMenuAction('Copy')}>
                    <Text style={styles.menuItem}>Copy Event</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : null}
        </View>
      </BlurView>
    </TouchableOpacity>
  </Modal>
)}




      {/* Confirmation dialog */}
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

      {/* Join Event Modal */}
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
    </ScrollView>
  
  );
};

export default EventListingPage;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    width: '90%',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  priceTag: {
    fontSize: 16,
    fontWeight: '600',
  }, attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  attendance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  donationText: {
    marginLeft: 15,
    fontSize: 12,
    color: 'gold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  registerText: {
    fontWeight: '500',
    fontSize: 14,
    marginHorizontal: 5,
  },
  noMoreText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly dim background
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: '80%',
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },

});
