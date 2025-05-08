'use client ';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, phoneNumberSchema } from '../lib/zod/auth';
import { OTPDataType as FormData } from '@/src/lib/types/registerNumber.types';
import { otpAction, phoneNumberAction } from '@/src/actions/auth';

import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import OtpInput from 'react-otp-input';
import OTPInput from '@/src/component/UI/OTPInput/OTPInput';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ButtonInput from '../component/UI/Button/Button';
import { setSocietyIdInLocalStorage } from '../utils/auth';

const OTPForm = (props) => {
  console.log("Props passed to C:", props);
  console.log('props.userId:', props?.useId);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const mode = theme.palette.mode;
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch('otp');


  const onSubmit = async (data: FormData) => {
    setLoading(true);
    console.log('Submitting form with data:', data);

    try {
      const response: any = await otpAction(data);
      console.log('response:', response);

      if (response?.status === 200) {
        console.log('OTP Verified, response:', response);
        sessionStorage.setItem('phoneNumber', JSON.stringify(props?.phoneNumber));
        sessionStorage.setItem('userId', JSON.stringify(props?.useId));
        sessionStorage.setItem('societyId', JSON.stringify(props?.societyId));

        setSocietyIdInLocalStorage(props?.societyId);

        if (props?.societyId) {
          props?.setSteps(3); // Navigate to the next step in society registration
        } else if (props?.changeNumber) {
          // Handle phone number change
          props?.setStep(2); // Move back to Step 2 in modal
          if (props?.onSuccess) {
            props.onSuccess(); // Call the success callback to update phone number
          }
        } else {
          router.push('/society-register');
        }
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast.error('An error occurred while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          marginBottom: `${!isMobile ? '110px' : '40px'}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              value={field.value || otpValue} // Controlled by react-hook-form
              onChange={(val) => {
                field.onChange(val);
                console.log('VAL', val);
                setValue('otp', val); // Update the form state
              }}
              inputStyle={{
                color: `${mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)'
                  }`,
              }}
              numInputs={4}
              shouldAutoFocus={true}
              inputType="number"
              containerStyle="!text-center"
              renderSeparator={
                <span
                  style={{
                    width: '20px',
                  }}
                >
                  {' '}
                </span>
              }
              renderInput={(props) => <OTPInput {...props} />}
            />
          )}
        />
        {errors.otp && (
          <Box className="!pt-[1rem]">
            <Typography variant='text6' color={'var(--tw-text-light-redText)'} >
              {errors.otp.message}
            </Typography>
          </Box>
        )}
      </Box>
      <Box className="!text-center md:!mb-[2rem] !mb-[1rem]" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="text7" color={'#9C9AA5'}>
          Didn’t you receive the OTP?{' '}
          <span
            style={{
              color: '#2743FD',
            }}
          >
            <span
              style={{ cursor: 'pointer' }}
              onClick={async () => {
                const response: any = await phoneNumberAction({
                  phone_number: props?.phoneNumber,

                });
                if (response?.status === 200) {
                  console.log('Res', response?.data);
                  // router.replace(AppRoutes.dashboard);
                }
              }}
            >
              <strong>Resend OTP</strong>
            </span>
          </span>
        </Typography>
      </Box>
      <ButtonInput
        text="Verify"
        disabled={isSubmitting} // Disable if submitting or no OTP
        type="submit"
        loading={loading}
      />
    </form>
  );
};

export default OTPForm;
