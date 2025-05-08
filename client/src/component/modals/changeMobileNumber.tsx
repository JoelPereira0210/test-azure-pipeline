import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../UI/InputField/InputField';
import ButtonInput from '../UI/Button/Button';
import { otpSchema, changePhoneNumberSchema } from '@/src/lib/zod/auth';
import toast from 'react-hot-toast';
import {
  changePhoneNumberAction,
  otpAction,
  fetchPhoneNumberAction,
  phoneNumberAction,
} from '@/src/actions/auth';
import MobileInput from '../UI/MobileInput/MobileInput';
import OTPForm from '@/src/forms/OTPForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 469,

  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  pt: 2,
  px: 4,
  pb: 3,
};
interface ChangeMobileNumberModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ChangeMobileNumberModal: React.FC<ChangeMobileNumberModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const theme = useTheme();
  const [step, setStep] = useState(1);

  const [fetchedPhoneNumber, setFetchedPhoneNumber] = useState('');

  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const phoneMethods = useForm({
    resolver: zodResolver(changePhoneNumberSchema), // Validates using Zod
    defaultValues: {
      phone_number: '', // Initial empty value
    },
  });
  const handleOTPVerificationSuccess = async () => {
    try {
      const response = await changePhoneNumberAction(userId,newPhoneNumber);
      if (response.success) {
        // toast.success('Phone number updated successfully!');
        handleClose();  // Close modal after successful update
        window.location.reload();
      } else {
        // toast.error('Failed to update phone number.');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast.error('An error occurred while updating the phone number.');
    }
  };
  

  useEffect(() => {
    if (open && userId) {
      const fetchPhoneNumber = async () => {
        try {
          
          const phoneNumber = await fetchPhoneNumberAction(userId,'Changing Phone Number');
          if (phoneNumber) {
            setFetchedPhoneNumber(phoneNumber);
           
          } else {
            // toast.error('Failed to retrieve phone number.');
          }
        } catch (error) {
          console.error('Error fetching phone number:', error);
        }
      };
      fetchPhoneNumber();
    }
  }, [open, userId]);
console.log("number",fetchedPhoneNumber)
  const handleClose = () => {
    onClose();
    setStep(1); // Reset the step on close
  };

  const onSubmit = async (data: { phone_number: string }) => {
    console.log('Submitting data:', data); // Verify this output
    setNewPhoneNumber(data.phone_number);

    setStep(3);

    try {
      const response = await phoneNumberAction({
        phone_number: data.phone_number,
        terms_and_conditions: true,
        actionType: "confirmPhoneNumber"
      });
      console.log('API Response:', response); // Log the response for debugging
      if (response.success) {
        handleClose();
      } else {
        // toast.error('Failed to update mobile number');
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error('An error occurred while updating the mobile number.');
    }
  };
  console.log('errors', phoneMethods.formState.errors);

  const handleStepChange = (nextStep: number) => {
    setStep(nextStep);
    if (nextStep === 2) {
      // Reset the phone_number field when transitioning to Step 2
      phoneMethods.reset({ phone_number: '' });
    }
  };

  return (
    <Modal
    open={open}
    onClose={handleClose}  // This will still close the modal when clicking on the close icon
    BackdropProps={{
      onClick: (e) => e.stopPropagation(), // Prevents closing the modal when clicking outside
    }}
  >
      <Box sx={{ ...style }}>
        <Box>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {step > 1 && (
              <IconButton onClick={() => handleStepChange(1)}>
                <KeyboardArrowLeftIcon />
              </IconButton>
            )}
            <h2
              id="change-mobile-number-title"
              style={{
                margin: '0',
                fontSize: '21px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {step === 1 ? 'OTP Verification' : 'Change Mobile Number'}
            </h2>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* OTP Verification Form */}
          {step === 1 && (
            <div>
              <p
                style={{
                  fontSize: '14px',
                  marginTop: '11%',
                  textAlign: 'center',
                }}
              >
                Enter the OTP sent to <strong>{fetchedPhoneNumber}</strong>
              </p>
              <OTPForm
                phoneNumber={fetchedPhoneNumber}
                changeNumber={true}
                setStep={handleStepChange} // Pass updated function
              />
            </div>
          )}

          {/* Update Phone Number Form */}
          {step === 2 && (
            <FormProvider {...phoneMethods}>
              <form onSubmit={phoneMethods.handleSubmit(onSubmit)} style={{padding:"44px 44px 44px 44px"}}>
                <Controller
                  name="phone_number"
                  control={phoneMethods.control}
                  render={({ field }) => (
                    <MobileInput
                      {...field} // Spreads field props (like onChange, value, etc.)
                      label="Enter new mobile number"
                      placeholder="Enter new mobile number"
                      required
                      country="IN"
                      error={
                        phoneMethods.formState.errors.phone_number
                          ? String(
                              phoneMethods.formState.errors.phone_number.message
                            ) // Display error
                          : undefined
                      }
                    />
                  )}
                />

                <ButtonInput
                  disabled={false}
                  text="Update"
                  type="submit"
                  styles={{
                    width: '78%',
                    marginLeft: '10%',
                    marginTop: '12%',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? 'var(--tw-bg-light-main)'
                        : 'var(--tw-bg-light-main)',
                    color:
                      theme.palette.mode === 'light'
                        ? 'var(--tw-bg-light-sidebar)'
                        : 'var(--tw-bg-light-sidebar)',
                  }}
                />
              </form>
            </FormProvider>
          )}

          {step === 3 && (
            <div>
              <p
                style={{
                  fontSize: '14px',
                  marginTop: '11%',
                  textAlign: 'center',
                }}
              >
                Enter the OTP sent to <strong>{newPhoneNumber}</strong>
              </p>
              <OTPForm
  phoneNumber={newPhoneNumber}
  changeNumber={true}
  setStep={handleStepChange}
  onSuccess={handleOTPVerificationSuccess} // Callback to update phone number
/>

            </div>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangeMobileNumberModal;
