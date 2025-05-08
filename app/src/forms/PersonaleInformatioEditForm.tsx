// PersonaleInformatioEditForm.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import InputField from '../component/UI/InputField/InputField'; // Native InputField component
import ButtonInput from '../component/UI/Button/Button'; // Native Button component
import { useForm } from 'react-hook-form';
import { MemberContext } from '../component/context/MemberContext';
import { fetchMemberData, updateMemberData, fetchDesignation } from '../actions/addMembers';
import { useTheme } from '../../theme/themeProvider';
import DropdownField from '../component/UI/DropDownInputField/DropDownInputField';
import RNRestart from 'react-native-restart';

const PersonaleInformatioEditForm = () => {
  const { contextUserId, setViewmembersForm } = useContext(MemberContext);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [adminPrivilege, setAdminPrivilege] = useState('');
  const [designations, setDesignations] = useState<any[]>([]);
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');
  const [designationName, setDesignationName] = useState<string>('');
  const [designationId, setDesignationId] = useState<string>('');

  const { theme, mode } = useTheme(); // mode can be 'light' or 'dark'

  // Handler for designation dropdown: receives a value (string or number)
  const handleDesignationChange = (value: string | number) => {
    const newDesignationName = value.toString();
    setSelectedDesignation(newDesignationName);
    const selectedObj = designations.find(
      (designation) => designation.designationName === newDesignationName
    );
    if (selectedObj) {
      console.log("Selected Designation Name:", selectedObj.designationName);
      console.log("Selected Designation ID:", selectedObj.designationId);
      setDesignationName(selectedObj.designationName);
      setDesignationId(selectedObj.designationId);
    }
  };

  useEffect(() => {
    console.log("Designation Name:", designationName);
    console.log("Designation ID:", designationId);
  }, [designationName, designationId]);

  // Handler for admin privilege dropdown
  const handleAdminChange = (value: string | number) => {
    setAdminPrivilege(value.toString());
  };

  const handleUpdateClick = async () => {
    const dataToUpdate = {
      adminPrivilege,
      designationId,
      designationName,
    };

    try {
      const updatedData = await updateMemberData(contextUserId, dataToUpdate);
      console.log("Updated Data:", updatedData);
      // setViewmembersForm(false);
      RNRestart.restart();
    } catch (error) {
      console.error("Error updating member data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contextUserId) {
          const memberResponse = await fetchMemberData(contextUserId);
          setUserDetails(memberResponse);
          setSelectedDesignation(memberResponse?.designationName || '');
          console.log("Fetched user details:", memberResponse);
        }
        const designationResponse = await fetchDesignation(contextUserId);
        setDesignations(designationResponse.roles);
        console.log("Fetched designations:", designationResponse.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [contextUserId]);

  useEffect(() => {
    if (userDetails) {
      setAdminPrivilege(userDetails.isAdmin ? 'Yes' : 'No');
    }
  }, [userDetails]);

  const { control } = useForm(); // Not used further in this example

  return (
    // <ScrollView contentContainerStyle={styles.container}>
    <ScrollView contentContainerStyle={[{ flexGrow: 1, padding: 16 }, { backgroundColor: theme.colors.background }]}>
      {/* First Row: First Name & Last Name */}
      <View style={styles.row}>
        <View style={styles.full}>
          <InputField
            label="First Name"
            type="text"
            disabled={true}
            value={userDetails?.firstName || ''}
          />
        </View>
        <View style={styles.full}>
          <InputField
            label="Last Name"
            type="text"
            disabled={true}
            value={userDetails?.lastName || ''}
          />
        </View>
      </View>

      {/* Second Row: Phone Number & Gender */}
      <View style={styles.row}>
        <View style={styles.full}>
          <InputField
            label="Phone Number"
            type="text"
            disabled={true}
            value={userDetails?.phoneNumber || ''}
          />
        </View>
        <View style={styles.full}>
          <InputField
            label="Gender"
            type="text"
            disabled={true}
            value={userDetails?.gender || ''}
          />
        </View>
      </View>

      {/* Third Row: Designation Dropdown using DropdownField */}
      <View style={styles.row}>
        <View style={styles.full}>
          <DropdownField
            label="Select Designation"
            options={designations.map((designation) => ({
              label: designation.designationName,
              value: designation.designationName,
            }))}
            defaults={selectedDesignation}
            onChange={handleDesignationChange}
          />
        </View>
      </View>

      {/* Fourth Row: Admin Privilege Dropdown using DropdownField */}
      <View style={styles.row}>
        <View style={styles.full}>
          <DropdownField
            label="Admin Privilege"
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            defaults={adminPrivilege}
            onChange={handleAdminChange}
          />
        </View>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <ButtonInput
          disabled={false}
          onPress={
            // () => setViewmembersForm(false)
           () => RNRestart.restart()
          }
          text="Cancel"
          type="button"
          width={120}
        />
        <ButtonInput
          disabled={false}
          onPress={handleUpdateClick}
          text="Update"
          type="button"
          width={120}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#9C9AA533',
    borderRadius: 8,
    marginBottom:20,
   height:'100%'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 12,
  },
  full: {
    width: '100%',
    // marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 5,
  },
});

export default PersonaleInformatioEditForm;
