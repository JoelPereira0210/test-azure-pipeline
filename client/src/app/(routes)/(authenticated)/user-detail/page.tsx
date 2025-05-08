'use client';
import UserDetailsProfile from '@/src/forms/UserDetailsProfile';

import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type Props = {};

const UserDetails = (props: Props) => {
  const [step, setStep] = useState(1);
  const theme = useTheme();
  const router = useRouter()

  return (
    <Box
      className="flex w-full min-h-[100vh]"
      sx={{
        background: `${theme.palette.mode === 'light'
          ? 'var(--tw-bg-light-purpleBackground)'
          : 'var(--tw-bg-dark-background)'
          }`,
      }}
    >
      <Box
        className="flex flex-col items-center  md:m-[20px] sm:m-[0px] w-full h-[100vh-20px] bg-light-background rounded-2xl"
        sx={{
          background: `${theme.palette.mode === 'light'
            ? 'var(--tw-bg-light-background)'
            : 'var(--tw-bg-dark-background)'
            }`,
        }}
      >
        <Box className="mt-20 mb-24 w-full max-w-[970px]">
          <UserDetailsProfile backHandler={() => {
            window.location.href = "/profile"
          }} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetails;
