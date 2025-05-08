'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { blue } from '@mui/material/colors';
import { MdFace3 } from "react-icons/md";
import { checkSocietySuperAdmin } from '@/src/actions/profile';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import Cookies from 'js-cookie';
import { removeAuthCookie } from '@/src/actions/api';

import SocietySelectionProfileModal from './SocietySelectionProfileModal';
import { loginAction } from '@/src/actions/auth';
import SocietySelectionModal from './SocietySelectionModal';
import ApartmentIcon from '@mui/icons-material/Apartment';

import { setSocietyIdInLocalStorage } from '@/src/utils/auth';

type Society = {
  societyId: string;
  societyName: string;
};
export interface SimpleDialogProps {
  open: boolean;
  selectedValue?: string;
  onClose: (value: string) => void;
  firstName: string;
  userId?: string;
  lastName: string;
  adminPrivileges?: boolean;
  profilePicture?: string;  // Added here
  onSubscriptionClick: () => void;
  societies: any
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, firstName, userId, lastName, adminPrivileges, profilePicture, onSubscriptionClick, societies } = props;
  const router = useRouter();
  const cookie = Cookies.get('authToken');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdminAccess, setIsSuperAdminAccess] = useState<boolean | null>(true);
  console.log("object", societies)
  // const [societies, setSocieties] = useState([]);
  const [showSocietyModal, setShowSocietyModal] = useState(false);

  const baseMenuItems = [
    ...(societies?.length > 1 ? [{
      label: 'Switch Society',
      icon: <ApartmentIcon />,
      onClick: () => handleListItemClick('Switch Society'),
    }] : []),
    {
      label: 'Upgrade Plan',
      icon: <UpgradeIcon />,
      onClick: () => handleListItemClick('Upgrade Plan'),
    },
    {
      label: 'Sign Out',
      icon: <LogoutOutlinedIcon />,
      onClick: () => handleListItemClick('Sign Out'),
    },
  ];
  console.log("baseMenuItems", baseMenuItems)
  console.log("societies", societies?.length)
  const getDefaultMode = (): PaletteMode => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };

  useEffect(() => {
    // Check the `flow` value from localStorage and set the `isAdmin` state accordingly
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);


  const [mode, setMode] = useState<PaletteMode>(getDefaultMode());

  const toggleTheme = () => {
    const newMode: PaletteMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: mode,
    },
  }), [mode]);


  const menuItems = localStorage.getItem('isSuperAdmin')
    ? [{
      label: "Sign Out",
      icon: <LogoutOutlinedIcon />,
      onClick: () => handleListItemClick('Sign Out'),
    }] // Return an empty array if 'isSuperAdmin' exists in localStorage
    : [
      ...(localStorage.getItem('flow') !== 'normaluser'
        ? [{
          label: localStorage.getItem('flow') === 'admin' ? 'Switch To User Profile' : 'Switch To Admin Profile',
          icon: <SwitchAccountIcon />,
          onClick: () => handleListItemClick(localStorage.getItem('flow') === 'admin' ? 'Switch To User Profile' : 'Switch To Admin Profile'),
        }]
        : []),
      ...(isSuperAdminAccess && isAdmin ? [{
        label: 'Upgrade Plan',
        icon: <UpgradeIcon />,
        onClick: () => handleListItemClick('Upgrade Plan'),
      }] : []),
      ...baseMenuItems.filter(item => item.label !== 'Upgrade Plan').map(item => ({
        ...item,
        onClick: () => handleListItemClick(item.label),
      })),
    ];


  useEffect(() => {

    const checkAccess = async () => {
      const isSuperAdmin = await checkSocietySuperAdmin(userId);
      console.log('Is user a societySuperAdmin:', isSuperAdmin);
      setIsSuperAdminAccess(isSuperAdmin)
    };
    if (userId) {
      checkAccess();
    }

  }, [userId]);
  console.log("super admin", isSuperAdminAccess)

  const handleListItemClick = async (value: string) => {

    if (value === 'Switch To User Profile') {
      // Set flow to 'adminuser' when switching to user profile
      localStorage.setItem('flow', 'adminuser');
      window.location.reload();
    } else if (value === 'Switch To Admin Profile') {
      // Set flow to 'admin' when switching to admin profile
      localStorage.setItem('flow', 'admin');
      window.location.reload();
    }
    if (value === 'Upgrade Plan') {
      console.log("upgrage")
      onSubscriptionClick();
      // router.push('/subscriptions');
      window.location.href = '/subscriptions'
    }
    if (value === 'Sign Out') {
      await localStorage.removeItem('authToken');
      await localStorage.removeItem('societyId');
      await localStorage.removeItem('isSuperAdmin');
      await localStorage.removeItem('flow');
      await removeAuthCookie();
      // window.location.href = 'http://localhost:3000/signup?signin'
        window.location.href = `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/signup?signin`

      // router.push('/signup?signin');
    }
    if (value === 'Switch Society') {
      setShowSocietyModal(true); // Open society modal
      // onClose(selectedValue); // Close the Profile Modal
      // onClose(value);


    }
    // onClose(value);
  };


  const handleSocietySelection = async (society: Society) => {
    if (society) {
      const success = await setSocietyIdInLocalStorage(society);
      const lastPagePath = await localStorage.getItem('lastVisitedPath')
      const token = await Cookies.get('authToken');
      const data = { token: token, subDomain: society?.societyName, societyId: society?.societyId };
      const queryString = new URLSearchParams(data).toString();
      if (success) {
        // onClose(); // Close the modal only if the operation is successful
        // window.location.reload(); // Fetch data for the selected society
        // window.location.href = `http://${society?.societyName.toLowerCase()}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/members`;
        const formattedSocietyName = society?.societyName.replace(/[\s.]+/g, "-").toLowerCase();
        window.location.href = `https://${formattedSocietyName}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}${lastPagePath}?${queryString}`;
        
        // window.location.href = `http://${society?.societyName.toLowerCase()}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}${lastPagePath}?${queryString}`;
        // window.location.reload(); // Fetch data for the selected society

      }
    }

  };




  // useEffect(() => {
  //   const fetchSocieties = async () => {
  //     // try {
  //     //   const response = await loginAction({ phone_number: '+', password: 'Alister@12345678' }); // Provide actual data
  //     //   console.log('profile modal response', response);
  //     //   if (response?.data?.societies) {
  //     //     setSocieties(response.data.societies);
  //     //   }
  //     // } catch (error) {
  //     //   console.error('Failed to fetch societies:', error);
  //     // }

  //   };

  //   fetchSocieties();
  // }, []);


  console.log('Societies:', societies);
  console.log('Show Society Modal:', showSocietyModal);

  const truncateName = (name, maxLength) => {
    if (name.length > maxLength) {
      return `${name.slice(0, maxLength - 1)}.`; // Truncate and add a pointer
    }
    return name;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={() => onClose(selectedValue)}
          sx={{
            '& .MuiDialog-paper': {
              margin: 0,
              position: 'absolute',
              top: '10%',
              left: '80%',
              transform: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: "max-content",
              overflowX: 'hidden',
              [theme.breakpoints.down('sm')]: {
                left: '31%', top: "7%"
              },
            },
          }}
        >
          <List sx={{ pt: 0, marginLeft: "0.9rem", marginTop: "0.6rem" }}>
            <ListItem disableGutters sx={{ marginLeft: "0.4rem" }}>
              <ListItemAvatar>
                <Avatar
                  sx={{ bgcolor: blue[100], color: blue[600], marginRight: 3 }}
                  src={profilePicture || undefined}
                >
                  {!profilePicture && <MdFace3 />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText sx={{ marginRight: "4%" }}
               /*  primary={`${firstName} ${lastName}`} */
                primary={`${truncateName(firstName, 9)} ${truncateName(lastName, 9)}`}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>

            <Divider sx={{ marginX: 2, borderColor: '#9C9AA5', marginTop: "1rem", marginLeft: "0rem" }} />

            {menuItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem disableGutters>
                  <ListItemButton onClick={item.onClick}>
                    <ListItemAvatar sx={{ minWidth: '40px' }}>
                      {item.icon}
                    </ListItemAvatar>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
                {item.label === 'Upgrade Plan' && <Divider sx={{ marginX: 2, borderColor: '#9C9AA5', marginLeft: "0rem" }} />}
              </React.Fragment>
            ))}
          </List>
        </Dialog>

        {showSocietyModal && (
          // <SocietySelectionModal
          //   societies={societies}
          //   onSelect={handleSocietySelection}
          //   // onClose={() => setShowSocietyModal(false)}
          // />

          <SocietySelectionProfileModal
            open={showSocietyModal}
            societies={societies} // List of societies
            onSelect={handleSocietySelection} // Handle selection
            onClose={() => setShowSocietyModal(false)} // Close the modal
          />

        )}


      </ThemeProvider>




    </>
  );
}

interface SimpleDialogDemoProps {
  firstName: string;
  lastName?: string;
  userId?: string;
  adminPrivileges: boolean;
  open: boolean;
  onClose: (value: string) => void;
  profilePicture?: string;  // Added here
  onSubscriptionClick: () => void;
  societies?: any;
}

export default function SimpleDialogDemo({ firstName, userId, onSubscriptionClick, adminPrivileges, profilePicture, lastName, open, onClose, societies }: SimpleDialogDemoProps) {
  const [selectedValue, setSelectedValue] = useState('Switch To User Profile');
  console.log("societies PROFILE MODAL", societies)
  useEffect(() => {
    if (profilePicture) {
      console.log('Profile Picture URL:', profilePicture);
    }
  }, [profilePicture]);

  return (
    <div>
      {open && (
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          userId={userId}
          onClose={onClose}
          firstName={firstName}
          lastName={lastName}
          onSubscriptionClick={onSubscriptionClick}
          adminPrivileges={adminPrivileges}
          profilePicture={profilePicture}
          societies={societies}// Pass profilePicture to SimpleDialog
        />
      )}
    </div>
  );
}