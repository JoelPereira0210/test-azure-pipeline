import React, { useState,useEffect } from 'react';
import SocietyDetailsForm from './SocietyDetailsForm';
import UserDetailsForm from './UserDetailsForm';
import { societyRegistrationTransformer } from '../utils/formTransformers';
import { registerSocietyAction } from '../actions/auth';
import { Box } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocietyRegisterType } from '../lib/types/registerSociety.types';
import { checkAndFetchUserDetails } from '../actions/auth';

const SocietyRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false); // Track if user exists
  const searchParams = useSearchParams();
  const router = useRouter();
  // use the number passed in the query here
  const phoneNumber = JSON.parse(sessionStorage.getItem('phoneNumber'));

  console.log('Mobile Number from localStorage:', phoneNumber);
  const defaults = {
    // societyName: 'a',
    // societyDescription: 'a',
    // buildingName: 'a',
    // societyBuildingDoorNumber: 'a',
    // societyAddress: 'a',
    // societyStreetName: 'a',
    // societyState: {
    //   id: 4023,
    //   name: 'Andaman and Nicobar Islands',
    //   state_code: 'AN',
    //   value: 'Andaman and Nicobar Islands',
    // },
    societyCountry: {
      id: 101,
      name: 'India',
      iso3: 'IND',
      iso2: 'IN',
      numeric_code: '356',
      phone_code: 91,
      capital: 'New Delhi',
      currency: 'INR',
      currency_name: 'Indian rupee',
      currency_symbol: '₹',
      tld: '.in',
      native: 'भारत',
      region: 'Asia',
      subregion: 'Southern Asia',
      latitude: '20.00000000',
      longitude: '77.00000000',
      emoji: '🇮🇳',
      value: 'India',
    },
    // societyPincode: '403524',
    logo: [],
    isMembershipFees: false,
    phoneNumber: `${phoneNumber ? phoneNumber : ''}`,
    firstName: '',
    lastName: '',
    flatNumber: '',
    buildingDoorNumber: '',
    address: '',
    streetName: '',
    state: null,
    country: {
      id: 101,
      name: 'India',
      iso3: 'IND',
      iso2: 'IN',
      numeric_code: '356',
      phone_code: 91,
      capital: 'New Delhi',
      currency: 'INR',
      currency_name: 'Indian rupee',
      currency_symbol: '₹',
      tld: '.in',
      native: 'भारत',
      region: 'Asia',
      subregion: 'Southern Asia',
      latitude: '20.00000000',
      longitude: '77.00000000',
      emoji: '🇮🇳',
      value: 'India',
    },
    pincode: '',
    password: '',
    confirmPassword: '',
    isAdmin: true,
    isMember: true,
  };

  const [formData, setFormData] = useState(defaults);
  // const [formData, setFormData] = useState(null);
  // const [userDetails, setUserDetails] = useState();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (phoneNumber) {
        const result = await checkAndFetchUserDetails(phoneNumber);

        if (result.exists) {
          setIsExistingUser(true); // Mark user as existing
          setFormData((prevData) => ({
            ...prevData,
            ...result.user,
          }));
        }
      }
    };

    fetchUserDetails();
  }, [phoneNumber]);


  const handleNextStep = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setStep(step + 1);
  };
  const handlePrevStep = (data) => {
    // setFormData((prevData) => ({ ...prevData, ...data }));
    setStep(step - 1);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    console.log('dorm', formData);
    const combinedData = { ...formData, ...data };
    console.log('Final combined data:');
    console.log('Final combined data:', combinedData);
    const finalData: any = await societyRegistrationTransformer(combinedData);
    console.log('FINAL', finalData);
    const res = await registerSocietyAction(finalData);
    setLoading(false);
    if (res?.status === 200) {
      router.push('/get-started');
    }
  };

  return (
    
    <Box
      className=" flex flex-col items-center"
      sx={{
        '@media(max-width:768px)': {
          margin: '0 32px 0 32px',
           
          
        },
      }}
    >
      {step === 1 && (
        <SocietyDetailsForm onNext={handleNextStep} defaultValues={formData} />
      )}
      {step === 2 && (
        <UserDetailsForm
          onSubmit={handleSubmit}
          backHandler={handlePrevStep}
          defaultValues={formData}
          loading={loading}
          setUserDetails={setFormData}
          isExistingUser={isExistingUser} 
        />
      )}
    </Box>
    
  );
};

export default SocietyRegistrationForm;
