import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Divider, IconButton } from 'react-native-paper';
import { useTheme } from '../../theme/themeProvider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonInput from '../component/UI/Button/Button';
import ChangePasswordModal from '../component/modals/ChangePasswordModal';
import ChangeSuperAdminModal from '../component/modals/ChangeSuperAdmin';
import UpdateBankDetails from '../component/modals/UpdateBankDetails';
import UpdateMembership from '../component/modals/UpdateMembership';
import ChangeMobileNumberModal from '../component/modals/ChangeMobileNumber';
import SocietySubscription from '../component/SocietySubscription';
import { fetchLoggedInUserdata } from '../actions/auth';
import { checkSocietySuperAdmin, fetchBankDetails, fetchMembershipAmount } from '../actions/profile';
import { getSocietyAction, societySubscriptionAction } from '../actions/society';
import { decryptValue } from '../utils/encryptiondecryption';
import { showToast } from '../utils/toastService';
import { useUser } from '../component/context/UserContext';
import { MoreDetailsContext } from '../component/context/MoreDetails';
import { PaymentContext } from '../component/context/PaymentContext';
import AlertModal from '../component/UI/Popup/AlertPopUp';




export default function ProfileForm() {
  const navigation = useNavigation();
  const {theme,mode} = useTheme();
  // Determine mode from theme – adjust as needed.


  // Local state declarations
  const [selected, setSelected] = useState('profile'); // 'profile' is default
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showMobileNumberModal, setShowMobileNumberModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [societyDetailsAccess, setSocietyDetailsAccess] = useState(true);
  const [profileT, setProfileT] = useState(false);
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  interface SubscriptionData {
    subscriptionEndDate: string;
  }
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData[]>([]);
  const [societyId, setSocietyId] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipAmount, setMembershipAmount] = useState(null);
  interface SocietyData {
    societyName: string;
    description?: string;
    address?: any;
  }
  const [societyData, setSocietyData] = useState<SocietyData | null>(null);
  const [editSocietyData, setEditSocietyData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);

  const { setPaymentItemAmount } = useContext(PaymentContext);
  const { showMoreDetails } = useContext(MoreDetailsContext);
  const { user } = useUser();

  // Get flow/role from storage to determine if user is admin
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        setProfileT(true);
      }
    })();
  }, []);

  // Get membershipStatus from storage
  useEffect(() => {
    (async () => {
      const status = await AsyncStorage.getItem('membershipStatus');
      setMembershipStatus(status);
    })();
  }, []);

  // Get societyId and fetch subscription
  useEffect(() => {
    (async () => {
      const sIdEncrypted = await AsyncStorage.getItem('societyId');
      if (sIdEncrypted) {
        const decrypted =  await decryptValue(sIdEncrypted);
        setSocietyId(decrypted);
        societySubscription(decrypted);
      }
    })();
  }, []);

  const societySubscription = async (sId:string) => {
    try {
      if (sId) {
        const subscriptionRes = await societySubscriptionAction(sId);
        console.log("subscriptionData:", subscriptionRes);
        setSubscriptionData(subscriptionRes?.societySubscription);
      }
    } catch (error) {
      showToast('Something went wrong please reload the page','error');
    }
  };

  // Adjust selected tab based on more details
  useEffect(() => {
    console.log('showMoreDetailsin:', showMoreDetails);
    if (showMoreDetails) {
      if (societyDetailsAccess && isAdmin) {
        setSelected('society');
      } else if (!societyDetailsAccess && !isAdmin) {
        setSelected('society-non-admin');
      }
    }
  }, [showMoreDetails, societyDetailsAccess, isAdmin, profileT]);

  // Fetch logged-in user data and check super admin access
  useEffect(() => {
    (async () => {
      const data = await fetchLoggedInUserdata();
      setUserData(data);
      if (data) {
        setUserId(data.userId);
      }
      const isSuperAdmin = await checkSocietySuperAdmin(data?.userId);
      console.log('Is user a societySuperAdmin:', isSuperAdmin);
      setSocietyDetailsAccess(isSuperAdmin);
    })();
  }, []);

  // Fetch membership fee amount
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchMembershipAmount({ amount: 0 });
        console.log('Full response:', response);
        if (response?.success) {
          console.log('Fetched membership data:', response.data);
          setMembershipAmount(response.data.data.membershipFeeAmount);
        } else {
          console.log('Response was not successful:', response);
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    })();
  }, []);

  const updateMembershipAmount = (newAmount:any) => {
    setMembershipAmount(newAmount);
  };

  const handleMembershipClick = async () => {
    try {
      const bankDetails = await fetchBankDetails();
      console.log("bankDetails", bankDetails);
      setShowMembershipModal(true);
    } catch (error) {
      setShowAlertModal(true);
    }
  };

  const handleEditSocietyNameClick = () => {
    setEditSocietyData(true);
    console.warn("going to page UpdateSocietyDetails");
    //@ts-ignore
    navigation.navigate('Profile',{screen:'UpdateSocietyDetailsForm'});
  };

  // Fetch society details
  useEffect(() => {
    (async () => {
      const encryptedId = await AsyncStorage.getItem('societyId');
      const sId = encryptedId ? await decryptValue(encryptedId) : null;
      try {
        if (sId) {
          const values = await getSocietyAction();
          setSocietyData(values.data.society);
          console.log('VALUES EFFECT', values);
        }
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    })();
  }, []);

  const handleProfileUpdateClick = () => {
    console.warn("going to page UserDetails");
     //@ts-ignore
    navigation.navigate('Profile',{screen:'UserDetails'});
  };

  const handleMemberhsipPayment = () => {
    setPaymentItemAmount(membershipAmount);
    console.warn("going to page MembershipCheckout")
    //@ts-ignore
    navigation.navigate('Profile',{screen:'MembershipCheckoutPage'});
  };

  const handlePasswordUpdateClick = () => {
    setShowChangePasswordModal(true);
  };

  const handleMobileNumber = () => {
    setShowMobileNumberModal(true);
  };

  const handleSuperAdminAccessClick = () => {
    setShowSuperAdminModal(true);
  };

  const handleBankDetailsClick = () => {
    setShowBankDetailsModal(true);
  };

  const updateButton = 'Update';
  const changeButton = 'Change';

  const truncateName = (name: string | undefined | null | any, maxLength: number): string => {
    if (!name) return '';
    const nameString = String(name);
    if (nameString.length > maxLength) {
      return nameString.slice(0, maxLength - 1) + '.';
    }
    return nameString;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        {user && (
          <View style={styles.column}>
            {/* Sidebar Menu */}
            <View style={styles.sidebar}>
              <View style={styles.nav}>
                {/* User Profile Section */}
                <TouchableOpacity
                  style={[
                    styles.navItem,
                    selected === 'profile' &&
                      (mode === 'light' ? styles.navItemSelectedLight : styles.navItemSelectedDark),
                  ]}
                  onPress={() => setSelected('profile')}
                >
                  <View style={styles.navItemContent}>
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={
                        selected === 'profile'
                          ? mode === 'light'
                            ? '#fff'
                            : theme.colors.main
                          : mode === 'light'
                          ? '#666'
                          : '#fff'
                      }
                    />
                
                    <Text
                      style={[
                        styles.navText,
                        {
                          marginLeft: 8,
                          color:
                            selected === 'profile'
                              ? mode === 'light'
                                ? '#fff'
                                : theme.colors.main
                              : mode === 'light'
                              ? '#666'
                              : '#fff',
                        },
                      ]}
                    >
                     
                      {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={
                      selected === 'profile'
                        ? mode === 'light'
                          ? '#fff'
                          : theme.colors.main
                        : mode === 'light'
                        ? '#666'
                        : '#fff'
                    }
                  />
                </TouchableOpacity>

                {/* Society Details Section for Admin */}
                {societyDetailsAccess && isAdmin && (
                  <TouchableOpacity
                    style={[
                      styles.navItem,
                      selected === 'society' &&
                        (mode === 'light' ? styles.navItemSelectedLight : styles.navItemSelectedDark),
                    ]}
                    onPress={() => setSelected('society')}
                  >
                    <View style={styles.navItemContent}>
                      <MaterialCommunityIcons
                        name="domain"
                        size={24}
                        color={
                          selected === 'society'
                            ? mode === 'light'
                              ? '#fff'
                              : theme.colors.main
                            : mode === 'light'
                            ? '#666'
                            : '#fff'
                        }
                      />
                      <Text
                        style={[
                          styles.navText,
                          {
                            marginLeft: 8,
                            color:
                              selected === 'society'
                                ? mode === 'light'
                                  ? '#fff'
                                  : theme.colors.main
                                : mode === 'light'
                                ? '#666'
                                : '#fff',
                          },
                        ]}
                      >
                       
                        {
                        `${truncateName(societyData?.societyName, 27)}`
                        
                        }
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={
                        selected === 'society'
                          ? mode === 'light'
                            ? '#fff'
                            : theme.colors.main
                          : mode === 'light'
                          ? '#666'
                          : '#fff'
                      }
                    />
                  </TouchableOpacity>
                )}

                {/* Society Details Section for Non-Admin */}
                {!societyDetailsAccess && !isAdmin && (
                  <TouchableOpacity
                    style={[
                      styles.navItem,
                      selected === 'society-non-admin' &&
                        (mode === 'light' ? styles.navItemSelectedLight : styles.navItemSelectedDark),
                    ]}
                    onPress={() => setSelected('society-non-admin')}
                  >
                    <View style={styles.navItemContent}>
                      <MaterialCommunityIcons
                        name="domain"
                        size={24}
                        color={
                          selected === 'society-non-admin'
                            ? mode === 'light'
                              ? '#fff'
                              : '#1D1C23'
                            : mode === 'light'
                            ? '#666'
                            : '#fff'
                        }
                      />
                      <Text
                        style={[
                          styles.navText,
                          {
                            marginLeft: 8,
                            color:
                              selected === 'society-non-admin'
                                ? mode === 'light'
                                  ? '#fff'
                                  : '#1D1C23'
                                : mode === 'light'
                                ? '#666'
                                : '#fff',
                          },
                        ]}
                      >
             
                        {
                     
                        `${truncateName(societyData?.societyName, 35)}`
                        }
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={
                        selected === 'society-non-admin'
                          ? mode === 'light'
                            ? '#fff'
                            : '#1D1C23'
                          : mode === 'light'
                          ? '#666'
                          : '#fff'
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Form Content Section */}
            <View style={styles.content}>
              {selected === 'profile' && (
                <Card  style={[styles.card, { backgroundColor: mode === 'light' ? '#1F64FF40' : '#282730' }]}>
           
                  <Card.Content >
                    <Text style={[styles.titleText,{color:theme.colors.mainText}]}>
                       
                      {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                    </Text>
                    <View style={styles.columnBetween}>
                      <View style={styles.columnStart}>
                            <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Profile</Text>
                            <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>
                            
                            {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                            </Text>
                       
                            <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>{user?.phoneNumber}</Text>
                      </View>
                      <ButtonInput
                        type="submit"
                        text={updateButton}
                        fontSize={14}
                        onPress={handleProfileUpdateClick}

                
                      />
                    </View>

                    <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />

                    <View style={styles.columnBetween}>
                      <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Change Password</Text>
                      <ButtonInput
                        text={changeButton}
                        type="submit"
                        onPress={handlePasswordUpdateClick}
                        fontSize={14}
                      />
                    </View>

                    <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />

                    <View style={styles.columnBetween}>
                      <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Change Mobile Number</Text>
                      <ButtonInput
                        text={changeButton}
                        type="submit"
                        onPress={handleMobileNumber}
                        fontSize={14}
                      />
                    </View>

                    <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />

                    {membershipStatus === 'unpaid' && (
                      <View style={styles.columnBetween}>
                        <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Membership Fee</Text>
                        <ButtonInput
                          text="Pay"
                          type="submit"
                          onPress={handleMemberhsipPayment}
                          fontSize={14}
                        />
                      </View>
                    )}
                  </Card.Content>
                </Card>
              )}

              {selected === 'society' && societyDetailsAccess && (
                <Card style={[styles.card, { backgroundColor: mode === 'light' ? '#1F64FF40' : '#282730' }]}>
                  <Card.Content>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.titleText,{color:theme.colors.mainText}]}>
                        
                        {`${truncateName(societyData?.societyName, 27)}`}
                      </Text>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={handleEditSocietyNameClick}
                        iconColor={theme.colors.mainText}
                        style={{ marginTop: -5 }}
                      />
                    </View>

                    <View style={styles.columnBetween}>
                      <View style={styles.columnStart}>
                        <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Super Admin Access</Text>
                      </View>
                      <ButtonInput
                        type="submit"
                        onPress={handleSuperAdminAccessClick}
                        disabled={false}
                        text={changeButton}
                        fontSize={14}
    
                      />
                    </View>

                    <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />

                    <View style={styles.rowBetween}>
                      <View style={styles.columnStart}>
                        <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Subscription</Text>
                        
                        <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>
                        
                          Expires on {moment(subscriptionData?.[0]?.subscriptionEndDate).format('MMM D YYYY')}
                        </Text>
                      </View>
                      <IconButton
                        icon="chevron-down"
                        size={24}
                        onPress={() => setIsSubscriptionExpanded(!isSubscriptionExpanded)}
                        style={{ transform: [{ rotate: isSubscriptionExpanded ? '180deg' : '0deg' }] }}
                      />
                    </View>

                    {isSubscriptionExpanded && <SocietySubscription subscriptionData={subscriptionData} />}

                    {!isSubscriptionExpanded && (
                      <>
                        <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />
                        <View style={styles.columnBetween}>
                          <View>
                            <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Membership</Text>
                            <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>Amount  ₹ {membershipAmount}</Text>
                          </View>
                          <ButtonInput
                            text={updateButton}
                            fontSize={14}
                            type="submit"
                            disabled={false}
                            onPress={handleMembershipClick}

                          />
                        </View>

                        <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />

                        <View style={styles.columnBetween}>
                          <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Bank Details</Text>
                          <ButtonInput
                            type="submit"
                            text={updateButton}
                            onPress={handleBankDetailsClick}
                            fontSize={14}
                
                          />
                        </View>
                      </>
                    )}
                  </Card.Content>
                </Card>
              )}

              {selected === 'society-non-admin' && (
                <Card style={[styles.card, { backgroundColor: mode === 'light' ? '#1F64FF40' : '#282730' }]}>
                  <Card.Content>
                    <Text style={[styles.titleText,{color:theme.colors.mainText}]}>
                      
                      {`${truncateName(societyData?.societyName, 30)}`}
                    </Text>
                    <View style={styles.columnStart}>
                      <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Society Description</Text>
                   
                      <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>{societyData?.description}</Text>
                    </View>
                    <Divider style={{ marginVertical: 16, backgroundColor: mode === 'light' ? 'black' : 'white', height: 1.5 }} />
                    <View style={styles.columnStart}>
                      <Text style={[styles.sectionTitle,{color:theme.colors.mainText}]}>Address</Text>
                    
                      <Text style={[styles.bodyText,{color:theme.colors.mainText}]}>{societyData?.address}</Text>
                    </View>
                  </Card.Content>
                </Card>
              )}
            </View>
          </View>
        )}

        {/* Modals */}
        {userId && <ChangePasswordModal open={showChangePasswordModal} userId={userId} onClose={() => setShowChangePasswordModal(false)} />}
        {userId && <ChangeMobileNumberModal open={showMobileNumberModal} userId={userId} onClose={() => setShowMobileNumberModal(false)} /> }
        {showSuperAdminModal && userId &&  (
          <ChangeSuperAdminModal open={showSuperAdminModal} onClose={() => setShowSuperAdminModal(false)} LoggedInUserId={userId} />
        )}
        {showBankDetailsModal && <UpdateBankDetails open={showBankDetailsModal} onClose={() => setShowBankDetailsModal(false)} />}
        {showMembershipModal && (
          <UpdateMembership
            open={showMembershipModal}
            onClose={() => setShowMembershipModal(false)}
            membershipAmount={membershipAmount}
            onUpdate={updateMembershipAmount}
          />
        )}
      </View>
      <AlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Please add bank details before updating membership amount."
        buttonText="Close"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  innerContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    // flexWrap: 'wrap',
  },
  sidebar: {
    flex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  nav: {
    // Customize your nav container styles if needed
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  navItemSelectedLight: {
    backgroundColor: '#1F64FF',
  },
  navItemSelectedDark: {
    backgroundColor: '#1D1C23',
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  columnStart: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
