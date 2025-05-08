import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import InputField from '@/src/component/UI/InputField/InputField';
import { userDetailsSchema } from '../lib/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import DropdownField from '../component/UI/DropDownInputField/DropDownInputField';
import {
  CountryDropdown,
  StateDropdown,
  CityDropdown,
} from 'react-country-state-dropdown';
import { useEffect } from 'react';
// import { updateUserProfile, updateUserProfileData } from '@/src/actions/user';
import ButtonInput from '../component/UI/Button/Button';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BorderColor, Height } from '@mui/icons-material';
import { fetchLoggedInUserdata, fetchLoggedInUserDetails, updateUser } from '../actions/auth';
import ProfileImageUpload from '../component/UI/ProfileImageUpload/ProfileImageUpload';
import { fileToBase64 } from '../utils/auth';
import SelectDropDown from '../component/UI/DropDownInputField/SelectDropDown';

const UserDetailsProfile = ({
  backHandler,
}) => {

  const {
    control,
    handleSubmit,
    watch, trigger, reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    mode: 'onBlur',
  });
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [userData, setUserData] = useState(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<any | null>(null);
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'others', label: 'Others' },
  ]
  console.log("selectedImage", selectedImage)
  useEffect(() => {
    const fetchData = async () => {
      let data = await fetchLoggedInUserDetails();
      // let data = await fetchLoggedInUserdata();
      console.log("fetchData", data)


      const user = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        phoneNumber: data?.phoneNumber,
        gender: data?.gender,
        flatNumber: data?.flatNumber,
        buildingDoorNumber: data?.buildingDoorNumber,
        address: data?.address,
        streetName: data?.streetName,
        country: data?.country,
        state: data?.state,
        pincode: data?.pincode,
        password: data?.password,
        confirmPassword: data?.password,
        profilePictureId: data?.profilePictureId,

      }
      setSelectedImage(data?.picture)
      console.log("user", user)
      setUserData(user);
      reset(user)
    };

    fetchData();
  }, []);

  const formValues = watch();
  const selectedCountry = watch('country');
  const selectedGender = watch('gender');
  console.log("Gender", selectedGender)
  console.log("errors", errors)

  const onSubmit = async (data) => {
    // event.preventDefault(); // Prevent default form submission
    if (selectedImageData) {
      formValues.profilePictureId = await fileToBase64(selectedImageData[0])
    }
    console.log('Updated form data:', formValues);
    // dataUpload();
    try {
      console.log('response form data:');

      const response = await updateUser(formValues); // Pass userId along with formValues
      console.log('User profile 200 successfully:', response);

      if (response?.status === 200) {
        console.log('User profile updated successfully:', response);
        window.location.href = "/profile"
        // You can also reset the form or perform other actions here
      } else {
        console.log('Failed to update user profile:', response);
      }
    } catch (error) {
      console.log('Error updating user profile:', error);
    }
  };

  const dataUpload = async () => {
    try {
      console.log('response form data:');

      const response = await updateUser(formValues); // Pass userId along with formValues
      console.log('User profile 200 successfully:', response);

      if (response?.status === 200) {
        console.log('User profile updated successfully:', response);

        // You can also reset the form or perform other actions here
      } else {
        console.log('Failed to update user profile:', response);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }

  }
  console.log("selected country", selectedCountry)
  return (
    <>
      <Box
        className="w-full flex flex-col items-center"
        sx={{
          marginBottom: '50px',
        }}
      >
        <Typography
          variant="text13"
          fontWeight={500}
          sx={{
            '@media(max-width:768px)': {
              marginBottom: '16px',
              color:
                mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)',
            },
          }}
        >
          Your Details
        </Typography>
        <Typography
          variant="text8"
          fontWeight={400}
          color={'##9C9AA5'}
          className=" !mb-[2rem]"
          sx={{
            '@media(max-width:768px)': {
              fontSize: '0.75rem',
            },
            color:
              mode === 'light' ? '#3A3A3A' : 'var(--tw-text-dark-mainText)',
          }}
        >
          Setup your Personal Details
        </Typography>
        {/* <Box
          sx={{
            position: 'absolute',
            width: '123px',
            height: '94px',
            marginTop: '75px',
          }}
        >
          <AccountCircleIcon sx={{ width: '100%', height: '100%' }} />
        </Box> */}
        <ProfileImageUpload selectedImage={selectedImage} setSelectedImage={setSelectedImage} setSelectedImageData={setSelectedImageData} />
      </Box>

      {/* <form onSubmit={handleUpdateClick} style={{ marginTop: '11%' }}> */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '11%' }}>
        <Grid container columnSpacing={{ lg: 4, xs: 1, sm: 2, md: 4 }}>
          <Grid width={'100%'} item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'First Name'}
                  {...field}
                  required={true}
                  placeholder="First Name"
                  // error={errors.firstName?.message}
                  errorMessage={errors.firstName ? String(errors.firstName.message) : undefined}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"

              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Last Name'}
                  {...field}
                  required={true}
                  placeholder="Last Name"
                  // error={errors.lastName?.message}
                  errorMessage={errors.lastName ? String(errors.lastName.message) : undefined}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MobileInput
              name="phoneNumber"
              control={control}
              readOnly={true}
              label={'Mobile Number'}
              placeholder="Mobile Number"
              country="IN"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="gender"
              control={control}
              rules={{ required: { value: true, message: 'Please select your gender.' } }}
              render={({ field }) => {
                const selectedOption = genderOptions.find(option => option.value === field.value);
                return (
                  <SelectDropDown
                    label="Gender"
                    required
                    placeholder='Select a Gender'
                    errorMessage={errors.gender ? String(errors.gender.message) : undefined}
                    value={selectedOption} // Controlled value from react-hook-form
                    onChange={(selectedOption) => field.onChange(selectedOption.value)} // Update field with selected value
                    options={genderOptions}
                  />
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="flatNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Flat Number'}
                  {...field}
                  required={true}
                  placeholder="Flat Number"
                  errorMessage={errors.flatNumber ? String(errors.flatNumber.message) : undefined}

                // error={errors.flatNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="buildingDoorNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Building Door Number'}
                  {...field}
                  required={true}
                  placeholder="Building Door Number"
                  // error={errors.buildingDoorNumber?.message}
                  errorMessage={errors.buildingDoorNumber ? String(errors.buildingDoorNumber.message) : undefined}

                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Address'}
                  {...field}
                  required={true}
                  placeholder="Address"
                  errorMessage={errors.address ? String(errors.address.message) : undefined}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="streetName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Street Name'}
                  {...field}
                  required={true}
                  placeholder="Street Name"
                  // error={errors.streetName?.message}
                  errorMessage={errors.streetName ? String(errors.streetName.message) : undefined}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box className={`flex flex-col`} sx={{ marginBottom: '27px' }}>
                  <label>
                    <Typography variant="text8" fontWeight={600}>
                      Country <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </label>
                  <CountryDropdown
                    value={field.value?.name || ''} // Ensure to display the correct value
                    onChange={(e, val) => {
                      field.onChange(val);
                      trigger('country');
                    }}
                    className={`custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                      }`}
                  />
                  {errors?.country && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: '8px' }}
                    >
                      {typeof errors.country.message === 'string' ? errors.country.message : ''}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} className={`custom-grid ${mode === 'light' ? 'light-dropBox' : 'dark-dropBox'
            }`}>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box className={`flex flex-col`} sx={{ marginBottom: '27px' }}>
                  <label>
                    <Typography variant="text8" fontWeight={600}>
                      State <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </label>
                  <StateDropdown
                    country={selectedCountry}
                    label={'State'}
                    {...field}
                    required={true}
                    placeholder="State"
                    value={field.value || ''} // Use the name property of the state object
                    error={errors.state?.message}
                    helperText={errors.state?.message}
                    onChange={(e, val) => {
                      console.log("val", val)
                      trigger('state');
                      field.onChange(val);
                    }}
                    classes={`custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                      }`}
                  />
                  {errors?.state && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: '8px' }}
                    >
                      {typeof errors.state.message === 'string' ? errors.state.message : ''}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="pincode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Pincode'}
                  {...field}
                  required={true}
                  placeholder="Pincode"
                  // error={errors.pincode?.message}
                  // helperText={errors.pincode?.message}
                  errorMessage={errors.pincode ? String(errors.pincode.message) : undefined}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box
          className="flex flex-col md:flex-row justify-center items-center"
          sx={{
            gap: '60px',
            marginTop: '100px',
            '@media(max-width:768px)': {
              gap: '10px',
              marginTop: '50px',
            },
          }}
        >
          <ButtonInput
            loading={false} text="Update" type="submit" disabled={false}
            styles={{ width: '210px' }}
          />
          <ButtonInput
            disabled={false}
            loading={false}
            type="button"
            text="Cancel"
            styles={{
              width: '210px',
              backgroundColor: '#FFFFFF',
              color: 'black',
              borderColor: 'black',
            }}
            onClick={backHandler}
          />
        </Box>
      </form>
    </>
  );
};

export default UserDetailsProfile;