import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, Button, RadioGroup, FormControlLabel, Radio, useTheme } from '@mui/material';
import InputField from '../component/UI/InputField/InputField'; // Ensure the correct import path
import { useForm } from 'react-hook-form'; // Importing necessary hooks from react-hook-form
import { MemberContext } from '@/src/component/context/MemberContext';
import { fetchMemberData, updateMemberData,fetchDesignation } from '../actions/addMembers';
import ButtonInput from '../component/UI/Button/Button';
import DropdownField from '../component/UI/DropDownInputField/DropDownInputField';
import { SelectChangeEvent } from '@mui/material';

const PersonaleInformatioEditForm = () => {
  const { contextUserId, setViewmembersForm } = useContext(MemberContext);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [adminPrivilege, setAdminPrivilege] = useState('');
  const [designations, setDesignations] = useState<any[]>([]); // Change to an array of objects
  const [selectedDesignation, setSelectedDesignation] = useState<string>(''); // State to store selected designation
  const [designationName, setDesignationName] = useState<string>('');
  const [designationId, setDesignationId] = useState<string>('');
  
  console.log("userid",contextUserId)
  const theme = useTheme();
  const mode = theme.palette.mode;

  const handleDesignationChange = (event:any) => {
    const newDesignationName = event.target.value;
    setSelectedDesignation(newDesignationName); // Update the selected designation

    // Find the selected designation object
    const selectedDesignationObj = designations.find(designation => designation.designationName === newDesignationName);

    if (selectedDesignationObj) {
      console.log("Selected Designation Name:", selectedDesignationObj.designationName);
      console.log("Selected Designation ID:", selectedDesignationObj.designationId);
      
      // Store the designation name and ID in state
      setDesignationName(selectedDesignationObj.designationName); // Store designation name
      setDesignationId(selectedDesignationObj.designationId); // Store designation ID
    }
  };
  useEffect(() => {
    console.log("Designation Name:", designationName);
    console.log("Designation ID:", designationId);
  }, [designationName, designationId]);




  const handleAdminChange = (event:any) => {
    const newAdminPrivilege = event.target.value;
    setAdminPrivilege(newAdminPrivilege); 
  };

  const handleUpdateClick = async () => {
    const dataToUpdate = {
      adminPrivilege,
      designationId,
      designationName,
    };

    try {
      const updatedData = await updateMemberData(contextUserId, dataToUpdate); // Call updateMemberData
      console.log("Updated Data:", updatedData);
      setViewmembersForm(false);
    } catch (error) {
      console.error("Error updating member data:", error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch member data
        if (contextUserId) {
          const memberResponse = await fetchMemberData(contextUserId); // Call fetchMemberData with contextUserId
          setUserDetails(memberResponse);
          setSelectedDesignation(memberResponse?.designationName || ''); // Set initial value of selected designation
          console.log("Fetched user details:", memberResponse);
        }

        // Fetch designations
        const designationResponse = await fetchDesignation(contextUserId); // Call fetchDesignation
        setDesignations(designationResponse.roles); // Update designations state with roles from response
        console.log("Fetched designations:", designationResponse.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Execute the fetch function
  }, [contextUserId]); 

  useEffect(() => {
    if (userDetails) {
      setAdminPrivilege(userDetails.isAdmin ? 'Yes' : 'No'); // Update adminPrivilege based on isAdmin
    }
  }, [userDetails]);

  const { control } = useForm();

  

  
  return (
    <Box
      sx={{
        border: '1px solid #9C9AA533',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <Grid container spacing={2}>
        {/* First Name and Last Name */}
        <Grid item xs={12} sm={6}>
          <InputField
            label="First Name"
            type="text"
            disabled={true}
            defaultValue={userDetails?.firstName || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            label="Last Name"
            type="text"
            disabled={true}
            defaultValue={userDetails?.lastName || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputField
            label="Phone Number"
            type="text"
            disabled={true}
            defaultValue={userDetails?.phoneNumber || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputField
            label="Gender"
            type="text"
            disabled={true}
            defaultValue={userDetails?.gender || ''}
          />
        </Grid>

      

        <Grid item xs={12} sm={6}>
          <DropdownField
            label="Select Designation"
            value={selectedDesignation}
            onChange={handleDesignationChange}
            options={designations.map(designation => ({
              label: designation.designationName,
              value: designation.designationName,
            }))}
          />
        </Grid>

       
        <Grid item xs={12} sm={6}>
          <DropdownField
            label="Admin Privilege"
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            value={adminPrivilege}
            onChange={handleAdminChange}
          />
        </Grid>
       
       
        {/* Buttons: Cancel and Update */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', mt: 2 }}>
          <ButtonInput
            disabled={false}
            fontWeight={600}
            onClick={() => {
                
                  setViewmembersForm(false); // Otherwise, close the view
                
              }}
            text='Cancel'
            type="button"
            styles={{
              width: 'fit-content',
              backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'}`,
              color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
              border: `${mode === 'light' ? '1px solid var(--tw-text-light-mainText)' : '1px solid var(--tw-text-dark-mainText)'}`,
            }}
          />
          <ButtonInput
            disabled={false}
            onClick={handleUpdateClick}
            fontWeight={600}
            text='Update'
            type="button"
            styles={{
              width: 'fit-content',
              backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'}`,
              color: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'}`,
              borderColor: `${mode === 'light' ? 'red' : 'red'}`,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonaleInformatioEditForm;