import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema } from '../lib/zod/auth';
import OTPInput from '../component/UI/OTPInput/OtpInput';
import { otpAction, phoneNumberAction } from '../actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ButtonInput from '../component/UI/Button/Button';
import { useTheme } from '../../theme/themeProvider';

const OTPForm = ({ phoneNumber, userId, societyId, setSteps, changeNumber, onSuccess }:any) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {theme} = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch('otp');

  const onSubmit = async (data:any) => {
    setLoading(true);
    console.log('Submitting OTP:', data);

    try {
      const response = await otpAction(data);
      if (response?.status === 200) {
        console.log('OTP Verified:', response.data);
        if (phoneNumber) {
          // await AsyncStorage.setItem('phoneNumber', phoneNumber);
        }
        if (userId) {
          await AsyncStorage.setItem('userId', userId);
        }
    

        if (societyId) {
          setSteps(3); // Move to next step in society registration
        } else if (changeNumber) {
          setSteps(2); // Go back to step 2
          if (onSuccess) onSuccess(); // Callback function
        } else {
          //@ts-ignore
          navigation.navigate('SocietyRegister', { phoneNumber }); // Navigate to Society Register screen
        }
      } else {
        console.error('OTP verification failed.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    } finally {
      setLoading(false);
    }
  };


  console.log("got data in OTP form",phoneNumber,societyId,userId);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Enter OTP</Text>

        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value || otpValue}
              onChange={(val) => {
                field.onChange(val);
                setValue('otp', val);
              }}
              numInputs={4}
              shouldAutoFocus={true}
            />
          )}
        />
        {/* {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>} */}

        {/* Resend OTP */}
        <Text style={[styles.resendText,{color:theme.colors.mainText}]}>
          Didn’t receive OTP?{' '}
          <Text
            style={styles.resendLink}
            onPress={async () => {
              const response = await phoneNumberAction({
                  phone_number: phoneNumber,
                  terms_and_conditions: false
              });
              if (response?.status === 200) {
                console.log('OTP Resent');
              }
            }}
          >
            Resend OTP
          </Text>
        </Text>

        {/* Verify Button */}
        <ButtonInput
          text="Verify"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={isSubmitting}
    
        />
          
    
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    height: '100%',
  },
  form: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  resendText: {
    marginTop: 20,
    fontSize: 14,
  },
  resendLink: {
    color: '#2743FD',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
  },
});

export default OTPForm;
