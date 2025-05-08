'use client';
import SocietyRegistrationForm from '@/src/forms/SocietyRegistrationForm';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type Props = {};

const SocietyRegister = (props: Props) => {
  const [step, setStep] = useState(1);
  const theme = useTheme();
  const router = useRouter()
  const sessionPhoneNumber = sessionStorage.getItem("phoneNumber");
  console.log("sessionPhoneNumber", sessionPhoneNumber)
  useEffect(() => {
    if (!sessionPhoneNumber) {
      console.log("!sessionPhoneNumber")
      router.push('/signup')
    }
  }, [sessionPhoneNumber])
  return (
    
    <Box
      className="flex w-full min-h-[100vh]"
      sx={{
        background: `${theme.palette.mode === 'light'
          ? 'var(--tw-bg-light-purpleBackground)'
          : 'var(--tw-bg-dark-background)'
          }`,
        // backgroundColor:"pink"
      }}
    >
      <Box
        className="flex flex-col items-center  md:m-[20px] sm:m-[0px] w-full h-[100vh-20px] bg-light-background rounded-2xl"
        sx={{
          // background: `${theme.palette.mode === 'light'
          //   ? 'var(--tw-bg-light-background)'
          //   : 'var(--tw-bg-dark-background)'
          //   }`,
         
          
            
          backgroundImage: 'url(/images/register.png)', // Use the same image as the background
          backgroundSize:'cover',
          backgroundPosition:'center',
          
            // backgroundSize: 'contain', // Ensures the image scales to fit the container
            // backgroundRepeat: 'no-repeat', // Prevents the image from repeating
            // backgroundPosition: 'cover', // Centers the image
          
          
        }}
      >
        <Box className="mt-20 mb-24 w-full max-w-[970px]">
          <SocietyRegistrationForm />
        </Box>
      </Box>
    </Box>
   
  );
};

export default SocietyRegister;
