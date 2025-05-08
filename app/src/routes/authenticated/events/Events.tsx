import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual RN components
import CreateEventForm from '../../../forms/CreateEventForm';
import ViewEventForm from '../../../forms/ViewEventForm';
import EventRegisteredMembers from '../../../forms/EventRegisteredMembers';
import ButtonInput from '../../../component/UI/Button/Button';
import Footer from '../../../component/UI/Footer/foter';
import { useTheme } from '../../../../theme/themeProvider';
// Contexts & actions
import { EventContext } from '../../../component/context/EventContext';
import { fetchEventData } from '../../../actions/createevent';

const CreateEventPage = () => {
  // Pull state & setters from EventContext
  const {
    createEvent,
    setCreateEvent,
    registeredMembers,
    setRegisteredMembers,
  } = useContext(EventContext);

  const [eventsPresent, setEventsPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const {theme} = useTheme();
  // Check user role & membership status from AsyncStorage
  useEffect(() => {
    const checkRoleAndMembership = async () => {
      try {
        const role = await AsyncStorage.getItem('flow');
        setIsAdmin(role === 'admin');

        const membership = await AsyncStorage.getItem('membershipStatus');
        if (membership) {
          setMembershipStatus(membership);
        }
      } catch (error) {
        console.log('Error reading from AsyncStorage:', error);
      }
    };
    checkRoleAndMembership();
  }, []);

  // Fetch events once when the screen loads or when `createEvent` changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response1 = await fetchEventData('upcoming', isAdmin);
        const response2 = await fetchEventData('past', isAdmin);
        const response3 = await fetchEventData('draft', isAdmin);
        const response4 = await fetchEventData('deleted', isAdmin);
        console.log("response1",response1);
        // If any of these arrays has length > 0, we have events
        if (
          (response1 && response1.length > 0) ||
          (response2 && response2.length > 0) ||
          (response3 && response3.length > 0) ||
          (response4 && response4.length > 0)
        ) {
          setEventsPresent(true);
        } else {
          setEventsPresent(false);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEventsPresent(false);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [createEvent, isAdmin]);

  // If loading, show an ActivityIndicator
  if (loading) {
    return (
      <View style={[styles.loaderContainer,{backgroundColor:theme.colors.background}]}>
        <ActivityIndicator size="large" color={theme.colors.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
   
        <View style={styles.mainContainer}>
          {/* =========== Conditional UI =========== */}
          {registeredMembers ? (
            // If `registeredMembers` is true
            <View style={styles.contentBox}>
              <EventRegisteredMembers />
            </View>
          ) : createEvent && isAdmin && membershipStatus === 'paid' ? (
            // If we’re creating a new event, user is admin, membership is paid
            <View style={styles.contentBox}>
              <CreateEventForm />
            </View>
          ) : eventsPresent ? (
            // If events exist
            <View style={styles.contentBox}>
              <ViewEventForm />
              {/* <Footer /> */}
            </View>
          ) : isAdmin ? (
            // If user is admin but no events exist
            <View style={styles.emptyContainer}>
             <Image source={require('../../../images/Frame.png')} style={[styles.emptyImage]} resizeMode="contain" />
             <Text style={[{color:theme.colors.mainText}]}>No Events Available</Text>
                <ButtonInput
                  type="button"
                  text="Create Event"
                  onPress={() => setCreateEvent(true)}
                  disabled={isAdmin && membershipStatus === 'unpaid'}
                  loading={false}
                  styles={{ marginTop: 20 }}
                />
      
              {/* <Footer /> */}
            </View>
          ) : (
            // If user is not admin and no events exist
            <View style={styles.emptyContainer}>
                <Image source={require('../../../images/Frame.png')} style={styles.emptyImage} resizeMode="contain" />
              <Text style={[{color:theme.colors.mainText}]}>No Events Available</Text>
    
              {/* <Footer /> */}
            </View>
          )}
          
        </View>
        <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // height:'100%',
    // marginBottom:50
   
  },
  mainContainer: {
    flex: 1,
    // height:'100%',
    marginBottom:30,
    // In RN, you might manually position your Footer or use a layout approach
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  contentBox: {
    width: '95%', // or 100% if you prefer
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9C9AA533',
    padding: 10,
  },
});

export default CreateEventPage;
