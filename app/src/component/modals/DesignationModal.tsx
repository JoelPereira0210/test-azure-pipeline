import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';
import RadioButtonField from '../UI/RadioInputField/RadioInputField';
import ConfirmBoxModal from '../UI/Popup/ConfirmBoxModal';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import AlertModal from '../UI/Popup/AlertPopUp';
import { adddesignationAction, updatedesignationAction, deletedesignationAction } from '../../actions/designation';
import { designationSchema } from '../../lib/zod/designationZod';
import { Add_designationTypes as FormValues } from '../../lib/types/addDesignationTypes';
import { useTheme } from '../../../theme/themeProvider';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const numberOfPositionsOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export default function Designation(props: any) {
  const [addButtonText, setAddButtonText] = useState(props.modalButtonAdd);
  const [cancelButtonText, setCancelButtonText] = useState(props.modalButtonCancel);
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errormessage, setErrorMessage] = useState('');
  const [alertDeleteMessage, setAlertDeleteMessage] = useState(false);
  const {theme} = useTheme();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: props.selectedDesignation || {
      designationName: '',
      numberOfPositions: 1,
      adminPrivileges: true,
    },
  });

  useEffect(() => {
    setAddButtonText(props.selectedDesignation ? 'Update' : 'Add');
    if (props.open) {
      setCancelButtonText(props.modalButtonCancel);
    }
  }, [props.selectedDesignation, props.open, props.modalButtonCancel]);

  useEffect(()=>{
    if(!props.open){
      reset
    }
  },[props.open,reset])
  
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = { ...data, designationId: props.selectedDesignation?.designationId || undefined };
      let response;

      if (payload.designationId) {
        response = await updatedesignationAction(payload);
        if (response?.status === 704) return;
        props.onClose();
        props.onDesignationAdded(payload);
      } else {
        response = await adddesignationAction(payload);
      }

      if (response?.status === 409) {
        setErrorMessage('This designation already exists.');
        setOpenErrorModal(true);
      } else if (response?.status === 201) {
        reset();
        props.onClick();
        props.onClose();
      } else {
        props.setSelectedData?.(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (props.selectedDesignation?.designationId) {
        const response = await deletedesignationAction(props.selectedDesignation.designationId);
        
        if (response?.status === 200) {
          props.onDesignationDeleted(props.selectedDesignation.designationId);
          reset();
          props.setSelectedData?.(null);
          props.onClose();
          setOpenDialog(false);
        } else if (response?.status === 207) {
          setAlertDeleteMessage(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Portal>
      <Modal visible={props.open} onDismiss={props.onClose} contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
      <Text style={[styles.title,{color:theme.colors.mainText}]}>Add Designation</Text>
      <View>
        <Controller
        name="designationName"
        control={control}
        render={({ field }) => (
          <InputField
          label="Designation Name"
          {...field}
          required
          errorMessage={errors.designationName ? String(errors.designationName.message) : undefined}
          />
        )}
        />

        <Controller
        name="numberOfPositions"
        control={control}
        render={({ field }) => (
          <DropdownField
          label="Number of Positions"
          options={numberOfPositionsOptions}
          defaults={field.value}
          {...field}
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
          onChange={(val: string) => field.onChange(val === 'true')}
          />
        )}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonInput
        text={cancelButtonText}
        onPress={() => (cancelButtonText === 'Cancel' ? props.onClose() : setOpenDialog(true))}
        width={130}
        buttonBackgroundColor={theme.colors.background}
        buttonFontColor={theme.colors.mainText}
        borderColor={theme.colors.mainText}
        />
        <ButtonInput text={addButtonText} onPress={handleSubmit(onSubmit)}  width={130} />
      </View>
      </Modal>
      <ConfirmBoxModal
      open={openDialog}
      title="Confirm Deletion"
      description="Are you sure you want to delete this designation?"
      onAgree={handleDelete}
      onDisagree={() => setOpenDialog(false)}
      onClose={() => setOpenDialog(false)}
      agreeText="Yes, Delete"
      disagreeText="No, Cancel"
      />
      <ErrorAlertModal
      open={openErrorModal}
      errorMessage={errormessage}
      onClose={() => setOpenErrorModal(false)}
      />
      <AlertModal
      open={alertDeleteMessage}
      onClose={() => {
        setAlertDeleteMessage(false);
        setOpenDialog(false);
      }}
      title="Error"
      note='To delete the designation, remove assignments of people from the designation and try again.'
      buttonText="Close"
      icon={ <Icon name="alert-outline" size={40} color={theme.colors.error} />}
      />
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    // backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
});
