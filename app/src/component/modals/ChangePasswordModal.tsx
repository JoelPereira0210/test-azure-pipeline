import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Portal, Modal, IconButton } from 'react-native-paper';
import { useTheme } from '../../../theme/themeProvider';
import { z } from 'zod';
import toast from 'react-native-toast-message'; // or your preferred toast library

import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import OTPForm from '../../forms/OTPForm';
import {
  changePasswordAction,
  forgotPasswordAction,
  fetchPhoneNumberAction,
  validateOldPasswordAction,
} from '../../actions/auth';

import { otpSchema,passwordValidation } from '../../lib/zod/auth';

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export const createPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });


const ChangePassword: React.FC<ChangePasswordProps> = ({ open, onClose, userId }) => {
  // Steps: 1 = Old password, 2 = New password, 3 = OTP
  const [step, setStep] = useState<number>(1);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [fetchedPhoneNumber, setFetchedPhoneNumber] = useState<string>('');
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { theme } = useTheme();

  

  // When modal opens, reset everything
  useEffect(() => {
    if (open) {
      setStep(1);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setFetchedPhoneNumber('');
      setIsForgotPassword(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  // Toggle password visibility
  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Called by "Forgot Password?" link
  const fetchPhoneNumber = async (uid: string) => {
    try {
      const phoneNumber = await fetchPhoneNumberAction(uid, 'Changing Password');
      if (phoneNumber) {
        setFetchedPhoneNumber(phoneNumber);
      }
    } catch (error) {
      console.error('Error occurred during phone number retrieval:', error);
    }
  };

  const handleDecrementStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Multi-step continue logic
  const handleContinue = async () => {
    try {
      if (step === 1) {
        // Validate old password
        if (!oldPassword) {
          throw new z.ZodError([
            {
              code: 'custom',
              message: 'Old password is required',
              path: ['oldPassword'],
            },
          ]);
        }
        // Call API to check old password
        const validationResponse = await validateOldPasswordAction(userId, oldPassword);
        if (validationResponse && validationResponse.success) {
          setStep(2);
        } else {
          console.log('Old password does not match');
        }
      } else if (step === 2) {
        // Validate new password + confirm
        createPasswordSchema.parse({
          password: newPassword,
          confirmPassword: confirmPassword,
        });

        // If forgot password, call forgotPasswordAction, else changePasswordAction
        const response = isForgotPassword
          ? await forgotPasswordAction(userId, newPassword)
          : await changePasswordAction(userId, newPassword);

        if (response && typeof response === 'object' && response.success) {
          console.log('Password updated');
          handleClose();
        } else if (response && typeof response === 'object') {
          toast.show({
            type: 'error',
            text1: response.message || 'Failed to change password.',
          });
        } else {
          toast.show({
            type: 'error',
            text1: 'Failed to change password.',
          });
        }
      } else if (step === 3) {
        // Validate OTP
        otpSchema.parse({ otp });
        // If valid, onSuccess is triggered inside OTPForm
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.show({ type: 'error', text1: err.message });
        });
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        console.error(error);
      }
    }
  };

  // Title text for each step
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
    <Portal>
      <Modal
        visible={open}
        onDismiss={handleClose}
        contentContainerStyle={[styles.modalContainer,{backgroundColor: theme.colors.background}]}
      >
        <View style={styles.headerRow}>
          {step > 1 && (
            <IconButton
              icon="chevron-left"
              onPress={handleDecrementStep}
              style={styles.backButton}
            />
          )}
          <Text style={[styles.title, { color: theme.colors.mainText }]}>{getTitle()}</Text>
          <IconButton icon="close" onPress={handleClose} style={styles.closeButton} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Step 1: Old password */}
          {step === 1 && (
            <View>
              <InputField
                label="Enter old password"
                required
                type={showOldPassword ? 'text' : 'password'}
                // No onPaste in RN, remove that
                icon={showOldPassword ? 'eye-off' : 'eye'}
    
                onChange={(val) => setOldPassword(val)}
              />

              {/* Forgot Password Link */}
              <View style={styles.forgotContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    setIsForgotPassword(true);
                    setStep(3); // Move to step 3 (OTP)
                    await fetchPhoneNumber(userId);
                  }}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <ButtonInput
                disabled={false}
                text="Continue"
                onPress={handleContinue}
                styles={styles.continueButton}
              />
            </View>
          )}

          {/* Step 2: Enter New + Confirm password */}
          {step === 2 && (
            <View>
              <InputField
                label="Enter New password"
                required
                type={showPassword ? 'text' : 'password'}
                icon={showPassword ? 'eye-off' : 'eye'}
                onChange={(val) => setNewPassword(val)}
              />
              <View style={{ marginTop: 16 }} />
              <InputField
                label="Confirm password"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onChange={(val) => setConfirmPassword(val)}
              />

              <ButtonInput
                disabled={false}
                text="Update"
                onPress={handleContinue}
                styles={styles.continueButton}
              />
            </View>
          )}

          {/* Step 3: OTP */}
          {step === 3 && (
            <OTPForm
              phoneNumber={fetchedPhoneNumber}
              changeNumber={true}
              setStep={setStep}
              onSuccess={() => {
                // If OTP is correct, proceed to step 2 to set new password
                setStep(2);
              }}
            />
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // backgroundColor: '#fff', // or theme.colors.background
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 50,
    maxHeight: '80%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    paddingVertical: 16,
    // Enough space for all steps
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    color: '#1F64FF',
    textDecorationLine: 'underline',
  },
  continueButton: {
    marginTop: 30,
  },
});

export default ChangePassword;
