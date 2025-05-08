
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberSchema } from '../lib/zod/auth';
import { PhoneNumberDataType as FormData } from '../lib/types/registerNumber.types';
import { phoneNumberAction } from '../actions/auth';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import ButtonInput from '../component/UI/Button/Button';
import { useTheme } from '../../theme/themeProvider';
import TermsCheckbox from '../component/UI/CheckBox/TermsCheckBox';


const SignUpForm = ({ setSteps, setPhoneNumber }: any) => {
    const { theme, mode } = useTheme();
  const [loading, setLoading] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);



  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(phoneNumberSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setPhoneNumber(data?.phone_number);
      const response: any = await phoneNumberAction(data);
      if (response?.status === 200) {
        setSteps(2);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

   
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
        {/* Title */}
        <Text style={[styles.heading,theme.typography.text13, { color: theme.colors.text }]}>Sign Up</Text>
        <Text style={[styles.subHeading,theme.typography.text5, { color: theme.colors.text }]}>Enter Your Phone Number</Text>

        {/* Mobile Number Input */}
        <Controller
          name="phone_number"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MobileInput
              name={field.name}
              control={control}
              required={true}
              label="Phone Number"
              placeholder="Mobile Number"
              error={errors.phone_number?.message}
              country="IN"
            />
          )}
        />

<Controller
  control={control}
  name="terms_and_conditions"
  defaultValue={false}
  render={({ field: { onChange, value } }) => (
    <TermsCheckbox
      required={true}
      label="By signing up to create an account I accept Company’s"
      spanText="Terms of use & Privacy Policy."
      onClick={() => setShowTermsModal(true)}
      error={errors?.terms_and_conditions?.message}
      checked={value}
      onChange={onChange} 
    />
  )}
/>


        {/* Submit Button */}
        <ButtonInput
          text="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
    
        />


        
      </View>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    // elevation: 3,
    shadowColor: '#000',
  },
  heading: {
    // fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeading: {
    // fontSize: 16,
    marginBottom: 20,
  },
  terms: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
  link: {
    fontWeight: 'bold',
  },
});

export default SignUpForm;
