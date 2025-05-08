import React, { useEffect, useState } from 'react';
import FilterListTable from '../UI/Tables/FilterListTable';
import {
  Checkbox,
  Box,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import ButtonInput from '../UI/Button/Button';
import { useTheme } from '@mui/material';
import ConfirmBoxModel from '../UI/Popup/ConfirmBoxModel';
import { addMemebersDesignation } from '@/src/actions/designation';
import { updateDesignationCountAPI } from '@/src/actions/designation';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import PaginationFooter from '../UI/TableFooter/TableFooter';

const MemberListTableModal = ({
  selectedDesignation,
  onClose,
  open,
  userDetails, fetchData,
  modalButtonCancelText,
  currentPage,  
  pageSize,     
  onPageChange,  
  totalRecords,
}) => {

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [errorModal, setErrorModal] = useState(false);
  const [designationCount, setDesignationCount] = useState({}); // New state for designation count


  useEffect(() => {
    if (open) {
      fetchData(selectedDesignation, null, '', currentPage, pageSize);
    }
  }, [currentPage, open]); // ✅ Fetch new data on page change or modal open

  useEffect(() => {
    if (!open) {
      setSelectedMembers([]);
      setCheckedCount(0); // Reset the checked count if needed
      setDesignationCount({}); // Reset designation count if needed
    }
  }, [open]);

  console.log('recievd deig', selectedDesignation);

 

  useEffect(() => {
    if (userDetails) {
      console.log('Received userDetails:', userDetails); // Log the userDetails
    }
  }, [userDetails]);

  const theme = useTheme();
  const mode = theme.palette.mode;

  // Define the column headers
  const columnArray = [
    { field: 'actions', headerName: 'Actions' }, // This will be for the checkbox
    { field: 'name', headerName: 'Name' },
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'designation', headerName: 'Designation' },
  ];

  // Map userDetails to the table row structure
  const tableData = userDetails
    ?.filter((member) => member.designationName !== selectedDesignation)
    .map((member) => ({
      id: member.id, // Assuming there's an ID field in userDetails for unique keys
      actions: (
        <Checkbox
          onChange={(e) => handleCheckboxChange(e, member.userId)} // Pass userId for tracking
          checked={selectedMembers.includes(member.userId)} // Check if the member is selected
          color="primary" // You can change the color here if you want
        />
      ), // Checkbox for the Actions column
      name: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${member.firstName} ${member.lastName}`}
            // src={member.avatar}
            src={member.profilePicture || null}
            style={{
              marginRight: 8,
              width: 24,
              height: 24,
              border: '2px solid #7152F3',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          />
          {`${member.firstName} ${member.lastName}`}
        </div>
      ),
      mobileNumber: member.phoneNumber, // Mobile number
      designation: (
        <Box
          sx={{
            backgroundColor: '#7152F31A',
            color: '#7152F3',
            padding: '4px 8px',
            borderRadius: '4px',
            height: '35px',
            width: '100%',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {member.designationName}
        </Box>
      ),
    }));

  const handleCheckboxChange = async (e, memberId) => {
    const isChecked = e.target.checked;

    // Update selected members based on whether the checkbox is checked or unchecked
    const updatedMembers = isChecked
      ? [...selectedMembers, memberId] // Add memberId if checked
      : selectedMembers.filter((id) => id !== memberId); // Remove memberId if unchecked

    // Update checked count
    const totalCheckedCount = updatedMembers.length; // Total count of checked records
    setSelectedMembers(updatedMembers); // Update the selected members
    setCheckedCount(totalCheckedCount); // Update the count of checked records

    // Log the total count of checked records
    console.log('Total Checked Count:', totalCheckedCount); // Log the total checked count

    // Get the selected records based on the updated selected members
    const selectedRecords = userDetails.filter((member) =>
      updatedMembers.includes(member.userId)
    );

    // Create a new designation count object
    const newDesignationCount = {};

    // Count designations in the selected records
    selectedRecords.forEach((record) => {
      const designation = record.designationName;

      // Increment the count if the designation already exists
      if (newDesignationCount[designation]) {
        newDesignationCount[designation]++;
      } else {
        // Otherwise, initialize the count for this designation
        newDesignationCount[designation] = 1;
      }
    });

    // Update the designation count state
    setDesignationCount(newDesignationCount);

    // Log the updated count to the console
    console.log(
      'Updated Designation Count:',
      newDesignationCount,
      selectedDesignation
    );

    try {
      const response = await updateDesignationCountAPI(
        totalCheckedCount,
        selectedDesignation
      );

      // Check if the response indicates success or not
      if (
        response &&
        response.message === 'Designation count updated successfully'
      ) {
        console.log('Success: Designation count updated successfully');
      } else {
        console.log(
          'Failed: ',
          response.message || 'Unexpected error in updating designation count'
        );
      }
    } catch (error) {
      console.error('Error occurred while sending designation data:', error); // Log the error
    }
  };

  const handleAddClick = async () => {
    // Attempt to update the designation count before proceeding
    try {
      const response = await updateDesignationCountAPI(
        checkedCount,
        selectedDesignation
      );

      // Check if the response indicates success or not
      if (
        response &&
        response.message === 'Designation count updated successfully'
      ) {
        console.log('Success: Designation count updated successfully');
        // setErrorModal(false)
        setConfirmOpen(true); // Show the confirmation modal if successful
      } else {
        console.log(
          'Failed: ',
          response.message || 'Unexpected error in updating designation count'
        );
        setErrorModal(true); // Set the error message
      }
    } catch (error) {
      console.error('Error occurred while sending designation data:', error); // Log the error
    }
  };

  const handleSubmit = async () => {
    const selectedRecords = userDetails.filter((member) =>
      selectedMembers.includes(member.userId)
    );

    // Collect the selected userIds
    const selectedUserIds = selectedRecords.map((record) => record.userId);

    // Create a designation count object
    const newDesignationCount = {};

    // Loop through the selected records and count the designations
    selectedRecords.forEach((record) => {
      const designation = record.designationName;

      // If the designation already exists in the object, increment its count
      if (newDesignationCount[designation]) {
        newDesignationCount[designation]++;
      } else {
        // Otherwise, initialize the count for this designation
        newDesignationCount[designation] = 1;
      }
    });

    // Update the state with the new designation count
    setDesignationCount(newDesignationCount);

    // Prepare the designation output string
    const designationsSelected = Object.entries(newDesignationCount)
      .map(([designation, count]) => `${designation} with count ${count}`)
      .join(', ');

    // Log the final result in one line
    console.log(
      `UserIds selected are: ${selectedUserIds.join(
        ', '
      )}, Designations selected are: ${designationsSelected}`
    );

    // Log the designation count state
    console.log('Designation Count State:', newDesignationCount);
    try {
      const designationResponse = await addMemebersDesignation(
        selectedDesignation,
        newDesignationCount,
        selectedUserIds
      );
      console.log('Designation response from API:', designationResponse); // Log the response

      await fetchData();
      // alert("JI")
      onClose();
    } catch (error) {
      console.error('Error occurred while sending designation data:', error); // Log the error
    }
  };
  console.log("tableData", userDetails)
  return (
    <>
      <Dialog
        open={open}
        // onClose={onClose}
        fullWidth
        maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            border: '2px solid #F5F6FA33', // Add a white border
            borderRadius: '8px', // Optional: rounded corners
          },
        }}
      >
        {/* <DialogContent
          style={{
            backgroundColor: mode === 'dark' ? 'black' : 'white',
          }}
        >
          <Typography
            style={{
              fontSize: '30px',
              marginBottom: '32px',
              color:
                mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)',
              fontWeight: '500',
            }} // Set font size and margin
            align="center"
          >
            Add {selectedDesignation} 
          </Typography>
          <div>
            <FilterListTable
              columnNameArray={columnArray}
              tableData={tableData} toDisplayFooter={true}
            />
          </div>
        </DialogContent> */}
        <DialogContent style={{
          backgroundColor: mode === 'dark' ? 'black' : 'white',
        }}>
          <Typography
            style={{
              fontSize: '30px', marginBottom: '32px', color:
                mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)', fontWeight: '500'
            }} // Set font size and margin
            align="center"
          >
            Add {selectedDesignation} {/* Added "Add" before the designation */}
          </Typography>
          {tableData && tableData.length > 0 ? (
            <div>
              <FilterListTable columnNameArray={columnArray} tableData={tableData} toDisplayFooter={true} />
              {/* <PaginationFooter
                currentPage={currentPage}
                totalRecords={totalRecords}
                pageSize={pageSize}
                onPageChange={onPageChange}
              /> */}
            </div>
          ) : (
            <Typography align="center" style={{ color: mode === 'dark' ? 'white' : 'black', marginTop: '20px' }}>
              No members available to add for this designation
            </Typography>
          )}
        </DialogContent>

        {/* <DialogActions
          style={{
            justifyContent: 'center',
            display: 'flex',
            gap: '16px',
            backgroundColor: mode === 'dark' ? 'black' : 'white',
          }}
        >
          <ButtonInput
            text={modalButtonCancelText}
            type="button"
            styles={{
              flex: '0 0 120px',
              backgroundColor: '#A2A1A833',
              color:
                mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)',
              '&:hover': {
                backgroundColor: '#A2A1A833',
              },
            }}
            onClick={onClose} // Close the modal on click
          />
          <ButtonInput
            text="Add"
            type="submit"
            styles={{
              flex: '0 0 120px', // Set a specific width for the Submit button
            }}
            onClick={handleAddClick}
          />
        </DialogActions> */}
        <DialogActions
          style={{
            justifyContent: 'center',
            display: 'flex',
            gap: '16px',
            backgroundColor: mode === 'dark' ? 'black' : 'white',
          }}
        >
          <ButtonInput
            text={modalButtonCancelText}
            type="button"
            styles={{
              flex: '0 0 120px',
              backgroundColor: '#A2A1A833',
              color:
                mode === 'light'
                  ? 'var(--tw-text-light-mainText)'
                  : 'var(--tw-text-dark-mainText)',
              '&:hover': {
                backgroundColor: '#A2A1A833',
              },
            }}
            onClick={onClose}
          />

          {/* Conditionally render the Add button based on tableData length */}
          {tableData && tableData.length > 0 && (
            <ButtonInput
              text="Add"
              type="submit"
              styles={{
                flex: '0 0 120px', // Set a specific width for the Submit button
              }}
              onClick={handleAddClick}
            />
          )}
        </DialogActions>

      </Dialog>
      <ConfirmBoxModel
        open={confirmOpen}
        agreeText="Yes"
        disagreeText="No"
        title="Are you sure you want to change designation"
        description="Previous designation will be change"
        onAgree={() => {
          setConfirmOpen(false); // Close the confirmation modal
          handleSubmit(); // Proceed with the actual submission
        }}
        onDisagree={() => setConfirmOpen(false)} // Close the confirmation modal without submitting
        onClose={() => setConfirmOpen(false)}
        titleFontSize="20px"
      />
      <ErrorAlertModal
        open={errorModal}
        onClose={() => setErrorModal(false)} // Close error modal
        errorMessage="You cant assign designation"
      />
    </>
  );
};

export default MemberListTableModal;
