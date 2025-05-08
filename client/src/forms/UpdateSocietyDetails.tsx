
"use client";
import React, { useEffect, useState } from 'react';
import { decryptValue } from '../utils/encryptiondecryption';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import InputField from '@/src/component/UI/InputField/InputField';
import {
  societyDetailsSchema,
  societyRegistrationSchema,
  updateSocietyDetailsSchema,
} from '../lib/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import PopupModal from '../component/UI/Popup/PopupModal';
import {
  TextField, 
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TextArea from '../component/UI/TextArea/TextArea';
import {
  CountryDropdown,
  StateDropdown,
  CityDropdown,
  PhoneInput,
} from 'react-country-state-dropdown';
import ButtonInput from '../component/UI/Button/Button';
import { updateSocietyDetailsAction } from '../actions/profile';
import { getSocietyAction } from '../actions/society';
import { useRouter } from 'next/navigation';

const UpdateSocietyDetails = () => {
  const methods = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const theme = useTheme();
  const mode = theme.palette.mode;

  
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();
  const {
    handleSubmit,
    trigger,
    watch, clearErrors,
    control, 
// setValue,
    formState: { errors },
  } = useForm({
//      defaultValues,
     resolver: zodResolver(updateSocietyDetailsSchema),

//     // mode: 'onBlur',
  });
  const [formData, setFormData] = useState({
    
    societyName: '',
    description: '',
    address: '',
    state: '',
    country: '',
    pincode: '',
    buildingDoorNumber: '',
    buildingName: '',
    streetName: '',
    chargeMembershipFees: false,
    membershipFeeAmount: '',
  });

  const [societyData, setSocietyData] = useState(null);
useEffect(() => {
    const encryptedId = localStorage.getItem('societyId');
    const societyID = decryptValue(encryptedId);
    const getSociety = async () => {
      try {
        // Fetch society details using decryptedValues.societyId
        const values = await getSocietyAction(societyID);
        setSocietyData(values.data.society);
        if (values.data.society) {
          setFormData({
           
            societyName: values.data.society.societyName || '',
            description: values.data.society.description || '',
            address: values.data.society.address || '',
            state: values.data.society.state || '',
            country: values.data.society.country|| '',
            pincode: values.data.society.pincode || '',
            buildingDoorNumber: values.data.society.buildingDoorNumber || '',
            buildingName: values.data.society.buildingName || '',
            streetName: values.data.society.streetName || '',
            chargeMembershipFees: values.data.society.chargeMembershipFees || false,
            membershipFeeAmount: values.data.society.membershipFeeAmount || '',
          });
        }
       
        console.log('VALUES EFFECT', values);
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };

    if (societyID) {
      getSociety(); // Fetch society data
    }
  }, []);
  console.log('societyData in update soiety', societyData);
  console.log("ff",formData.state,formData.country)
  const onSubmit = (data) => {
    alert('hey')
    setLoading(true);
    console.log('datasss', data);
    console.log("datasss",formData)
    // onNext(data);
    setLoading(false);
  };

  const selectedCountry = watch('societyCountry');
  console.log("ssscountry",selectedCountry)
  const handleUpdate = async () => {
    console.log('Data in update:', formData);
    
    try {
      const response = await updateSocietyDetailsAction(formData);
      if (response.success) {
        // Show a success message
       
        // window.location.reload();
        router.push('/profile');
        
      } else {
        // toast.error('Failed to update society details');
      }
    } catch (error) {
      console.error('Error updating society details:', error);
      // toast.error('An error occurred while updating society details');
    }
  };
  return (
    <>
      <Box
        className="w-full flex flex-col items-center"
        sx={{
          marginBottom: '50px',
        }}
      >
        <Typography
          variant="text12"
          className=" !mb-[1.5rem]"

          sx={{
            color:
              mode === 'light'
                ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',

          }}
          fontWeight={500}

        >
          
        </Typography>
        <Typography
          variant="text13"
          fontWeight={600}
          sx={{
            '@media(max-width:768px)': {
              marginBottom: '16px',
            },
            color:
              mode === 'light'
                ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',
          }}
        >
          Society Details
        </Typography>
        <Typography
          variant="text8"
          fontWeight={500}
          color={'#3A3A3A'}
          className=" !mb-[2rem]"
          sx={{
            '@media(max-width:768px)': {
              fontSize: '0.75rem',
            },
            color:
              mode === 'light' ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',
          }}
        >
          Setup your Society for members that may join later.
        </Typography>
      </Box>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columnSpacing={{ lg: 4, xs: 1, sm: 2, md: 4 }}>
            <Grid width={'100%'} item xs={12} sm={6}>
              
              <Controller
                name={'societyName'}
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Society Name"
                    type="text"
                    readOnly
                    required={true}
                    // errorMessage={errors.societyName?.message}
                    // errorMessage={
                    //   errors.societyName
                    //     ? String(errors.societyName.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                        color: 'gray', // Set text color to gray
                    }}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyName');
                    // }}
                    value={formData.societyName}
 onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                    classes=""

                  />
                )}
              />

              <Controller
                name="buildingName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Building Name"
                    type="text"
                    readOnly
                    // required={true}
                    // errorMessage={errors.buildingName?.message}
                    // errorMessage={
                    //   errors.buildingName
                    //     ? String(errors.buildingName.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                        color: 'gray', // Set text color to gray
                    }}
                    {...field}
                    value={formData.buildingName}
 onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('buildingName');
                    // }}
                    
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyDescription"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    label="Society Description"
                    type="text"
                    // required={true}
                    // error={errors.societyDescription?.message}
                    // error={
                    //   errors.societyDescription
                    //     ? String(errors.societyDescription.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyDescription');
                    // }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyBuildingDoorNumber"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Building Door Number"
                    type="text"
                    readOnly
                    required={true}
                    // errorMessage={errors.societyBuildingDoorNumber?.message}
                    // errorMessage={
                    //   errors.societyBuildingDoorNumber
                    //     ? String(errors.societyBuildingDoorNumber.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                        color: 'gray', // Set text color to gray
                    }}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyBuildingDoorNumber');
                    // }}
                    value={formData.buildingDoorNumber}
                    onChange={(e) => setFormData({ ...formData, buildingDoorNumber: e.target.value })}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyAddress"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Address"
                    type="text"
                    // required={true}
                    // errorMessage={errors.societyAddress?.message}
                    // errorMessage={
                    //   errors.societyAddress
                    //     ? String(errors.societyAddress.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyAddress');
                    // }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyStreetName"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Street Name"
                    type="text"
                    readOnly
                    required={true}
                    // errorMessage={errors.societyStreetName?.message}
                    // errorMessage={
                    //   errors.societyStreetName
                    //     ? String(errors.societyStreetName.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                        color: 'gray', // Set text color to gray
                    }}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyStreetName');
                    // }}
                    value={formData.streetName}
                    onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyCountry"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <Box
                    className={`flex flex-col`}
                    sx={{
                      marginBottom: '27px',
                    }}
                  >
                    <label>
                      <Typography variant="text8" fontWeight={600}>
                        Country <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </label>
                    <CountryDropdown
                      // searchable
                      // value={field.value?.name}
                      // onChange={(e, val) => {
                      //   field.onChange(val);
                      //   trigger('societyCountry');
                      // }}
                      disabled
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}

                      // inputRef={ref}
                      // className="custom-dropdown "
                      className={` custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                        }`}

                    />
                    {/* {errors?.societyCountry && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ marginTop: '8px' }}
                      >
                        
                        {typeof errors.societyCountry.message === 'string'
                          ? errors.societyCountry.message
                          : ''}
                      </Typography>
                    )} */}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyState"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <Box
                    className={`flex flex-col customBox ${mode === 'light' ? 'light-dropBox' : 'dark-dropBox'
                      }`}
                    sx={{
                      marginBottom: '27px',
                    }}
                  >
                    <label>
                      <Typography variant="text8" fontWeight={600}>
                        State <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </label>
                    <StateDropdown
                      // searchable
                      country={formData.country}
                      placeHolder={'Choose a State'}
                      // value={field.value}
                      // onChange={(e, val) => {
                      //   field.onChange(val);
                      //   console.log('val', val);
                      //   trigger('societyState');
                      // }}
                      disabled
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className={`custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                        }`}

                    />
                    {/* {errors?.societyState && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ marginTop: '8px' }}
                      >
                        
                        {typeof errors.societyState.message === 'string'
                          ? errors.societyState.message
                          : ''}
                      </Typography>
                    )} */}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyPincode"
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Pincode"
                    type="text"
                    readOnly
                    // required={true}
                    // errorMessage={errors.societyPincode?.message}
                    // errorMessage={
                    //   errors.societyPincode
                    //     ? String(errors.societyPincode.message)
                    //     : undefined
                    // }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                        color: 'gray', // Set text color to gray
                    }}
                    // infoText={['6 digit number', '10 digit']}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   trigger('societyPincode');
                    // }}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    classes=""
                  />
                )}
              />
            </Grid>
            
            
            
           
          </Grid>
          <Box className="flex justify-center" marginTop={8}>
            <ButtonInput
              disabled={false}
              text="Update"
              type="submit"
              loading={loading}
              styles={{ width: '210px' }}
              // marginBottom={3}
              onClick={handleUpdate}
              
            />
          </Box>
        </form>
      </FormProvider>
    </>
  );
};


export default UpdateSocietyDetails;  // Default export