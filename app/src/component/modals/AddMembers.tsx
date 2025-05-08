
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import { AddMembersDataType as FormValues } from '../../lib/types/addMembers.types';
import { addMembersSchema } from '../../lib/zod/members';
import AddMemberTable from '../UI/Tables/AddMemberTable';
import { addMembersActions } from '../../actions/addMembers';
import { useTheme } from '../../../theme/themeProvider';
import MobileInput from '../UI/MobileInput/MobileInput';
import InputField from '../UI/InputField/InputField';
import ExcelUpload from './ExcelUpload';
import { showToast } from '../../utils/toastService';
interface Props {
  modalButtonAdd: string;
  modalButtonCancel: string;
  open: boolean;
  onClose: () => void;
  onRefresh:any
}

const normalizeMobileNumber = (mobileNumber: string) => mobileNumber.replace(/\s+/g, '');

const AddMembers = (props: Props) => {
  const { theme, mode } = useTheme();
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<any[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMembersListTable, setShowMembersListTable] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    setError,
    resetField,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(addMembersSchema),
    defaultValues: {
      mobileNumber: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (editForm) {
      const [firstName, ...lastNameParts] = editForm.name.split(' ');
      const lastName = lastNameParts.join(' ');
      reset({
        mobileNumber: editForm.mobileNumber,
        firstName,
        lastName,
      });
    }
  }, [editForm]);

  const onSubmit = async (newEntry: FormValues) => {
    console.log("new entry is",newEntry);
    if (editForm) {
      const updatedData = jsonData.map((item) =>
        item.id === editForm.id
          ? { ...item, mobileNumber: newEntry.mobileNumber, firstName: newEntry.firstName, lastName: newEntry.lastName, error: null }
          : item
      );
      setJsonData(updatedData);
      setEditForm(null);
    } else {
      const isDuplicate = jsonData.some(
        (item) => normalizeMobileNumber(item.mobileNumber) === normalizeMobileNumber(newEntry.mobileNumber)
      );
      if (isDuplicate) {
        
        setError('mobileNumber', { type: 'manual', message: `Mobile number ${newEntry.mobileNumber} already exists.` });
        return; 
      } else {
        const newJsonData = {
          id: jsonData.length + 1,
          mobileNumber: newEntry.mobileNumber,
          firstName: newEntry.firstName,
          lastName: newEntry.lastName,
          error: null,
        };
        setJsonData([...jsonData, newJsonData]);
      }
    }
    reset({
      mobileNumber: '',
      firstName: '',
      lastName: '',
    });
    setValue('mobileNumber', '');
    resetField('mobileNumber');
  };


  
  const onRemove = () => {
    setJsonData(jsonData.filter((item) => !selectedEntries.includes(item.id)));
  };

  const addMembersHandler = async () => {
    try {
      await addMembersActions(jsonData);
      props.onClose(); // Close modal after submission
      props.onRefresh(); // Refresh table data
    } catch (error) {
      showToast( 'Error adding members','error');
    }
  };

  return (
    <Portal>
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ flexGrow: 1 }}> */}
      <Modal visible={props.open} onDismiss={props.onClose} contentContainerStyle={styles.modalWrapper}>
      <ScrollView style={styles.modalScrollView}>
        <View style={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Members</Text>
            <TouchableOpacity onPress={props.onClose}>
              <Text style={[styles.closeButton,{color:theme.colors.mainText}]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <MobileInput
                name={field.name}
                control={control}
                label="Mobile Number"
                required={true}
                placeholder="Mobile Number"
                error={errors.mobileNumber ? String(errors.mobileNumber.message) : undefined}
                country="IN"
              />
              )}
            />
           
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <InputField
                label="First Name"
                required
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.firstName?.message}
              />
              )}
            />
           
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <InputField
                label="Last Name"
                required
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.lastName?.message}
              />
              )}
            />
          </View>

          <View style={styles.noteContainer}> 

                   <View style={styles.excelUploadContainer}>

                        <ExcelUpload 
                          jsonData={jsonData}
                          setJsonData={setJsonData}
                          setShowTable={setShowTable}
                        />

                              {/* Add Button */}
                        <View style={styles.buttonContainer}>
                          <ButtonInput text="Add" onPress={handleSubmit(onSubmit)} width={150} fontSize={14} />
                        </View>


                      </View>

                      <Text style={{color:'red',fontWeight:'600'}}>Note:</Text>
                      <Text style={[{color:theme.colors.mainText}]}>CSV should have three mandatory columns with column titles as "First Name", "Last Name" and "Mobile Number"</Text>
              </View>

    

          {/* Always show the list box even if empty */}
          <View style={[styles.listContainer,{backgroundColor:theme.colors.background,borderWidth:1,borderColor:theme.colors.mainText}]}>
            {jsonData.length > 0 ? (
              <AddMemberTable
                jsonData={jsonData}
                setEditForm={setEditForm}
                setSelectedEntries={setSelectedEntries}
                setShowTable={setShowTable}
              />
            ) : (
              <Text style={styles.emptyText}>No members added yet</Text>
            )}
          </View>

          {/* Remove, Submit, and Cancel Buttons */}
          <View style={styles.bottomButtons}>
            <ButtonInput text="Remove" onPress={onRemove} disabled={jsonData.length === 0} width={130}              
            />
            <ButtonInput text="Submit" onPress={addMembersHandler} width={130}/>
            
          </View>
        </View>
        </ScrollView>
      </Modal>
      {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalScrollView: {
    maxHeight: '80%', // Adjust as needed for your design
    width: '90%',
  },
  modalContainer: {
    borderRadius: 10,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
  },
  form: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonContainer: {
    // marginVertical: 5,
    // width: '100%', // Ensures button alignment
    // alignItems: 'center',
  },
  excelUploadContainer: {
    // marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap:10
  },
  noteContainer:{
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listContainer: {
    maxHeight: 200, // Limits height of the list dynamically
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: 'gray',
  },
  bottomButtons: {
    flexDirection: 'row', // Stack buttons for smaller screens
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    gap: 15, // Adds spacing between buttons
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default AddMembers;
