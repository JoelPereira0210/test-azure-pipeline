'use client';
import ButtonInput from '@/src/component/UI/Button/Button';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type Props = {};

const Welcome = (props: Props) => {
  const router = useRouter();
  const theme = useTheme()
  const [loading, setLoading] = useState(false);
  const sessionPhoneNumber = sessionStorage.getItem("phoneNumber");
  console.log("sessionPhoneNumber", sessionPhoneNumber)
  useEffect(() => {
    if (!sessionPhoneNumber) {
      console.log("!sessionPhoneNumber")
      router.push('/signup')
    }
  }, [sessionPhoneNumber])
  return (
    <Box className={`flex  w-full min-h-[100vh] `}
      sx={{
        background: `${theme.palette.mode === 'light'
          ? 'var(--tw-bg-light-purpleBackground)'
          : 'var(--tw-bg-dark-background)'
          }`,
      }}
    >
      <Box className="flex flex-col justify-center items-center md:m-[20px] sm:m-[0px] w-full h-[100vh-20px]  rounded-2xl"
        sx={{
          background: `${theme.palette.mode === 'light'
            ? 'var(--tw-bg-light-background)'
            : 'var(--tw-bg-dark-background)'
            }`,
        }}
      >
        <Box className="flex flex-col justify-between items-center mt-20 mb-24 w-full max-w-[970px] max-h-[450px] h-full ">
          <Box className="flex flex-col justify-between items-center text-center">
            <Image
              src="/images/welcomeIcon.png"
              width={180}
              height={180}
              alt="Society Created"
            />
            <Typography variant="text1" marginTop={3}>
              Society created successfully!
            </Typography>
            <Typography variant="text10" fontSize={24}>
              Welcome aboard! Start your success journey.
            </Typography>
          </Box>
          <ButtonInput
            type="button"
            text="Let's Start!"
            styles={{ maxWidth: '210px' }}
            disabled={false}
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.location.href='/subscriptions';
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
