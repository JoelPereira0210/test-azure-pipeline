import React, { useState } from 'react';
import InputField from '@/src/component/UI/InputField/InputField';
import { useForm, Controller, Form } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberSchema } from '../lib/zod/auth';
import { PhoneNumberDataType as FormData } from '@/src/lib/types/registerNumber.types';
import { phoneNumberAction } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/src/lib/constants/appRoutes';
import Button from '../component/UI/Button/Button';
import { Box, FormGroup, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ButtonInput from '../component/UI/Button/Button';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import TermsCheckbox from '../component/UI/Checkbox/TermsCheckbox';

const SignUpForm = (props: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:768px)');
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(phoneNumberSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      console.log('data', data);
      props.setPhoneNumber(data?.phone_number);
      const response: any = await phoneNumberAction(data);
      if (response?.status === 200) {
        console.log('Res', response?.data);
        props.setSteps(2);
        // router.replace(AppRoutes.dashboard);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('eee', errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(!isLargeScreen && {
          padding: '0 20px',
        }),
      }}
    >
      <Box
        sx={{
          marginBottom: '110px',
        }}
      >
        {/* <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <InputField
              label="Mobile Number"
              type="text"
              // error={errors.phone_number?.message}
              error={errors.phone_number?.message}
              helperText={errors.phone_number?.message}
              {...field}
            />
          )}
        /> */}
        {/* <MobileInput
          name="phone_number"
          control={control}
          label={'Mobile Number'}
          placeholder="Mobile Number"
          rules={{ required: 'Mobile Number is required' }}
          country={'IN'}
        /> */}
        <Controller
          name="phone_number"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MobileInput
              name={field.name}
              control={control}
              required={true}
              label="Mobile Number"
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
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TermsCheckbox
              required={true}
              label="By signing up to create an account I accept Company’s"
              spanText="Terms of use & Privacy Policy."
              onClick={() => setShowTermsModal(true)}
              error={errors?.terms_and_conditions?.message}
              checked={value} // Pass the value as checked
              onChange={onChange} // Use the onChange from the field
              onBlur={onBlur}
              ref={ref}
            // {...field}
            />
          )}
        />
      </Box>
      <ButtonInput
        loading={loading}
        text="Create Account"
        // disabled={isSubmitting}
        disabled={false}
        type="submit"
      />
    </form>
  );
};

export default SignUpForm;
