import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Portal, Modal,ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../../theme/themeProvider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../UI/InputField/InputField';
import ButtonInput from '../UI/Button/Button';
import { fetchBankDetails, updateBankDetails, validateIfsc } from '../../actions/profile';
import { bankDetailsSchema } from '../../lib/zod/superAdmin';

interface UpdateBankDetailsProps {
  open: boolean;
  onClose: () => void;
}

const UpdateBankDetails: React.FC<UpdateBankDetailsProps> = ({ open, onClose }) => {
  const {
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bankDetailsSchema),
  });

  const [bankDetails, setBankDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const ifscCode = watch('ifscCode');

  useEffect(() => {
    if (open) {
      const fetchDetails = async () => {
        try {
            setIsLoading(true);
          const details = await fetchBankDetails();
          setBankDetails(details);
          setValue('bankAccountNumber', details.accountNumber);
          setValue('accountName', details.accountName);
          setValue('bank', details.bank);
          setValue('branchName', details.branchName);
          setValue('ifscCode', details.IFSCCode);
        } catch (error) {
          console.error('Error fetching bank details:', error);
        }
        finally {
            setIsLoading(false);
          }
      };
      fetchDetails();
    }
  }, [open, setValue]);

  useEffect(() => {
    const fetchIfscBankDetails = async () => {
      try {
        if (ifscCode) {
          const details = await validateIfsc(ifscCode);
          if (details.bankName && details.branchName) {
            setValue('bank', details.bankName);
            setValue('branchName', details.branchName);
            clearErrors('bank');
          }
        } else {
          setValue('bank', '');
          setValue('branchName', '');
        }
      } catch (error) {
        console.error('Error validating IFSC:', error);
        setValue('bank', '');
        setValue('branchName', '');
      }
    };
    fetchIfscBankDetails();
  }, [ifscCode, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const bank = watch('bank') || data.bank;
      const branchName = watch('branchName') || data.branchName;
      const submissionData = { ...data, bank, branchName };

      const response = await updateBankDetails(submissionData);
      if (response.success) {
        setBankDetails(response.data);
        onClose();
      } else {
        console.error('Failed to update bank details:', response);
      }
    } catch (error) {
      console.error('Error updating bank details:', error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        // The key style that keeps the modal from going full screen:
        contentContainerStyle={styles.modalWrapper}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.mainText }]}>
              Update Bank Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: theme.colors.mainText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Scrollable Content */}
          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* Bank Account Number */}
            <Controller
              name="bankAccountNumber"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Bank Account Number"
                  onChange={onChange}
                  value={value}
                  required
                  errorMessage={
                    errors.bankAccountNumber
                      ? String(errors.bankAccountNumber.message)
                      : undefined
                  }
       
                />
              )}
            />

            {/* Account Name */}
            <Controller
              name="accountName"
              control={control}
              rules={{ required: "Account holder's name is required" }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Account Name"
                  onChange={onChange}
                  value={value}
                  required
                  errorMessage={
                    errors.accountName ? String(errors.accountName.message) : undefined
                  }
                  
                />
              )}
            />

            {/* IFSC Code */}
            <Controller
              name="ifscCode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="IFSC Code"
                  onChange={onChange}
                  value={value}
                  required
                  errorMessage={errors.ifscCode ? String(errors.ifscCode.message) : undefined}
                 
                />
              )}
            />

            {/* Branch Name (read only) */}
            <Controller
              name="branchName"
              control={control}
              rules={{ required: 'Branch Name is required' }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Branch Name"
                  onChange={onChange}
                  value={value}
                  required
                  readOnly
                  errorMessage={
                    errors.branchName ? String(errors.branchName.message) : undefined
                  }
                
                />
              )}
            />

            {/* Bank's Name (read only) */}
            <Controller
              name="bank"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Bank's Name"
                  onChange={onChange}
                  value={value}
                  required
                  readOnly
                  errorMessage={errors.bank ? String(errors.bank.message) : undefined}
              
                />
              )}
            />
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.buttonRow}>
            <ButtonInput
              text="Cancel"
              onPress={onClose}
              width={130}
              buttonBackgroundColor={theme.colors.background}
              buttonFontColor={theme.colors.mainText}
              borderColor={theme.colors.mainText}
            />
            <ButtonInput
              text={bankDetails ? 'Update' : 'Add'}
              onPress={handleSubmit(onSubmit)}
              width={130}
            />
          </View>
        </View>
      </Modal>

      {isLoading && (
        <Portal>
          <Modal
            visible={true}
            dismissable={false}
            contentContainerStyle={styles.loaderContainer}
          >
            <ActivityIndicator size="large" color={theme.colors.main} />
          </Modal>
        </Portal>
      )}

    </Portal>
  );
};

const styles = StyleSheet.create({

  modalWrapper: {
  
    marginHorizontal: 20,
   
    marginVertical: 50,
    borderRadius: 20,

    maxHeight: '80%',
   
    width: '90%',
    alignSelf: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
  },
  formContainer: {
    paddingBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  loaderContainer: {
    // backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default UpdateBankDetails;
