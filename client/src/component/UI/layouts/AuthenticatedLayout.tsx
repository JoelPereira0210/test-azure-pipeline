'use client';
import React, { ReactNode, useContext, useEffect } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { EventProvider } from '../../context/EventContext';
import { MemberProvider } from '../../context/MemberContext';
import { ChargesProvider } from '../../context/ChargesContext';

import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Box,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useMemo, useState } from 'react';
import theme from '@/src/theme/theme';
import ButtonInput from '../Button/Button';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { MdFace3, MdGroups } from 'react-icons/md';
import { AiOutlineDollar } from 'react-icons/ai';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useAuthRedirect } from '../../customHooks/useAuthRedirect';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { GoMoon } from 'react-icons/go';
import { Toaster } from 'react-hot-toast';
import ProfileModal from '../../modals/ProfileModal';
import { checkisSuperAdmin, fetchLoggedInUserdata, setRoleAction } from '@/src/actions/auth';
import { UserProvider } from '../../context/UserContext';
import { getSocietyAction, getSocietyDataAction } from '@/src/actions/society';
import { decryptValue } from '@/src/utils/encryptiondecryption';
import axios from 'axios';
import { SubscriptionsProvider } from '../../context/SubscriptionContext';
import { CouponsProvider } from '../../context/CouponsContext';
import { PaymentProvider } from '../../context/PaymentContext';
import { MoreDetailsProvider } from '../../context/MoreDetails';
import { setAuthCookie } from '@/src/actions/api';
import { setSocietyIdInLocalStorage } from '@/src/utils/auth';
// import { MoreDetailsContext, MoreDetailsProvider
// import { MoreDetailsProvider, useMoreDetailsContext } from '../../context/MoreDetails';

const drawerWidth = 240;
// Utility function to truncate text
// const truncateText = (text = '', maxLength = 20) => {
//   if (!text) return '';
//   return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
// };
const truncateTextWithTwoLines = (text = '', maxLengthPerLine = 20) => {
  if (!text) return '';
  if (text.length <= maxLengthPerLine * 2) {
    return text.length <= maxLengthPerLine
      ? text
      : `${text.substring(0, maxLengthPerLine)}\n${text.substring(maxLengthPerLine)}`;
  }
  return `${text.substring(0, maxLengthPerLine)}\n${text.substring(maxLengthPerLine, maxLengthPerLine * 2)}...`;
};

// const splitTextToLines = (text = '', maxLength = 20) => {
//   if (!text) return [];
//   const parts = [];
//   for (let i = 0; i < text.length; i += maxLength) {
//     parts.push(text.substring(i, i + maxLength));
//   }
//   return parts;
// };
// const splitTextToLinesdesc = (text = '', maxLength = 30) => {
//   if (!text) return [];
//   const parts = [];
//   for (let i = 0; i < text.length; i += maxLength) {
//     parts.push(text.substring(i, i + maxLength));
//   }
//   return parts;
// };

// const { showMoreDetails, toggleDetails } = useMoreDetailsContext();

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  useAuthRedirect();
  const getDefaultMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) return savedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [mode, setMode] = useState(getDefaultMode);
  const [userData, setUserData] = React.useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const customTheme = useMemo(() => theme(mode), [mode]);
  const [title, setTitle] = useState('Members');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const [societyLogo, setSocietyLogo] = useState(null);
  const [adminPrivileges, setAdminPrivileges] = React.useState<any>(null);
  const [firstName, setFirstName] = React.useState<any>(null);
  const [userId, setUserId] = React.useState<any>(null);
  const [lastName, setLastName] = React.useState<any>(null);
  const [profilePicture, setProfilePicture] = React.useState<any>(null);
  const [societyData, setSocietyData] = useState(null);
  const [societies, setSocieties] = useState([])
  console.log('userData', userData);
  console.log('societies userData', societies);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = await searchParams.get('token');
      const role = await localStorage.getItem('flow')
      const subDomain = await searchParams.get('subDomain');
      const societyId = await searchParams.get('societyId');
      console.log("token", token)
      console.log("SUBDOMAIN", subDomain)
      // const token = await localStorage.getItem('authToken')
      // const subDomain = await localStorage.getItem('subDomain')
      if (token && subDomain && societyId) {
        await setSocietyIdInLocalStorage({ societyName: subDomain, societyId: societyId })
        await setAuthCookie(token, subDomain, societyId)
      }
      if (!role) {
        await setRoleAction();
      }

      const data = await fetchLoggedInUserdata();
      console.log('fetchLoggedInUserdata dda ', data);
      let userSocieties = [];
      data?.societyMembers?.map((societyMember) => {
        userSocieties.push(societyMember?.society)
      })
      // setSocieties(data?.Society)
      setSocieties(userSocieties)
      setAdminPrivileges(data?.isAdmin);
      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setUserId(data?.userId);
      setProfilePicture(data?.profilePicture)
      console.log('Fetched User Data:', data?.firstName, data?.isAdmin); // Console the fetched user data
      setUserData(data); // Set the fetched data to state
    };

    fetchData();
  }, []);

  useEffect(() => {
    const encryptedId = localStorage.getItem('societyId');
    if (encryptedId) {
      const societyID = decryptValue(encryptedId);
      const getSociety = async () => {
        try {
          // Fetch society details using decryptedValues.societyId
          const values = await getSocietyAction(societyID);
          setSocietyData(values?.data?.society);
          // setSocietyLogo(values.data.societyLogo);
          console.log('VALUES EFFECT', values);
        } catch (error) {
          console.error('Error fetching society details:', error);
        }
      };

      if (societyID) {
        getSociety(); // Fetch society data
      }
    }
  }, []);

  useEffect(() => {
    const writeManifest = async () => {
      if (!societyData) return; // Ensure societyData exists before proceeding
      try {
        console.log('Writing manifest...');
        const updateManifest = await axios.post('/api/update-files', {
          societyId: societyData.societyId,
        });
        console.log('updateManifest', updateManifest);
        // if (updateManifest.status === 200) {
        //     window.location.reload();
        // }
        // Dynamically update the manifest link tag
        const newManifestLink = document.createElement('link');
        newManifestLink.rel = 'manifest';
        newManifestLink.href = `/manifest.webmanifest?t=${new Date().getTime()}`; // Add a timestamp to avoid caching issues

        // Find the current manifest link and replace it
        const oldManifestLink = document.querySelector('link[rel="manifest"]');
        if (oldManifestLink) {
          document.head.removeChild(oldManifestLink);
        }

        document.head.appendChild(newManifestLink);
      } catch (error) {
        console.error('Error updating manifest file:', error);
      }
    };

    if (societyData) {
      const res = writeManifest();
      // Call writeManifest when societyData is updated
    }
  }, [societyData]);
  console.log('societyData', societyData);

  const handleDisplayProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleClose = () => {
    setShowProfileModal(false);
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdminAccess, setIsSuperAdminAccess] = useState<boolean | null>(
    true
  );
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);

  useEffect(() => {
    const pathName = window.location.pathname;  // Assuming you're using pathname to set the menu title
    switch (pathName) {
      case '/members': {
        setTitle('Members');
        break;
      }
      case '/committee': {
        setTitle('Committee');
        break;
      }
      case '/events': {
        setTitle('Events');
        break;
      }
      case '/Charges': {
        setTitle('Charges/Fees');
        break;
      }
      case '/chat': {
        setTitle('Chat');
        break;
      }
      case '/profile': {
        setTitle('Profile');
        break;
      }

      default:
        break;
    }
  }, []);

  const handleSubscriptionClick = () => {
    console.log('Subscription is clicked');
    setTitle('Subscriptions');
    // You can add more functionality here if needed
  };

  const handleUpgragePlan = () => {
    router.push('/subscriptions');
    setTitle('Subscriptions');
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLoggedInUserdata();
      console.log('dda', data);
      setAdminPrivileges(data.isAdmin);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setUserId(data.userId);
      setProfilePicture(data.profilePicture)
      console.log('Fetched User Data:', data.firstName, data.isAdmin); // Console the fetched user data
      setUserData(data); // Set the fetched data to state
    };

    fetchData();
  }, []);
  console.log('userData in side', userData);
  console.log('data in', firstName, adminPrivileges, lastName, userId);

  useEffect(() => {
    const checkAccess = async () => {
      const isSuperAdmin = await checkisSuperAdmin(
        userId
      );
      console.log('Is user a societySuperAdmin1111:', isSuperAdmin);
      setIsSuperAdminAccess(isSuperAdmin);
    };

    checkAccess();
  }, [userId]);

  console.log('super admin', isSuperAdminAccess);

  useEffect(() => {
    const fetchSociety = async () => {
      const encryptedId = localStorage.getItem('societyId');
      const data = await getSocietyDataAction(encryptedId);
      console.log('data', data);
      if (data?.data?.societyLogo) {
        setSocietyLogo(data?.data?.societyLogo);
      }
    };
    fetchSociety();
  }, []);
  const toggleTheme = (mode: string) => {
    setMode(mode);
    localStorage.setItem('themeMode', mode);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (dataTitle: string) => {
    setTitle(dataTitle);
  };

  console.log("name,add,des", societyData)
  const drawer = (
    <div
      style={{
        backgroundColor: mode === 'light' ? '#F5F6FA' : '#16151C',
        height: '100%',
        position: 'relative',
      }}
    >
      {mobileOpen && (
        <IconButton
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: 'inherit',
          }}
          onClick={handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      )}
      {societyLogo ? (
        <img
          // src="/images/sidebarlogo.png"
          // src="/rajdeep.png"
          src={`data:image/png;base64,${societyLogo}`}
          style={{
            width: '7rem',
            height: '5.5rem',
            marginTop: '1.5rem',
            marginLeft: '25%',
            objectFit: 'contain',
          }}
        />
      ) : (
        <img
          src="/images/sidebarlogo.png"
          // src="/images/landingpagelogo.png"
          // src="/rajdeep.png"
          // src={`data:image/jpeg;base64${societyLogo}`}
          style={{
            width: '7rem',
            height: '5.5rem',
            marginTop: '1.5rem',
            marginLeft: '25%',
            objectFit: 'contain',
          }}
        />
      )}
      <Toolbar />
      <List style={{ marginTop: '-2.7rem', marginLeft: '7%' }}>


        <ListItem
          button
          onClick={() => {
            handleMenuClick('Members');
            // router.push('/members');
            window.location.href = '/members';
          }}
          style={{
            backgroundColor: title === 'Members' ? '#465FF1' : 'transparent',
            color: title === 'Members' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Members' ? 'white' : 'inherit',
            }}
          >
            <MdGroups size={24} />
          </ListItemIcon>
          <ListItemText primary="Members" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            handleMenuClick('Committee');
            router.push('/committee');
            window.location.href = '/committee';
          }}
          style={{
            backgroundColor: title === 'Committee' ? '#465FF1' : 'transparent',
            color: title === 'Committee' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Committee' ? 'white' : 'inherit',
            }}
          >
            <Diversity2Icon />
          </ListItemIcon>
          <ListItemText primary="Committee" />
        </ListItem>



        <ListItem
          button
          onClick={() => {
            handleMenuClick('Events');
            // router.push('/events');
            window.location.href = '/events';
          }}
          style={{
            backgroundColor: title === 'Events' ? '#465FF1' : 'transparent',
            color: title === 'Events' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Events' ? 'white' : 'inherit',
            }}
          >
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleMenuClick('Charges/Fees');
            // router.push('/Charges');
            window.location.href = '/Charges';
          }}
          style={{
            backgroundColor:
              title === 'Charges/Fees' ? '#465FF1' : 'transparent',
            color: title === 'Charges/Fees' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Charges/Fees' ? 'white' : 'inherit',
            }}
          >
            <AiOutlineDollar size={24} />
          </ListItemIcon>
          <ListItemText primary="Charges/Fees" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleMenuClick('Chat');
            // router.push('/chat');
            window.location.href = '/chat';
          }}
          style={{
            backgroundColor: title === 'Chat' ? '#465FF1' : 'transparent',
            color: title === 'Chat' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Chat' ? 'white' : 'inherit',
            }}
          >
            <SmsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleMenuClick('Profile');

            // router.push('/profile');

            window.location.href = '/profile';
          }}
          style={{
            backgroundColor: title === 'Profile' ? '#465FF1' : 'transparent',
            color: title === 'Profile' ? 'white' : 'inherit',
            width: 'fit-content',
            paddingRight: '13%',
            borderRadius: '16px',
          }}
        >
          <ListItemIcon
            style={{
              color: title === 'Profile' ? 'white' : 'inherit',
            }}
          >
            <AccountCircleIcon />

          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
      <Box
        sx={{
          margin: {
            xs: '1rem 116px',
            sm: '1rem 75px',
          },
        }}
      >
        <img
          src="/images/sidebarImage.png"
          alt="Sidebar Image"
          style={{
            width: '8rem',
            height: 'auto',
          }}
        />
      </Box>
      {isAdmin && isSuperAdminAccess && (
        <ButtonInput
          fontSize={14}
          onClick={handleUpgragePlan}
          type="button"
          styles={{ width: '80%', marginTop: '1.6rem', marginLeft: '1.5rem' }}
          text={'Upgrade your plan'}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem',
          width: '100%',
        }}
      >
        <ButtonInput
          onClick={() => {
            toggleTheme('light');
            console.log('Light button is active');
          }}
          // classes={{
          //   marginLeft: 'auto',
          //   border: 'none',
          //   background: mode === 'light' ? '#000' : 'none', // Background based on active state
          // }}
          type="button"
          styles={{
            width: '45%',
            marginRight: '0.5rem',
            backgroundColor: mode === 'light' ? '#465FF1' : '#E0E0E0',
            color: mode === 'light' ? 'white' : 'black', // Text color based on mode
          }}
          fontSize={16}
          fontWeight={500}
          text={'Light'}
          icon={
            <WbSunnyIcon
              style={{
                color: mode === 'light' ? 'white' : 'black',
                fontSize: '16',
                fontWeight: '500',
              }}
            />
          } // Icon color based on mode
        />

        <ButtonInput
          onClick={() => {
            toggleTheme('dark');
            console.log('Dark button is active');
          }}
          type="button"
          // classes={{
          //   marginLeft: 'auto',
          //   border: 'none',
          //   background: mode === 'dark' ? '#000' : 'none', // Background based on active state
          // }}
          styles={{
            width: '45%',
            backgroundColor: mode === 'dark' ? '#465FF1' : '#E0E0E0',
            color: mode === 'dark' ? 'white' : 'black', // Text color based on mode
          }}
          fontSize={16}
          fontWeight={500}
          icon={
            <GoMoon
              style={{
                color: mode === 'dark' ? 'white' : 'black',
                fontSize: '16',
                fontWeight: '500',
              }}
            />
          } // Icon color based on mode
          text={'Dark'}
        />
      </div>
    </div>
  );
  return (
    <html lang="en">
      <body>

        <AppRouterCacheProvider options={{ key: 'css' }}>

          <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: '#000',
                  color: '#fff',
                  borderRadius: '10px',
                },
              }}
            />
            <UserProvider>
              <EventProvider>
                <ChargesProvider>
                  <MemberProvider>
                    <SubscriptionsProvider>
                      <CouponsProvider>
                        <PaymentProvider>
                          <MoreDetailsProvider>
                            <Box sx={{ display: 'flex' }}>
                              <AppBar
                                position="absolute"
                                sx={{
                                  zIndex: (theme) => theme.zIndex.drawer + 1,

                                  backgroundColor:
                                    mode === 'dark' ? 'black' : 'transparent',
                                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                                  ml: { sm: mobileOpen ? `${drawerWidth}px` : '0' },
                                  transition: 'width 0.3s ease-in-out', // Add transition for smooth effect
                                  display: {
                                    xs: mobileOpen ? 'none' : 'block',
                                    sm: 'block',
                                  },
                                  boxShadow: 'none',
                                }}
                              >
                                <Toolbar sx={{ justifyContent: 'space-between' }}>
                                  <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{
                                      mr: 2,
                                      display: { xs: 'block', sm: 'none' },
                                      color: mode === 'light' ? 'black' : '',
                                    }}
                                  >
                                    <MenuIcon />
                                  </IconButton>
                                  <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{
                                      color: mode === 'light' ? 'black' : 'white',
                                      // Use a media query for marginLeft
                                      marginLeft: {
                                        // xs: '0', // Default for small screens
                                        // sm: '0', // Default for medium and larger screens
                                        '@media (max-width: 600px)': {
                                          marginLeft: '-4rem', // Apply this only for mobile view
                                        },
                                      },
                                    }}
                                  >
                                    {title}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 2,
                                      color: mode === 'light' ? 'black' : 'white',
                                    }}
                                  >
                                    {/* <IconButton color="inherit">
                                  <NotificationsNoneIcon />
                                </IconButton> */}
                                    <IconButton color="inherit" onClick={handleDisplayProfileModal}>
                                      <Avatar
                                        // sx={{ bgcolor: blue[100], color: blue[600], marginRight: 3 }}
                                        src={profilePicture || undefined}
                                      >
                                        {!profilePicture && <MdFace3 />}
                                      </Avatar>
                                    </IconButton>

                                  </Box>
                                </Toolbar>
                                {showProfileModal && (
                                  <ProfileModal
                                    open={showProfileModal}
                                    onClose={handleClose}
                                    userId={userId}
                                    firstName={firstName}
                                    lastName={lastName}
                                    adminPrivileges={adminPrivileges}
                                    profilePicture={userData.profilePicture}
                                    onSubscriptionClick={handleSubscriptionClick}
                                    societies={societies}
                                  />
                                )}
                              </AppBar>

                              <Drawer
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{
                                  keepMounted: true,
                                }}
                                sx={{
                                  display: { xs: 'block', sm: 'none', md: 'none' }, // Hide on medium screens
                                  '& .MuiDrawer-paper': {
                                    boxSizing: 'border-box',
                                    width: drawerWidth,
                                  },
                                }}
                              >
                                {drawer}
                              </Drawer>

                              <Drawer
                                variant="permanent"
                                ModalProps={{
                                  keepMounted: true,
                                }}
                                sx={{
                                  display: { xs: 'none', sm: 'none', md: 'block' }, // Display only on large screens and above
                                  '& .MuiDrawer-paper': {
                                    boxSizing: 'border-box',
                                    width: drawerWidth,
                                    maxWidth: drawerWidth,
                                  },
                                }}
                                open
                              >
                                {drawer}
                              </Drawer>

                              <Box
                                component="main"
                                sx={{
                                  flexGrow: 1,
                                  p: 3,
                                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                                }}
                              >
                                <Toolbar />
                                {children}

                              </Box>
                              {/* <Box
  component="footer"
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: mode === 'dark' ? '#465FF1' : '#465FF1',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: '1rem',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    zIndex: 1000,
  }}
>
  <Typography
    variant="body2"
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <span style={{ fontWeight: 700, fontSize: '20px', wordWrap: 'break-word' }}>
      {splitTextToLines(societyData?.societyName, 20).map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </span>
    <Box
      sx={{
        height: '30px',
        borderLeft: '2px solid #000',
      }}
    />
    <span style={{ fontWeight: 300, fontSize: '19px', wordWrap: 'break-word' }}>
      {splitTextToLines(societyData?.address, 25).map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </span>
    <Box
      sx={{
        height: '30px',
        borderLeft: '2px solid #000',
      }}
    />
    <span style={{ fontWeight: 300, fontSize: '19px', wordWrap: 'break-word' }}>
      {splitTextToLinesdesc(societyData?.description, 30).map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </span>
  </Typography>
</Box> */}

                              {/* <Box
  component="footer"
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0, // Ensure it doesn't overlap with the sidebar
    width: '100%',
    backgroundColor: mode === 'dark' ? '#465FF1' : '#465FF1',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: '1rem',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap', // Allow wrapping
    zIndex: 1000, // Ensure it stays on top
  }}
>
  
 <Typography
  variant="body2"
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'center', // Align content dynamically
    width: '100%',
    textAlign: 'center',
    whiteSpace: 'pre-wrap', // Preserve line breaks
  }}
>
  <span style={{ fontWeight: 700, fontSize: '20px', wordWrap: 'break-word' }}>
    {truncateTextWithTwoLines(societyData?.societyName, 20)}
  </span>
  <Box
    sx={{
      minHeight: '1rem', // Set a minimum height for smaller content
      borderLeft: '2px solid #000',
      alignSelf: 'stretch', // Make the line stretch dynamically
    }}
  />
  <span style={{ fontWeight: 300, fontSize: '19px', wordWrap: 'break-word' }}>
    {truncateTextWithTwoLines(societyData?.address, 20)}
  </span>
  <Box
    sx={{
      minHeight: '1rem', // Set a minimum height for smaller content
      borderLeft: '2px solid #000',
      alignSelf: 'stretch', // Make the line stretch dynamically
    }}
  />
  <span style={{ fontWeight: 300, fontSize: '19px', wordWrap: 'break-word' }}>
    {truncateTextWithTwoLines(societyData?.description, 20)}
  </span>
</Typography>

</Box> */}




                            </Box>
                          </MoreDetailsProvider>
                        </PaymentProvider>
                      </CouponsProvider>
                    </SubscriptionsProvider>
                  </MemberProvider>
                </ChargesProvider>
              </EventProvider>
            </UserProvider>
          </ThemeProvider>

        </AppRouterCacheProvider>


      </body>
    </html>
  );
}
