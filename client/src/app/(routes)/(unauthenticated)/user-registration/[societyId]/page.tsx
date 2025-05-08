'use client'
import WelcomeContainer from '@/src/component/UI/WelcomeContainer'
import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SignUpForm from '@/src/forms/SignUpForm';
import OTPForm from '@/src/forms/OTPForm';
import useMediaQuery from '@mui/material/useMediaQuery';
import SignInForm from '@/src/forms/SignInForm';
import { decryptMobileSociety } from '@/src/utils/encryptiondecryption';
import UserVerificationForm from '@/src/forms/UserVerificationForm';
import { getSocietyAction } from '@/src/actions/society';
import { Toaster } from 'react-hot-toast';
import CreatePasswordForm from '@/src/forms/CreatePasswordForm';
import axios from 'axios';


const UserRegistration = ({ params }) => {
    console.log("PARAMS", params)
    const decryptedValues = decryptMobileSociety(undefined,params.societyId)
    console.log("decryptedValues", decryptedValues)
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [societyData, setSocietyData] = useState(null);
    const [societyLogo, setSocietyLogo] = useState('');
    const [steps, setSteps] = useState(1);
    const [selectedTab, setSelectedTab] = useState(0); // 0 for SignUp, 1 for SignIn
    const matches = useMediaQuery('(min-width:768px)');
    useEffect(() => {
        const getSociety = async () => {
            try {
                // Fetch society details using decryptedValues.societyId
                const values = await getSocietyAction(decryptedValues.societyId);
                setSocietyData(values.data.society);
                setSocietyLogo(values.data.societyLogo);
                console.log("VALUES EFFECT", values);
            } catch (error) {
                console.error("Error fetching society details:", error);
            }
        };

        if (decryptedValues.societyId) {
            getSociety(); // Fetch society data
        }
    }, [decryptedValues.societyId]);

    useEffect(() => {
        const writeManifest = async () => {
            if (!societyData) return; // Ensure societyData exists before proceeding
            try {
                console.log("Writing manifest...");
                const updateManifest = await axios.post('/api/update-files', { societyId: societyData.societyId });
                console.log("updateManifest", updateManifest);
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
                console.error("Error updating manifest file:", error);
            }
        };

        if (societyData) {
            const res = writeManifest();
            // Call writeManifest when societyData is updated
        }
    }, [societyData]);
    console.log("societyData", societyData)
    return (
        <div>
            <Box className=" m-0 md:m-8 flex flex-col md:flex-row">
                <Box className="w-full md:w-1/2 hidden md:block ">
                    <WelcomeContainer societyName={societyData?.societyName} />
                </Box>
                <Box className="w-full md:w-1/2 flex flex-col  items-center  h-[100vh]">
                    {/* Page */}
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
                                            }}>Welcome to {societyData?.societyName}</Typography>
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
                                            <Tab disabled={true} className="max-w-[175px] h-[36px]  w-full mx-2  text-center flex items-center justify-center">
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
                                                {/* <Typography
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
                                            </Typography> */}
                                                {/* <SignUpForm
                                                setSteps={setSteps}
                                                setPhoneNumber={setPhoneNumber}
                                            /> */}
                                                {societyData && <UserVerificationForm
                                                    phoneNumber={decryptedValues?.phoneNumber}
                                                    societyName={societyData?.societyName}
                                                    societyId={decryptedValues?.societyId}
                                                    setSteps={setSteps}
                                                />}
                                            </>
                                        ) : steps === 2 ? (
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
                                                    Enter the OTP sent to {decryptedValues?.phoneNumber}
                                                </Typography>
                                                <OTPForm phoneNumber={decryptedValues?.phoneNumber} societyId={decryptedValues?.societyId} setSteps={setSteps} />
                                            </>
                                        ) : (
                                            <CreatePasswordForm phoneNumber={decryptedValues?.phoneNumber} societyId={decryptedValues?.societyId}
                                            />
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
                </Box>
            </Box>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                }}
            />
        </div>
    )
}

export default UserRegistration