'use client';
import ButtonInput from '@/src/component/UI/Button/Button';
import Subscription from '@/src/component/UI/Subscription';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
// import { ThemeProviderWrapper } from '../component/context/ThemeContext'
import { isAuthenticated } from '../utils/auth';
import { ThemeProvider } from '@emotion/react';
import { useAuthRedirect } from '../component/customHooks/useAuthRedirect';
import Header from '../component/UI/LandingPage/Header';
import ContactFormLandingPage from '../component/UI/LandingPage/ContactForm';
import Banner from '../component/UI/LandingPage/Banner';
import Discover from '../component/UI/LandingPage/Discover';
import AboutUs from '../component/UI/LandingPage/AboutUs';
import Plans from '../component/UI/LandingPage/Plans';
//comment
type Props = {};

const Home = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useAuthRedirect();
  // useEffect(() => {
  //   const authenticated = isAuthenticated();
  //   // if (authenticated) {
  //   //   router.push('/committee');
  //   // }
  // }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(function (registration) {
            console.log('Service Worker registered with scope: ', registration.scope);
          })
          .catch(function (error) {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <>

      <Box>
        <Header />
        <Banner />
        <Discover/>
         <AboutUs/>
        <Plans/>
        <ContactFormLandingPage /> 
        
        
      </Box>
      <Toaster />
    </>
  );
};

export default Home;