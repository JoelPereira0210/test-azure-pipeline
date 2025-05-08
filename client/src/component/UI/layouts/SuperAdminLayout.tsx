'use client';
import React, { ReactNode, useEffect } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { EventProvider } from '../../context/EventContext';
import { ChargesProvider } from '../../context/ChargesContext';
import { PaymentProvider } from '../../context/PaymentContext';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useMemo, useState } from 'react';
import theme from '@/src/theme/theme';
import ButtonInput from '../Button/Button';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { MdGroups } from 'react-icons/md';
import { AiOutlineDollar } from 'react-icons/ai';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useAuthRedirect } from '../../customHooks/useAuthRedirect';
import { useRouter, usePathname } from 'next/navigation';
import { GoMoon } from 'react-icons/go';
import { Toaster } from 'react-hot-toast';
import ProfileModal from '../../modals/ProfileModal';
import { fetchLoggedInUserdata } from '@/src/actions/auth';
import { UserProvider } from '../../context/UserContext';
import { getSocietyAction, getSocietyDataAction } from '@/src/actions/society';
import { decryptValue } from '@/src/utils/encryptiondecryption';
import axios from 'axios';
import { SubscriptionsProvider } from '../../context/SubscriptionContext';
import { CouponsProvider } from '../../context/CouponsContext';
const drawerWidth = 240;

export default function SuperAdminLayout({
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
    const superAdmin = localStorage.getItem('isSuperAdmin');
    const [mode, setMode] = useState(getDefaultMode);
    const [userData, setUserData] = React.useState<any>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const customTheme = useMemo(() => theme(mode), [mode]);
    const [title, setTitle] = useState('Committee');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();
    const pathName = usePathname();
    //   const [societyLogo, setSocietyLogo] = useState(null)

    //   const [societyData, setSocietyData] = useState(null);
    console.log("userData", userData)
    console.log("superADminnn",superAdmin);
    useEffect(() => {
        console.log("AAAAAAA")
        const fetchData = async () => {
            const data = await fetchLoggedInUserdata();
            console.log('Fetched User Data:', data); // Console the fetched user data
            setUserData(data); // Set the fetched data to state
        };

        fetchData();
    }, [superAdmin]);

    //   useEffect(() => {
    //     console.log("KKKKKKK", !superAdmin)
    //     const encryptedId = localStorage.getItem('societyId')
    //     const societyID = decryptValue(encryptedId)

    //     const getSociety = async () => {
    //       try {
    //         // Fetch society details using decryptedValues.societyId
    //         const values = await getSocietyAction(societyID);
    //         setSocietyData(values.data.society);
    //         // setSocietyLogo(values.data.societyLogo);
    //         console.log("VALUES EFFECT", values);
    //       } catch (error) {
    //         console.error("Error fetching society details:", error);
    //       }
    //     };
    //     if (!superAdmin) {

    //       if (societyID) {
    //         getSociety(); // Fetch society data
    //       }
    //     }
    //   }, [superAdmin]);

    //   useEffect(() => {

    //     const writeManifest = async () => {
    //       if (!societyData) return; // Ensure societyData exists before proceeding
    //       try {
    //         console.log("Writing manifest...");
    //         const updateManifest = await axios.post('/api/update-files', { societyId: societyData.societyId });
    //         console.log("updateManifest", updateManifest);
    //         // if (updateManifest.status === 200) {
    //         //     window.location.reload();
    //         // }
    //         // Dynamically update the manifest link tag
    //         const newManifestLink = document.createElement('link');
    //         newManifestLink.rel = 'manifest';
    //         newManifestLink.href = `/manifest.webmanifest?t=${new Date().getTime()}`; // Add a timestamp to avoid caching issues

    //         // Find the current manifest link and replace it
    //         const oldManifestLink = document.querySelector('link[rel="manifest"]');
    //         if (oldManifestLink) {
    //           document.head.removeChild(oldManifestLink);
    //         }

    //         document.head.appendChild(newManifestLink);
    //       } catch (error) {
    //         console.error("Error updating manifest file:", error);
    //       }
    //     };
    //     if (!superAdmin) {

    //       if (societyData) {
    //         const res = writeManifest();
    //         // Call writeManifest when societyData is updated
    //       }
    //     }
    //   }, [societyData, superAdmin]);
    //   console.log("societyData", societyData)




    const handleDisplayProfileModal = () => {
        setShowProfileModal(true);

    }
    const handleClose = () => {
        setShowProfileModal(false); // Close the modal
    };


    useEffect(() => {
        switch (pathName) {
            // case '/members': {
            //     setTitle('Members');
            //     break;
            // }
            // case '/committee': {
            //     setTitle('Committee');
            //     break;
            // }
            // case '/events': {
            //     setTitle('Events');
            //     break;
            // }
            // case '/Charges': {
            //     setTitle('Charges/Fees');
            //     break;
            // }
            // case '/chat': {
            //     setTitle('Chat');
            //     break;
            // }
            // case '/profile': {
            //     setTitle('Profile');
            //     break;
            // }
            case '/create-subscriptions': {
                setTitle('Subscriptions');
                break;
            }
            case '/coupons': {
                setTitle('Coupons');
                break;
            }
            case '/bank-details': {
                setTitle('Bank Details');
                break;
            }
            case '/landing-cards': {
                setTitle('Landing Cards');
                break;
            }
            default:
                break;
        }
    }, []);



    //   useEffect(() => {
    //     const fetchSociety = async () => {
    //       const encryptedId = localStorage.getItem('societyId')
    //       const data = await getSocietyDataAction(encryptedId);
    //       console.log("data", data)
    //       if (data.data.societyLogo) {
    //         setSocietyLogo(data.data.societyLogo)
    //       }
    //     }
    //     if (!superAdmin) {

    //       fetchSociety();
    //     }
    //   }, [superAdmin])
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
            {/* {societyLogo ? <img
        // src="/images/sidebarlogo.png"
        // src="/rajdeep.png"
        src={`data:image/png;base64,${societyLogo}`}
        style={{
          width: '7rem',
          height: '5.5rem',
          marginTop: '1.5rem',
          marginLeft: '25%',
          objectFit: 'contain'
        }}
      /> 
      : 
      ( */}
            <img
                src="/images/sidebarlogo.png"
                // src="/rajdeep.png"
                // src={`data:image/jpeg;base64${societyLogo}`}
                style={{
                    width: '7rem',
                    height: '5.5rem',
                    marginTop: '1.5rem',
                    marginLeft: '25%',
                    objectFit: 'contain'
                }}
            />
            {/* )} */}
            <Toolbar />
            <List style={{ marginTop: '-2.7rem', marginLeft: '7%' }}>
                {/* <ListItem
                    button
                    onClick={() => {
                        handleMenuClick('Committee');
                        router.push('/committee');
                        window.location.href = "/committee"
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
                        handleMenuClick('Members');
                        // router.push('/members');
                        window.location.href = "/members"

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
                        handleMenuClick('Events');
                        // router.push('/events');
                        window.location.href = "/events"

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
                        window.location.href = "/Charges"

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
                        window.location.href = "/chat"

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
                        window.location.href = "/profile"

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
                </ListItem> */}
                <ListItem
                    button
                    onClick={() => {
                        handleMenuClick('Subscriptions');
                        // router.push('/profile');
                        window.location.href = "/create-subscriptions"

                    }}
                    style={{
                        backgroundColor: title === 'Subscriptions' ? '#465FF1' : 'transparent',
                        color: title === 'Subscriptions' ? 'white' : 'inherit',
                        width: 'fit-content',
                        paddingRight: '13%',
                        borderRadius: '16px',
                    }}
                >
                    <ListItemIcon
                        style={{
                            color: title === 'Subscriptions' ? 'white' : 'inherit',
                        }}
                    >
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Subscriptions" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        handleMenuClick('Coupons');
                        // router.push('/profile');
                        window.location.href = "/coupons"

                    }}
                    style={{
                        backgroundColor: title === 'Coupons' ? '#465FF1' : 'transparent',
                        color: title === 'Coupons' ? 'white' : 'inherit',
                        width: 'fit-content',
                        paddingRight: '13%',
                        borderRadius: '16px',
                    }}
                >
                    <ListItemIcon
                        style={{
                            color: title === 'Coupons' ? 'white' : 'inherit',
                        }}
                    >
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Coupons" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        handleMenuClick('Bank Details');
                        // router.push('/profile');
                        window.location.href = "/bank-details"

                    }}
                    style={{
                        backgroundColor: title === 'Bank Details' ? '#465FF1' : 'transparent',
                        color: title === 'Bank Details' ? 'white' : 'inherit',
                        width: 'fit-content',
                        paddingRight: '13%',
                        borderRadius: '16px',
                    }}
                >
                    <ListItemIcon
                        style={{
                            color: title === 'Bank Details' ? 'white' : 'inherit',
                        }}
                    >
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Bank Details" />
                </ListItem>

                <ListItem
                    button
                    onClick={() => {
                        handleMenuClick('Landing Cards');
                        window.location.href = "/landing-cards"

                    }}
                    style={{
                        backgroundColor: title === 'Landing Cards' ? '#465FF1' : 'transparent',
                        color: title === 'Landing Cards' ? 'white' : 'inherit',
                        width: 'fit-content',
                        paddingRight: '13%',
                        borderRadius: '16px',
                    }}
                >
                    <ListItemIcon
                        style={{
                            color: title === 'Landing Cards' ? 'white' : 'inherit',
                        }}
                    >
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Landing Cards" />
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

            <ButtonInput
                fontSize={14}
                type='button'
                styles={{ width: '80%', marginTop: '1.6rem', marginLeft: '1.5rem' }}
                text={'Upgrade your plan'}
            />


            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', width: '100%' }}>
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
                    type='button'
                    styles={{
                        width: '45%',
                        marginRight: '0.5rem',
                        backgroundColor: mode === 'light' ? '#465FF1' : '#E0E0E0',
                        color: mode === 'light' ? 'white' : 'black', // Text color based on mode
                    }}
                    fontSize={16} fontWeight={500}
                    text={'Light'}
                    icon={<WbSunnyIcon style={{ color: mode === 'light' ? 'white' : 'black', fontSize: "16", fontWeight: "500" }} />} // Icon color based on mode
                />

                <ButtonInput
                    onClick={() => {
                        toggleTheme('dark');
                        console.log('Dark button is active');
                    }}
                    type='button'
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
                    fontSize={16} fontWeight={500}
                    icon={<GoMoon style={{ color: mode === 'dark' ? 'white' : 'black', fontSize: "16", fontWeight: "500" }} />} // Icon color based on mode
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
                                    <SubscriptionsProvider>
                                        <CouponsProvider>
                                            <PaymentProvider>
                                                <Box sx={{ display: 'flex' }}>

                                                    <AppBar
                                                        position="absolute"
                                                        sx={{
                                                            // zIndex: (theme) => theme.zIndex.drawer + 1,
                                                            zIndex: "1",
                                                            backgroundColor: mode === 'dark' ? 'black' : 'transparent',
                                                            width: { sm: `calc(100% - ${drawerWidth}px)` },
                                                            ml: { sm: mobileOpen ? `${drawerWidth}px` : '0' },
                                                            transition: 'width 0.3s ease-in-out', // Add transition for smooth effect
                                                            display: { xs: mobileOpen ? 'none' : 'block', sm: 'block' },
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
                                                                <IconButton color="inherit">
                                                                    <NotificationsNoneIcon />
                                                                </IconButton>
                                                                <IconButton color="inherit" onClick={handleDisplayProfileModal}>
                                                                    <AccountCircleIcon />
                                                                </IconButton>
                                                                {/* <IconButton color="inherit" onClick={handleDisplayProfileModal}>
                                                                <MoreVertIcon />
                                                            </IconButton> */}
                                                            </Box>
                                                        </Toolbar>
                                                        {showProfileModal && (
                                                            <ProfileModal
                                                                open={showProfileModal}
                                                                onClose={handleClose}
                                                                userId={'userId'}
                                                                firstName={userData?.user?.firstName ?? "Super"}
                                                                lastName={userData?.user?.lastName ?? "Admin"}
                                                                adminPrivileges={userData?.user?.isAdmin ?? false}
                                                                onSubscriptionClick={() => console.log('hu')}
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
                                                            display: { xs: 'block', sm: 'none' },
                                                            '& .MuiDrawer-paper': {
                                                                boxSizing: 'border-box',
                                                                width: drawerWidth,
                                                            },
                                                        }}
                                                    >
                                                        {drawer}
                                                    </Drawer>

                                                    <Drawer
                                                        variant="temporary"
                                                        open={mobileOpen}
                                                        onClose={handleDrawerToggle}
                                                        ModalProps={{
                                                            keepMounted: true,
                                                        }}
                                                        sx={{
                                                            display: { xs: 'block', sm: 'none' },
                                                            '& .MuiDrawer-paper': {
                                                                boxSizing: 'border-box',
                                                                width: '100%',
                                                                maxWidth: '100%',
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
                                                            display: { xs: 'none', sm: 'block' },
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
                                                </Box>
                                            </PaymentProvider>
                                        </CouponsProvider>
                                    </SubscriptionsProvider>
                                </ChargesProvider>
                            </EventProvider>
                        </UserProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
