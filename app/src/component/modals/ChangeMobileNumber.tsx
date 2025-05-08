import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Portal, Modal, IconButton } from 'react-native-paper';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../UI/InputField/InputField';
import ButtonInput from '../UI/Button/Button';
import { otpSchema, changePhoneNumberSchema } from '../../lib/zod/auth';
import toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';
import { useTheme } from '../../../theme/themeProvider';

import {
  changePhoneNumberAction,
  otpAction,
  fetchPhoneNumberAction,
  phoneNumberAction,
} from '../../actions/auth';

import MobileInput from '../UI/MobileInput/MobileInput';

import OTPForm from '../../forms/OTPForm';
import { NavigationContainer } from '@react-navigation/native';
import { showToast } from '../../utils/toastService';

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
  const [step, setStep] = useState<number>(1);
  const [fetchedPhoneNumber, setFetchedPhoneNumber] = useState<string>('');
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
  const { theme, mode } = useTheme();
  const phoneMethods = useForm({
    resolver: zodResolver(changePhoneNumberSchema),
    defaultValues: {
      phone_number: '',
    },
  });

  // Fetch phone number when modal opens
  useEffect(() => {
    if (open && userId) {
      const fetchPhoneNumber = async () => {
        try {
          const phoneNumber = await fetchPhoneNumberAction(userId, 'Changing Phone Number');
          if (phoneNumber) {
            setFetchedPhoneNumber(phoneNumber);
          }
        } catch (error) {
          console.error('Error fetching phone number:', error);
        }
      };
      fetchPhoneNumber();
    }
  }, [open, userId]);

  const handleClose = () => {
    onClose();
    setStep(1); // Reset step when closing
  };

  // Handle update form submission for Step 2
  const onSubmit = async (data: { phone_number: string }) => {
    console.log('Submitting data:', data);
    setNewPhoneNumber(data.phone_number);
    setStep(3);

    try {
      const response = await phoneNumberAction({
        phone_number: data.phone_number,
        terms_and_conditions: true,
        actionType: 'confirmPhoneNumber',
      });
      console.log('API Response:', response);
      if (response.success) {
        handleClose();
      } else {
        // showToast( 'Failed to update mobile number','error');
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      showToast( 'An error occurred while updating the mobile number.','error');
     
    }
  };

  const handleStepChange = (nextStep: number) => {
    setStep(nextStep);
    if (nextStep === 2) {
      phoneMethods.reset({ phone_number: '' });
    }
  };

  // When OTP verification succeeds in Step 3, update the phone number
  const handleOTPVerificationSuccess = async () => {
    try {
      const response = await changePhoneNumberAction(userId, newPhoneNumber);
      if (response.success) {
        handleClose();
        RNRestart.Restart();
        // Optionally trigger a refresh via a callback prop
      } else {
        showToast('Failed to update phone number.','error');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      showToast('An error occurred while updating the phone number','error');
    }
  };

  return (

    <Portal>
      <Modal
        visible={open}
        onDismiss={handleClose}
        contentContainerStyle={[styles.modalWrapper,{backgroundColor:theme.colors.background}]}
      >

<KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // style={{ flex: 1 }}
        >
          {/* ScrollView to allow content to scroll if it overflows */}
          <ScrollView
            // style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >

        <View style={styles.modalContent}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {step > 1 && (
              <IconButton
                icon="chevron-left"
                onPress={() => handleStepChange(1)}
                style={styles.backButton}
              />
            )}
            <Text style={[styles.headerTitle,{color:theme.colors.mainText}]}>
              {step === 1 ? 'OTP Verification' : 'Change Mobile Number'}
            </Text>
            <IconButton icon="close" onPress={handleClose} style={styles.closeButton} />
          </View>

          {/* Step 1: OTP Verification */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.instructionText,{color:theme.colors.mainText}]}>
                Enter the OTP sent to <Text style={[styles.boldText,{color:theme.colors.mainText}]}>{fetchedPhoneNumber}</Text>
              </Text>
         <NavigationContainer> 
              <OTPForm
                phoneNumber={fetchedPhoneNumber}
                changeNumber={true}
                setSteps={handleStepChange}
              />
    </NavigationContainer>
            </View>
          )}

          {/* Step 2: Update Phone Number */}
          {step === 2 && (
            <FormProvider {...phoneMethods}>
              <View style={styles.formContainer}>
                <Controller
                  name="phone_number"
                  control={phoneMethods.control}
                  render={({ field}) => (
                    <MobileInput
                      // onChange={onChange}
                      // value={value}
                      name={field.name}
                      label="Enter new mobile number"
                      placeholder="Enter new mobile number"
                      required
                      country="IN"
                      error={
                        phoneMethods.formState.errors.phone_number
                          ? String(phoneMethods.formState.errors.phone_number.message)
                          : undefined
                      }
                    />
                  )}
                />
                <ButtonInput
                  disabled={false}
                  text="Update"
                  onPress={phoneMethods.handleSubmit(onSubmit)}
                  styles={styles.updateButton}
                />
              </View>
            </FormProvider>
          )}

          {/* Step 3: OTP for New Phone Number */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.instructionText}>
                Enter the OTP sent to <Text style={styles.boldText}>{newPhoneNumber}</Text>
              </Text>
              <NavigationContainer> 
              <OTPForm
                phoneNumber={newPhoneNumber}
                changeNumber={true}
                setSteps={handleStepChange}
                onSuccess={handleOTPVerificationSuccess}
              />
          </NavigationContainer>
            </View>
          )}
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    marginHorizontal: 20,
    marginVertical: 50,
    borderRadius: 8,
    padding: 16,
    maxHeight: '90%',
  },
  modalContent: {
    height: '100%',
    // flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    // Additional styling if needed
  },
  closeButton: {
    // Additional styling if needed
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  stepContainer: {
    marginTop: 20,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  updateButton: {
    width: '78%',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default ChangeMobileNumberModal;
