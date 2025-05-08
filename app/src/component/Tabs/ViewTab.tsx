import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // for ControlPointIcon
import { EventContext } from '../context/EventContext';
import { ChargesContext } from '../context/ChargesContext';
import { SubscriptionsContext } from '../context/SubscriptionContext';
import { CouponsContext } from '../context/CouponContext';
import { fetchBankDetails } from '../../actions/profile';
import AlertModal from '../UI/Popup/AlertPopUp';
import { useTheme } from '../../../theme/themeProvider';

const Tabs = ({ step, setStep, tabBtnTxt, actionType, displayBtn = true }:any) => {
  const { setCreateEvent, setEventActionType, setEventId } = useContext(EventContext);
  const { setCreateCharge, setChargeActionType } = useContext(ChargesContext);
  const { setCreateSubscription } = useContext(SubscriptionsContext);
  const { setCreateCoupon } = useContext(CouponsContext);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {theme} = useTheme();
  // Get screen width to conditionally render mobile vs desktop button
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    AsyncStorage.getItem('flow').then((role) => {
      setIsAdmin(role === 'admin');
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('isSuperAdmin').then((role) => {
      setIsSuperAdmin(role === 'true');
    });
  }, []);

  const handleCreateAction = async () => {
    try {
      // Check if bank details exist
      const bankDetails = await fetchBankDetails();
      console.log('bankDetails are', bankDetails);
      if (!bankDetails && actionType === 'charge') {
        setShowAlertModal(true);
        return;
      }
      setChargeActionType('create charge');
      setCreateCharge(true);
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setShowAlertModal(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Create New Event Button for Mobile */}
      {((isSuperAdmin || isAdmin) && displayBtn && screenWidth < 768) && (
        <TouchableOpacity
          style={styles.mobileButton}
          onPress={() => {
            if (actionType === 'event') {
              setEventActionType('Create A New Event');
              setCreateEvent(true);
            } else {
              handleCreateAction();
            }
          }}
        >
          <Text style={styles.mobileButtonText}>{tabBtnTxt}</Text>
        </TouchableOpacity>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, step === 1 && styles.tabActive]}
            onPress={() => setStep(1)}
          >
            <Text style={[styles.tabText,{color:theme.colors.mainText}]}>
              {actionType === 'subscription'
                ? 'Active'
                : actionType === 'landingPage'
                ? 'Landing Cards'
                : 'Upcoming'}
            </Text>
          </TouchableOpacity>

          {actionType !== 'subscription' && (
            <TouchableOpacity
              style={[styles.tab, step === 2 && styles.tabActive]}
              onPress={() => setStep(2)}
            >
              <Text style={[styles.tabText,{color:theme.colors.mainText}]}>
                {actionType === 'landingPage' ? 'Landing Sliders' : 'Past'}
              </Text>
            </TouchableOpacity>
          )}

          {(isSuperAdmin || isAdmin) && actionType !== 'landingPage' && (
            <>
              <TouchableOpacity
                style={[styles.tab, step === 3 && styles.tabActive]}
                onPress={() => setStep(3)}
              >
                <Text style={[styles.tabText,{color:theme.colors.mainText}]}>Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, step === 4 && styles.tabActive]}
                onPress={() => setStep(4)}
              >
                <Text style={[styles.tabText,{color:theme.colors.mainText}]}>Deleted</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Create New Event Button for Desktop */}
        {((isSuperAdmin || isAdmin) && displayBtn && screenWidth >= 768) && (
          <TouchableOpacity
            style={styles.desktopButton}
            onPress={() => {
              if (actionType === 'event') {
                setEventActionType('Create A New Event');
                setCreateEvent(true);
              } else if (actionType === 'subscription') {
                setCreateSubscription(true);
              } else if (actionType === 'coupon') {
                setCreateCoupon(true);
              } else {
                handleCreateAction();
              }
            }}
          >
            <Icon name="control-point" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.desktopButtonText}>{tabBtnTxt}</Text>
          </TouchableOpacity>
        )}
      </View>

      <AlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Bank Details Missing"
        note="Please update your bank details before proceeding to create."
        buttonText="Close"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  mobileButton: {
    backgroundColor: '#1F64FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  mobileButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F64FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    // color: '#666',
  },
  desktopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F64FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonIcon: {
    marginRight: 5,
  },
  desktopButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Tabs;
