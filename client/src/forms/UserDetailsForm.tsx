import React, { useState,useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import InputField from '@/src/component/UI/InputField/InputField';
import { userDetailsSchema } from '../lib/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  CountryDropdown,
  StateDropdown,
  CityDropdown,
  PhoneInput,
} from 'react-country-state-dropdown';
import ButtonInput from '../component/UI/Button/Button';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import DropdownField from '../component/UI/DropDownInputField/DropDownInputField';
import SelectDropDown from '../component/UI/DropDownInputField/SelectDropDown';


const UserDetailsForm = ({
  loading,
  onSubmit,
  backHandler,
  defaultValues,
  setUserDetails,
  isExistingUser,
}) => {
  const {
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(userDetailsSchema),
    mode: 'onBlur',
  });
  const formValues = watch();
  console.log('formValues', formValues);
  console.log('err', errors);
  const selectedCountry = watch('country');
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const mode = theme.palette.mode;
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'others', label: 'Others' },
  ]
  // useEffect(() => {
  //   console.log("FFF", formValues)
  //   setUserDetails(formValues);
  // }, [formValues, setUserDetails]);

   // Reset form values when defaultValues change
   useEffect(() => {
    reset(defaultValues); // Dynamically set form values when defaultValues are updated
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isExistingUser) {
      setValue('password', 'Pass@1234');
      setValue('confirmPassword', 'Pass@1234');
    } else {
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  }, [isExistingUser, setValue]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


  return (
    <>
      <Box
        className="w-full flex flex-col items-center ssss"
        sx={{
          marginBottom: '50px',
          
        }}
      >
        <Typography
          variant="text12"
          className=" !mb-[1.5rem]"
          fontWeight={500}
          sx={{
            color:
            mode === 'light'   ? 'var(--tw-text-dark-mainText)'
            : 'var(--tw-text-light-mainText)',
        }}
        >
          2/2
        </Typography>
        <Typography
          variant="text13"
          className="  "
          fontWeight={600}
          sx={{
            '@media(max-width:768px)': {
              marginBottom: '16px',
             
            },
            color:
            mode === 'light'   ? 'var(--tw-text-dark-mainText)'
            : 'var(--tw-text-light-mainText)',
          }}
        >
          Your Details
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
              mode === 'light'   ? 'var(--tw-text-dark-mainText)'
              : 'var(--tw-text-light-mainText)',
          }}
        >
          Setup your Personal Details
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  readOnly={isExistingUser}
                  // error={errors.firstName?.message}
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  errorMessage={errors.firstName ? String(errors.firstName.message) : undefined}
                // helperText={errors.firstName?.message}
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
                  readOnly={isExistingUser}
                  // error={errors.lastName?.message}
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  errorMessage={errors.lastName ? String(errors.lastName.message) : undefined}
                // helperText={errors.lastName?.message}
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
              // rules={{ required: 'Mobile Number is required' }}
              country={selectedCountry.iso2}
              style={{
                            
                backgroundColor: `${
                  mode === 'light'
                    ? 'var(--tw-bg-light-background)'
                    : 'var(--tw-bg-dark-background)'
                }`,
              }}
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
                    placeholder='Select a Gender'
                    required
                    errorMessage={errors.gender ? String(errors.gender.message) : undefined}
                    value={selectedOption} // Controlled value from react-hook-form
                    readOnly={isExistingUser}
                    onChange={(selectedOption) => field.onChange(selectedOption.value)} // Update field with selected value
                    options={genderOptions} />
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
                  label={'Flat Number'}
                  type='text'
                  {...field}
                  required={true}
                  placeholder="Flat Number"
                  readOnly={isExistingUser}
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  // error={errors.flatNumber?.message}
                  errorMessage={errors.flatNumber ? String(errors.flatNumber.message) : undefined}

                // helperText={errors.flatNumber?.message}
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
                  label={'Building Door Number'}
                  type='text'
                  {...field}
                  required={true}
                  placeholder="Building Door Number"
                  readOnly={isExistingUser}
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  // error={errors.buildingDoorNumber?.message}
                  errorMessage={errors.buildingDoorNumber ? String(errors.buildingDoorNumber.message) : undefined}

                // helperText={errors.buildingDoorNumber?.message}
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
                  readOnly={isExistingUser}
                  placeholder="Address"
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  // error={errors.address?.message}
                  errorMessage={errors.address ? String(errors.address.message) : undefined}
                // helperText={errors.address?.message}
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
                  readOnly={isExistingUser}
                  placeholder="Street Name"
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  // error={errors.streetName?.message}
                  errorMessage={errors.streetName ? String(errors.streetName.message) : undefined}
                // helperText={errors.streetName?.message}
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
                    value={field.value?.name}
                    readOnly={isExistingUser}
                    onChange={(e, val) => {
                      field.onChange(val);
                      trigger('country');
                    }}
                    // inputRef={ref}
                    // className="custom-dropdown"
                    className={` custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                      }`}
                  />
                  {errors?.country && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: '8px' }}
                    >
                      {/* {errors?.country?.message} */}
                      {typeof errors.country.message === 'string' ? errors.country.message : ''}

                    </Typography>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box
                  className={`flex flex-col ${mode === 'light' ? 'light-dropBox' : 'dark-dropBox'
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
                    country={selectedCountry}
                    placeHolder={'Choose a State'}
                    value={field.value}
                    readOnly={isExistingUser}
                    onChange={(e, val) => {
                      field.onChange(val);
                      trigger('state');
                    }}
                    // className="custom-dropdown "
                    className={` custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                      }`}
                  />
                  {errors?.state && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: '8px' }}
                    >
                      {/* {errors?.state?.message} */}
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
                  label={'Pincode'}
                  {...field}
                  type='text'
                  required={true}
                  readOnly={isExistingUser}
                  placeholder="Pincode"
                  // infoText={['6 digit number', '10 digit']}
                  // error={errors.pincode?.message}
                  style={{
                            
                    backgroundColor: `${
                      mode === 'light'
                        ? 'var(--tw-bg-light-background)'
                        : 'var(--tw-bg-dark-background)'
                    }`,
                  }}
                  errorMessage={errors.pincode ? String(errors.pincode.message) : undefined}

                // helperText={errors.pincode?.message}
                />
              )}
            />
          </Grid>   
            <Grid item xs={12} sm={6}>
              
              </Grid>   
          <Grid item xs={12} sm={6}>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputField
                label={'password'}
                {...field}
                type={isExistingUser ? 'password' :  showPassword  ? 'text' : 'password'}
                required={true}
                readOnly={isExistingUser}
                placeholder="password"
                onPaste={(e) => e.preventDefault()}
                icon={
                  !isExistingUser && // Render icon only if the user is not an existing user
                  (
                  showPassword  ?  (
                    <VisibilityOff
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={togglePasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Visibility
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={togglePasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                )
                }
                infoText={['Cannot contain your name or email address', 'At least 8 characters', 'Contains a number and symbol']}
                style={{
                          
                  backgroundColor: `${
                    mode === 'light'
                      ? 'var(--tw-bg-light-background)'
                      : 'var(--tw-bg-dark-background)'
                  }`,
                }}
                // error={errors.password?.message}
                errorMessage={errors.password ? String(errors.password.message) : undefined}

              // helperText={errors.password?.message}
              />
            )}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputField
                label={'Confirm Password'}
                {...field}
                required={true}
          
                readOnly={isExistingUser}
                type={isExistingUser ? 'password' : showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                onPaste={(e) => e.preventDefault()}
                
                icon={
                  !isExistingUser && // Render icon only if the user is not an existing user
                  (
                  showConfirmPassword  ? (
                    <VisibilityOff
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={toggleConfirmPasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Visibility
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={toggleConfirmPasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                )
                }
                infoText={['Password should match']}
                style={{
                          
                  backgroundColor: `${
                    mode === 'light'
                      ? 'var(--tw-bg-light-background)'
                      : 'var(--tw-bg-dark-background)'
                  }`,
                }}
                // error={errors.confirmPassword?.message}
                errorMessage={errors.confirmPassword ? String(errors.confirmPassword.message) : undefined}

              // helperText={errors.confirmPassword?.message}
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
              marginTop: '50px'
            }
          }}
        >
          <ButtonInput
            disabled={false}
            text="Submit"
            loading={loading}
            type="submit"
            styles={{ width: '210px' }}
          />
          <ButtonInput
            disabled={false}
            loading={false}
            type="button"
            text="Back"
            styles={{ width: '210px' }}
            onClick={() => {
              console.log('HHHH');
              setUserDetails(formValues);
              backHandler();
            }}
          />
        </Box>
      </form>
    </>
  );
};

export default UserDetailsForm;
