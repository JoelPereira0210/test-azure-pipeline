"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ButtonInput from '../UI/Button/Button';
import { useTheme } from '@mui/material/styles';
import InputField from '../UI/InputField/InputField';
import { useState,useEffect } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {
  changePasswordAction,
  forgotPasswordAction,
  fetchPhoneNumberAction,
  validateOldPasswordAction,
  otpAction,
} from '@/src/actions/auth';
import { z } from 'zod';
import { otpSchema, passwordValidation } from '@/src/lib/zod/auth'; // Ensure this is your OTP validation schema
import toast from 'react-hot-toast';
import OTPForm from '@/src/forms/OTPForm';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const createPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 469,
  height: 493,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ChangePassword({ open, onClose, userId }) {
  const [step, setStep] = React.useState(1);
  const theme = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fetchedPhoneNumberState, setFetchedPhoneNumberState] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open) {
      // Reset all state variables to their initial values
      setStep(1);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setFetchedPhoneNumberState('');
      setIsForgotPassword(false);
    }
  }, [open]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
  const toggleOldPasswordVisibility = () => setShowOldPassword((prev) => !prev);
  const handleContinue = async () => {
    try {
      if (step === 1) {
        // Step 1: Validate old password by calling validateOldPasswordAction
        if (oldPassword === '') {
          throw new z.ZodError([
            { code: 'custom', message: 'Old password is required', path: ['oldPassword'] },
          ]);
          
        }

        // Call validateOldPasswordAction and check response
        const validationResponse = await validateOldPasswordAction(
          userId,
          oldPassword
        );

        // if (validationResponse.success) {
        //   setStep(2);
        // } else {
        //   console.log('password dont matched');
        // }
        if (validationResponse && validationResponse.success) {
          setStep(2);
        } else {
          console.log('Password does not match');
        }
        
      } else if (step === 2) {
        createPasswordSchema.parse({
          password: newPassword,
          confirmPassword: confirmPassword,
        });

        const response = isForgotPassword
          ? await forgotPasswordAction(userId, newPassword)
          : await changePasswordAction(userId, newPassword);

        // if (response.success) {
        //   // setStep(3); // Proceed to OTP step
        //   console.log("password updated")
        //   handleClose();
        // } else {
        //   // alert(response.message || 'Failed to change password.');
        // }
        if (response && typeof response === 'object' && response.success) {
          console.log("Password updated");
          handleClose();
        } else if (response && typeof response === 'object') {
          toast.error(response.message || 'Failed to change password.');
        } else {
          toast.error('Failed to change password.');
        }
        
      } else if (step === 3) {
        // Step 3: Validate OTP
        otpSchema.parse({ otp });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        alert('An unexpected error occurred. Please try again.');
        console.error(error);
      }
    }
  };
  const fetchPhoneNumber = async (userId) => {
    try {
      const phoneNumber = await fetchPhoneNumberAction(userId,'Changing Password'); // Call the action to fetch the phone number
      console.log('Response from fetchPhoneNumberAction:', phoneNumber); // Log the received phone number

      if (phoneNumber) {
        setFetchedPhoneNumberState(phoneNumber); // Store the phone number in state
        console.log('Stored phone number:', phoneNumber); // Log the stored phone number
        // alert('Phone number retrieved successfully!'); // Success alert
      } else {
        // alert('Failed to retrieve phone number. Please try again.'); // Alert on failure
      }
    } catch (error) {
      console.error('Error occurred during phone number retrieval:', error); // Log any unexpected errors
      // alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleDecrementStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

 

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Change Password';
      case 2:
        return 'Set New Password';
      case 3:
        return 'Verify OTP';
      default:
        return 'Change Password';
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="change-password-title"
      aria-describedby="change-password-description"
    >
      <Box sx={style}>
        <Box sx={{ padding: 'inherit', marginTop: '10%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '24px',
              fontWeight: '600',
              marginLeft: '3rem',
            }}
          >
            <h2 id="change-password-title" style={{ margin: '0' }}>
              {getTitle()}
            </h2>
            {step > 1 && (
              <IconButton onClick={handleDecrementStep}>
                <KeyboardArrowLeftIcon
                  sx={{ marginTop: '-8rem', marginLeft: '-41rem' }}
                />
              </IconButton>
            )}
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ marginTop: '-8rem', marginRight: '-4rem' }} />
            </IconButton>
          </div>

          {step === 1 && (
            <div>
              <Box sx={{ marginTop: '3rem' }}>
                <InputField
                  label="Enter old password"
                  required={true}
                  type={showOldPassword ? 'text' : 'password'}
                  onPaste={(e) => e.preventDefault()}
                  icon={
                    showOldPassword ? (
                      <VisibilityOff
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={toggleOldPasswordVisibility}
                        sx={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <Visibility
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={toggleOldPasswordVisibility}
                        sx={{ cursor: 'pointer' }}
                      />
                    )
                  }
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                {/* Forgot Password Link */}
                <Box display="flex" justifyContent="flex-end" sx={{ marginTop: '-1rem' }}>
                  <Button
                    onClick={async () => {
                      setIsForgotPassword(true);
                      setStep(3); // Move to step 3 (Verify OTP)
                      await fetchPhoneNumber(userId); // Call the fetchPhoneNumber function
                    }}
                    sx={{ textDecoration: 'underline', color: 'primary.main' }}
                  >
                    Forgot Password?
                  </Button>
                </Box>
              </Box>
              <ButtonInput
                disabled={false}
                text="Continue"
                onClick={handleContinue}
                type="button"
                styles={{
                  width: '78%',
                  marginLeft: '10%',
                  marginTop: '26%',
                  backgroundColor: `${
                    theme.palette.mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)'
                  }`,
                  color: `${
                    theme.palette.mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)'
                  }`,
                }}
              />
            </div>
          )}

          {/* Step 2: Enter New Password */}
          {step === 2 && (
            <div>
              <Box sx={{ marginTop: '2rem' }}>
                <InputField
                  label="Enter New password"
                  required={true}
                  type={showPassword ? 'text' : 'password'}
                  onPaste={(e) => e.preventDefault()}
                  icon={
                    showPassword ? (
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
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Box>
              <Box sx={{ marginTop: '2rem' }}>
                <InputField
                  label="Confirm password"
                  required={true}
                  type={showConfirmPassword ? 'text' : 'password'}
                  onPaste={(e) => e.preventDefault()}
                  icon={
                    showConfirmPassword ? (
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
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Box>
              <ButtonInput
                disabled={false}
                text={step === 2 ? "Update" : "Continue"}
                type="button"
                onClick={handleContinue}
                
                styles={{
                  width: '78%',
                  marginLeft: '10%',
                  marginTop: '12%',
                  backgroundColor: `${
                    theme.palette.mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)'
                  }`,
                  color: `${
                    theme.palette.mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)'
                  }`,
                }}
              />
            </div>
          )}

         
{step === 3 && (
            <OTPForm
              phoneNumber={fetchedPhoneNumberState}
              changeNumber={true}
              setStep={setStep} // Move to next step after successful OTP
              onSuccess={() => {
                setStep(2); // Navigate to the set new password step
              }}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
}