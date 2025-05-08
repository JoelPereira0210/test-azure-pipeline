import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userDetailsSchema } from '../lib/zod/auth';
import { Button } from 'react-native-paper';
import InputField from '../component/UI/InputField/InputField';
import ButtonInput from '../component/UI/Button/Button';
import CountrySelector from '../component/UI/CountrySelector/CountrySelector';
import StateSelector from '../component/UI/StateSelector/StateSelector';
import SelectDropDown from '../component/UI/DropDownInputField/SelectDropDown';
import { useTheme } from '../../theme/themeProvider';

const UserDetailsForm = ({ loading, onSubmit, defaultValues, setUserDetails, isExistingUser,backHandler }:any) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: defaultValues?.country || { iso2: 'IN', name: 'India' }, // Default country
      state: defaultValues?.state || { name: 'Goa', state_code: 'GA' }, // Default state
      ...defaultValues, // Ensure all default values are included
    },
    resolver: zodResolver(userDetailsSchema),
    mode: 'onBlur',
  });

  const formValues = watch()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const {theme} = useTheme();

  // useEffect(() => {
  //   reset(defaultValues);
  // }, [defaultValues, reset]);
  useEffect(() => {
    if (defaultValues) {
      if (defaultValues) {
        setValue('country', {
          ...defaultValues.country,
          phone_code: String(defaultValues.country?.phone_code || ''), 
        });
      }
      setValue('state', defaultValues.state || { name: 'Goa', state_code: 'GA' }); // ✅ Set state dynamically
    }
  }, [defaultValues, setValue]);
  

  useEffect(() => {
    if (isExistingUser) {
      setValue('password', 'Pass@1234');
      setValue('confirmPassword', 'Pass@1234');
    } else {
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  }, [isExistingUser, setValue]);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Others', value: 'others' },
  ];

  console.log("userDetails errros",errors);
  console.log("default values in userDetailsForm",defaultValues);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.stepText}>2/2</Text>
      <Text style={styles.heading}>Your Details</Text>
      <Text style={styles.subHeading}>Setup your Personal Details</Text>

      {/* First Name */}
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <InputField
            label="First Name"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.firstName ? String(errors.firstName.message) : undefined}

          />
        )}
      />

      {/* Last Name */}
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <InputField
            label="Last Name"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.lastName ? String(errors.lastName.message) : undefined}
          />
        )}
      />

       {/* Gender Dropdown */}
       <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <SelectDropDown
            label="Gender"
            placeholder="Select Gender"
            options={genderOptions}
            required
            mode="outlined"
            errorMessage={errors.gender ? String(errors.gender.message) : undefined}
            value={genderOptions.find((option) => option.value === field.value) || null}
            onChange={(selectedOption:any) => {
              setValue('gender', selectedOption.value);
              field.onChange(selectedOption.value);
            }}
          />
        )}
      />

      {/* Country */}
     <Controller
  name="country"
  control={control}
  render={({ field }) => (
    <CountrySelector
      label="Select Country"
      required={true}
      value={field.value}
      errorMessage={errors.country? String(errors.country?.message):undefined}
      onSelectCountry={(country) => {
        setValue("country", country);
        field.onChange(country);
      }}
    />
  )}
/>


      {/* State */}
      <Controller
  name="state"
  control={control}
  render={({ field }) => (
    <StateSelector
      label="Select State"
      required={true}
      value={field.value}
      errorMessage={
        errors.state ? String (errors.state.message):undefined
      }
      countryName={watch("country")?.name}
      onSelectState={(state) => {
        setValue("state", state);
        field.onChange(state);
          //  console.warn(state);
      }}
    />
  )}
/>

<Controller
        name="pincode"
        control={control}
        render={({ field }) => (
          <InputField
            label="Pincode"
            type="text"
            required={true}
            errorMessage={
                errors.pincode
                  ? String(errors.pincode.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Building Door Number */}
      <Controller
        name="buildingDoorNumber"
        control={control}
        render={({ field }) => (
          <InputField
            label="Building Door Number"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.buildingDoorNumber ? String(errors.buildingDoorNumber.message) : undefined}
          />
        )}
      />

      {/* Flat Number */}
      <Controller
        name="flatNumber"
        control={control}
        render={({ field }) => (
          <InputField
            label="Flat Number"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.flatNumber ? String(errors.flatNumber.message) : undefined}
          />
        )}
      />

      {/* Address */}
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <InputField
            label="Address"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.address ? String(errors.address.message) : undefined}
          />
        )}
      />

      {/* Street Name */}
      <Controller
        name="streetName"
        control={control}
        render={({ field }) => (
          <InputField
            label="Street Name"
            type="text"
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.streetName ? String(errors.streetName.message) : undefined}
          />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <InputField
            label="Password"
            disabled={isExistingUser}
            type={showPassword ? "text" : "password"}
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.password ? String(errors.password.message) : undefined}
            icon={showPassword ? 'eye-off' : 'eye'}
          />
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <InputField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            disabled={isExistingUser}
            required
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.confirmPassword ? String(errors.confirmPassword.message) : undefined}
            icon={showPassword ? 'eye-off' : 'eye'}
          />
        )}
      />

     {/* Submit Button */}
<ButtonInput
    type='button'
    text='Submit'
  onPress={handleSubmit(onSubmit)} 
  loading={loading} 

/>



{/* Back Button */}
<ButtonInput
 type='button'
 text='Back'
  onPress={() => {
    console.log('HHHH');
    setUserDetails(formValues);
    backHandler();
  }}
  buttonBackgroundColor={theme.colors.background}
  buttonFontColor={theme.colors.mainText}
/>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
    backButton: {
        marginTop: 10,
        borderColor: '#1F64FF', // Adjust to match your theme
        width: '100%', // Match button width to form width
      },
      
  container: {
    padding: 20,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: 'white',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: 'white',
  },
  subHeading: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
});

export default UserDetailsForm;
