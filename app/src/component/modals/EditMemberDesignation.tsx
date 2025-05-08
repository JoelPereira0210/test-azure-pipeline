import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { fetchDesignationData, updateAdminStatus, updateDesignation } from '../../actions/designation';
import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import RadioButtonField from '../UI/RadioInputField/RadioInputField';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import toast from 'react-native-toast-message';
import { useTheme } from '../../../theme/themeProvider';

interface FormValues {
  designationName: string;
  adminPrivileges: boolean;
}

interface Props {
  modalButtonAdd?: string;
  modalButtonCancel?: string;
  open?: boolean;
  fetchData?: () => void;
  onClose?: () => void;
  onClick?: (data: FormValues) => void;
  memberDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isAdmin: boolean;
  } | null;
  selectedDesignation?: { designationName: string };
  CancelIcon?: React.ReactNode;
}

const EditMemberDesignation: React.FC<Props> = (props) => {
  const [designationNameOptions, setDesignationNameOptions] = useState<string[]>([]);
  const [showAlertPopUp, setShowAlertPopUp] = useState(false);
  const {theme} = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      designationName: props.selectedDesignation?.designationName || '',
      adminPrivileges: props.memberDetails?.isAdmin || false,
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);

  // Fetch available designations on mount
  useEffect(() => {
    const handleDesignation = async () => {
      try {
        const response = await fetchDesignationData();
        if (response && response.length > 0) {
          setDesignationNameOptions(response.map((item: any) => item.designationName));
        }
      } catch (error) {
        console.error('Error fetching designation data:', error);
      }
    };
    handleDesignation();
  }, []);

  // Reset form when props change
  useEffect(() => {
    reset({
      designationName: props.selectedDesignation?.designationName || '',
      adminPrivileges: props.memberDetails?.isAdmin || false,
    });
  }, [props.selectedDesignation, props.memberDetails, reset]);

  const handleSave = async (data: FormValues) => {
    const { designationName, adminPrivileges } = data;
    const userId = props.memberDetails?.userId;

    try {
      const designationStatus = await updateDesignation(designationName, userId);
      const adminStatus = await updateAdminStatus(adminPrivileges, userId);

      if (designationStatus === 200 || adminStatus === 200) {
        toast.show({ type: 'success', text1: 'Data updated successfully' });
        props.fetchData?.();
        props.onClose?.();
      }
    } catch (error) {
      console.error('Error updating data:', error);
      toast.show({ type: 'error', text1: 'Failed to update data. Please try again.' });
    }
  };

  const handleCancel = () => {
    reset();
    props.onClose?.();
  };

  return (
    <Portal>
      <Modal
        visible={props.open || false}
        onDismiss={props.onClose}
        contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.background}]}
      >
        <Text style={[styles.title,{color:theme.colors.mainText}]}>
          {props.memberDetails
            ? `${props.memberDetails.firstName} ${props.memberDetails.lastName}`
            : 'Member Details Not Available'}
        </Text>
        <View style={styles.formContainer}>
          <Controller
            name="designationName"
            control={control}
            render={({ field }) => (
              <DropdownField
                label="Designation Name"
                options={[
                  { label: 'Member', value: 'member' },
                  ...designationNameOptions.map((name) => ({ label: name, value: name })),
                ]}
                defaults={field.value}
                onChange={(value: string) => {
                  field.onChange(value);
                  console.log('Designation Name changed:', value);
                }}
              />
            )}
          />
          <Controller
            name="adminPrivileges"
            control={control}
            render={({ field }) => (
              <RadioButtonField
                label="Admin"
                options={[
                  { label: 'Yes', value: 'true' },
                  { label: 'No', value: 'false' },
                ]}
                value={field.value ? 'true' : 'false'}
                onChange={(val: string) => {
                  field.onChange(val === 'true');
                  console.log('Admin Privileges changed:', val);
                }}
              />
            )}
          />
          <View style={styles.buttonContainer}>
            <ButtonInput text="Cancel" onPress={handleCancel}    
            borderColor={theme.colors.mainText}
            buttonBackgroundColor={theme.colors.background}
            buttonFontColor={theme.colors.mainText}/>
            <ButtonInput text="Save" onPress={handleSubmit(handleSave)} />
          </View>
        </View>
      </Modal>
      <ErrorAlertModal
        open={showAlertPopUp}
        errorMessage="No positions available"
        onClose={() => setShowAlertPopUp(false)}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default EditMemberDesignation;
