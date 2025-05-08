'use client';
import React, { ReactNode, useEffect } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '../../context/UserContext';
import { PaymentProvider } from '../../context/PaymentContext';
import { EventProvider } from '../../context/EventContext';
import { MemberProvider } from '../../context/MemberContext';
import { ChargesProvider } from '../../context/ChargesContext';
import { SubscriptionsProvider } from '../../context/SubscriptionContext';
import { CouponsProvider } from '../../context/CouponsContext';
import { Toaster } from 'react-hot-toast';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMemo, useState } from 'react';
import theme from '@/src/theme/theme';
import { useAuthRedirect } from '../../customHooks/useAuthRedirect';

const drawerWidth = 240;

type Props = {};

export default function UnauthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  useAuthRedirect();

  // Function to get the default theme mode
  const getDefaultMode = () => {
    // Check if there's a theme stored in localStorage
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode;
    }

    // If not, use the device's preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getDefaultMode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const customTheme = useMemo(() => theme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
      return newMode;
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {['Dashboard', 'Profile', 'Settings', 'Logout'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={customTheme}>
            <UserProvider>
              <EventProvider>
                <PaymentProvider>
                  <ChargesProvider>
                    <MemberProvider>
                      <SubscriptionsProvider>
                        <CouponsProvider>
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
                          {children}

                        </CouponsProvider>
                      </SubscriptionsProvider>
                    </MemberProvider>
                  </ChargesProvider>
                </PaymentProvider>
              </EventProvider>
            </UserProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
