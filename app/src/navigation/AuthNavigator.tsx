import React,{useState,useEffect} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../../theme/themeProvider';
import Members from '../routes/authenticated/members/Members';
import Committee from '../routes/authenticated/committee/Committee';
import Events from '../routes/authenticated/events/Events';
import Charges from '../routes/authenticated/charges/Charges';
import Chat from '../routes/authenticated/chat/Chat';
import Profile from '../routes/authenticated/profile/Profile';
import SideBar from '../component/UI/SideBar/SideBar';
import CartCheckoutPage from '../routes/authenticated/cartcheckout/CartCheckout';
import Subscriptions from '../routes/unauthenticated/subscriptions/Subscriptions';
import { Avatar, Dialog, IconButton, Portal } from 'react-native-paper';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ProfileModal from '../component/modals/ProfileModal';
import { getSocietyAction } from '../actions/society';

import { useUser } from '../component/context/UserContext';
import { checkIsAdminAction, fetchLoggedInUserdata } from '../actions/auth';
import { createStackNavigator } from '@react-navigation/stack';
import EventId from '../routes/authenticated/events/EventId';
import UpdateSocietyDetailsForm from '../routes/authenticated/updatesocietydetails/UpdateSocietyDetails';
import UserDetails from '../routes/authenticated/userdetail/UserDetail';
import MembershipCheckoutPage from '../routes/authenticated/membershipcheckout/MembershipCheckoutPage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileMain">
      {/* The main Profile screen */}
      <Stack.Screen name="ProfileMain" component={Profile} />

      {/* Additional screens you want to navigate to from Profile */}
      <Stack.Screen name="UpdateSocietyDetailsForm" component={UpdateSocietyDetailsForm} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="MembershipCheckoutPage" component={MembershipCheckoutPage} />
    </Stack.Navigator>
  );
};

const EventsStack = () => {
  
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="EventsMain">
   
      <Stack.Screen name="EventsMain" component={Events} />
      <Stack.Screen name="EventId" component={EventId} />
    </Stack.Navigator>
  );
};

export const AuthNavigator = ({ navigation }:any) => {
  const { theme } = useTheme();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [societies, setSocieties] = useState<any[]>([]);
  const [adminPrivileges, setAdminPrivileges] = useState<boolean>(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchLoggedInUserdata();
        console.log("Fetched User Data:", userData);

        let userSocieties: any[] = [];
        userData?.societyMembers?.forEach((societyMember:any) => {
          userSocieties.push(societyMember?.society);
        });

        const isAdmin = await checkIsAdminAction();
        console.log("check isAdmin in authNav", isAdmin);

        setUserData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          profilePicture: userData.profilePicture || null,
        });


        if (isAdmin !== null) {
    
        setAdminPrivileges(isAdmin === "admin");
        }

        setSocieties(userSocieties);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };



    fetchUserData();
  }, []);
  
  return (
    <>
    <Drawer.Navigator
      initialRouteName="Members"
      screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.background},
      headerTintColor:theme.colors.mainText,
      drawerActiveTintColor: 'white', // Selected text color
      drawerInactiveTintColor: '#9C9AA5', // Unselected text color
      drawerActiveBackgroundColor: '#1E90FF', // Background for selected item
      drawerItemStyle: {
        borderRadius: 10, 
        width: '85%', 
        alignSelf: 'center', 
        shadowColor:'#1E90FF',
        shadowRadius:0.5,
        shadowOpacity:0.9,
      },
      drawerLabelStyle: {
        fontSize: 16, // Increase font size
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowProfileModal(true)} style={styles.profileButton}>
          <Avatar.Image
            size={36}
            source={userData?.profilePicture ? { uri: userData.profilePicture } : require('../images/avatar-placeholder.png')}
          />
        </TouchableOpacity>
      ),
    }}
    drawerContent={(props) => <SideBar {...props} />}
  >
      <Drawer.Screen
      name="Members"
      component={Members}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="account-group"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'} // Selected = white, Unselected = gray
        />
        ),
      }}
      />
      <Drawer.Screen
      name="Committee"
      component={Committee}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="account-tie"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'}
        />
        ),
      }}
      />
      <Drawer.Screen
      name="Events"
      component={EventsStack}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="calendar"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'}
        />
        ),
      }}
      />
      <Drawer.Screen
      name="Charges/Fees"
      component={Charges}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="currency-usd"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'}
        />
        ),
      }}
      />
      <Drawer.Screen
      name="Chat"
      component={Chat}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="chat"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'}
        />
        ),
      }}
      />
      {/* <Drawer.Screen
      name="Profile"
      component={Profile}
      options={{
        drawerIcon: ({ focused }) => (
        <IconButton
          icon="account"
          size={24}
          iconColor={focused ? 'white' : '#9C9AA5'}
        />
        ),
      }}
      /> */}
      <Drawer.Screen
  name="Profile"
  component={ProfileStack}
  options={{
    drawerIcon: ({ focused }) => (
      <IconButton
        icon="account"
        size={24}
        iconColor={focused ? 'white' : '#9C9AA5'}
      />
    ),
  }}
/>
    </Drawer.Navigator>

    {/* Profile Modal */}
    <Portal>
        <Dialog visible={showProfileModal} onDismiss={() => setShowProfileModal(false)}>
          <ProfileModal
            open={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            firstName={userData?.firstName}
            lastName={userData?.lastName}
            profilePicture={userData?.profilePicture}
            adminPrivileges={adminPrivileges}
            societies={societies}
            navigation={navigation}
          />
        </Dialog>
      </Portal>
  </>
  );
};

// Function to handle icon for drawer items
const screenOptions = (icon: string) => ({
  drawerIcon: ({ focused }:any) => (
    <IconButton
      icon={icon}
      size={24}
      iconColor={focused ? 'white' : '#9C9AA5'}
    />
  ),
});

const styles = StyleSheet.create({
  profileButton: {
    marginRight: 15,
  },
});