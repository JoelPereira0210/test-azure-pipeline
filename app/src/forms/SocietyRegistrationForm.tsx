import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import SocietyDetailsForm from './SocietyDetailsForm';
import UserDetailsForm from './UserDetailsForm';
import {societyRegistrationTransformerApp } from '../utils/formTransformer';
import { registerSocietyAction, checkAndFetchUserDetails } from '../actions/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';

const SocietyRegistrationForm = ({phoneNumber}:any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ phoneNumber });
  const navigation = useNavigation();

  // Fetch phone number from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      // const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

      if (phoneNumber) {
        // setPhoneNumber(storedPhoneNumber); // Store it in state
        const result = await checkAndFetchUserDetails(phoneNumber);
        console.log("exsting user results",result);
        if (result.exists) {
          setIsExistingUser(true);
          setFormData((prevData:any) => ({
            ...prevData,
            ...result.user,
            phoneNumber,
          }));
        }
      }
      else {
        setFormData((prevData:any) => ({
          ...prevData,
          phoneNumber, // ✅ Ensure phoneNumber is included for new users
        }));
      }
    };

    fetchUserData();
  }, []);


  // Proceed to next step
  const handleNextStep = (data: any) => {
    setFormData((prevData:any) => ({ ...prevData, ...data }));
    setStep(step + 1);
  };

  // Go back to the previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setLoading(true);
    const combinedData = { ...formData, ...data };
    const finalData: any = await societyRegistrationTransformerApp(combinedData);

    const res = await registerSocietyAction(finalData);
    setLoading(false);

    if (res?.status === 200) {
      //@ts-ignore
      navigation.navigate('Welcome'); // Redirect to Get Started page
    }
  };

  return (
    
     

       
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

     
      <Text style={styles.title}>Society Registration</Text>
      {step === 1 && (
      <SocietyDetailsForm 
        onNext={(data:any) => handleNextStep(data)}  // ✅ Ensures function reference is passed
        defaultValues={formData} 
      />
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

      {/* {step > 1 && (
        <Button mode="contained" onPress={handlePrevStep} style={styles.backButton}>
          Back
        </Button>
      )} */}
    </ScrollView>
     
  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
  },
});

export default SocietyRegistrationForm;
