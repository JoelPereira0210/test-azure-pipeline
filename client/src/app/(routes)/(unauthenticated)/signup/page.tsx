'use client';
import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SignUpForm from '@/src/forms/SignUpForm';
import OTPForm from '@/src/forms/OTPForm';
import useMediaQuery from '@mui/material/useMediaQuery';
import SignInForm from '@/src/forms/SignInForm';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
type Props = {};

const Login = (props: Props) => {
  const [steps, setSteps] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(''); //chnage this
  const [selectedTab, setSelectedTab] = useState(0); // 0 for SignUp, 1 for SignIn
  const matches = useMediaQuery('(min-width:768px)');
  const theme = useTheme();
  const mode = theme.palette.mode;
  console.log('matches', matches);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSignIn = params.has('signin'); // Check if 'signin' query param exists
    setSelectedTab(isSignIn ? 1 : 0);
  }, []);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
        }}
        className=""
      >
        <Box className="h-fit md:h-4/5 w-full  flex flex-col md:justify-center md:items-center justify-start items-start "
        // sx={{
        //   backgroundColor: `${mode === 'light'
        //     ? 'var(--tw-bg-light-purpleBackground)'
        //     : 'var(--tw-bg-dark-main)'
        //     }`,
        // }}
        >
          <Tabs
            className={`w-full md:max-w-[358px] max-w-full ${mode === 'light' ? 'bg-light-main md:bg-light-background' : 'bg-dark-background'}`}
            selectedIndex={selectedTab}
            onSelect={(index) => setSelectedTab(index)} // Update selected tab state
          >
            <Box className=" pt-10 md:pt-0 pb-10 md:pb-0"
            // sx={{
            //   backgroundColor: `${mode === 'light'
            //     ? 'var(--tw-bg-light-main)'
            //     : 'var(--tw-bg-dark-main)'
            //     }`,
            // }}
            >
              <Box
                sx={{
                  padding: '20px 20px 10px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  marginLeft: '20px',
                  marginRight: '20px',
                }}
                className={'flex flex-col bg-[#30449E] md:bg-transparent'}
              >
                <Box
                  className="md:hidden flex flex-col text-center "
                  marginBottom={4}
                >
                  <Typography variant="text9" sx={{

                    '@media(max-width:768px)': {
                      color: 'var(--tw-text-dark-mainText)',

                    },
                  }}>Welcome to Samudaai</Typography>
                  <Typography variant="text6" sx={{

                    '@media(max-width:768px)': {
                      color: 'var(--tw-text-dark-mainText)',
                    },
                  }}>
                    Your Gateway To Effortless Management
                  </Typography>
                </Box>
                {/* <TabList className="max-h-[44px] h-[44px]   md:h-full md:bg-light-purpleBackground md:bg-dark-purpleBackground flex items-center rounded-lg text-light-smallText text-dark-smallText"> */}
                <TabList className={`max-h-[44px] h-[44px] pt-1 pb-1  md:h-full ${mode === 'light' ? 'bg-light-purpleBackground text-light-smallText' : 'bg-white  text-dark-smallText'}   flex items-center rounded-lg`}>
                  <Tab className="max-w-[175px] h-[36px]  w-full mx-2 text-center flex items-center justify-center">
                    Sign Up
                  </Tab>
                  <Tab className="max-w-[175px] h-[36px]  w-full mx-2  text-center flex items-center justify-center">
                    Sign In
                  </Tab>
                </TabList>
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: '20px!important',
                backgroundColor: `${mode === 'light'
                  ? 'var(--tw-bg-light-background)'
                  : 'var(--tw-bg-dark-background)'
                  }`,
              }}
              className=" pt-[54px] h-full  rounded-t-2xl !rounded-t-2xl"
            >
              <TabPanel className="flex flex-col justify-center   items-center ">
                {steps === 1 ? (
                  <>
                    <Typography
                      variant="text13"
                      className="  !mb-[1rem]"
                      sx={{
                        color: `${mode === 'light'
                          ? 'var(--tw-light-mainText)'
                          : 'var(--tw-dark-mainText)'
                          }`,
                      }}
                    >
                      Sign Up
                    </Typography>
                    <Typography
                      variant="text8"
                      fontWeight={500}
                      className="  !mb-[2rem]"
                      sx={{
                        color: `${mode === 'light'
                          ? 'var(--tw-light-mainText)'
                          : 'var(--tw-dark-mainText)'
                          }`,
                      }}
                    >
                      Enter Your Mobile Number To Register
                    </Typography>
                    <SignUpForm
                      setSteps={setSteps}
                      setPhoneNumber={setPhoneNumber}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="text13"
                      className="  !mb-[1rem]"
                      sx={{
                        color: `${mode === 'light'
                          ? 'var(--tw-light-mainText)'
                          : 'var(--tw-dark-mainText)'
                          }`,
                      }}
                    >
                      OTP Verification
                    </Typography>
                    <Typography
                      variant="text8"
                      fontWeight={500}
                      // className=" text-light-mainText !mb-[2rem]"
                      sx={{
                        color: `${mode === 'light'
                          ? 'var(--tw-light-mainText)'
                          : 'var(--tw-dark-mainText)'
                          }`,
                      }}
                    >
                      Enter the OTP sent to {phoneNumber}
                    </Typography>
                    <OTPForm phoneNumber={phoneNumber} />
                  </>
                )}
              </TabPanel>
              <TabPanel className="flex flex-col justify-center   items-center ">

                <SignInForm />
              </TabPanel>
            </Box>
          </Tabs>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '358px',
            width: '100%',
            marginBottom: '30px',
          }}
        >
          <Typography variant="text7" color={'#9C9AA5'}>
            By signing up to create an account I accept Company’s{' '}
            <span
              style={{
                // color: '#26203B',
                color: `${mode === 'light'
                  ? '#26203B'
                  : 'var(--tw-dark-mainText)'
                  }`,
              }}
            >
              <a href="#">
                <strong>Terms of use & Privacy Policy.</strong>
              </a>
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Login;
